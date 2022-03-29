import { CACHE_MANAGER, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Db, ObjectId } from 'mongodb';
import { UtilsService } from 'src/utils/utils.service';
import { HashUrlDto, CustomUrlShortenerDto } from './dto/custom-url-shortener.dto';
import { EditUrlDto } from './dto/edit-url.dto';
import { UrlShortenerDto } from './dto/url-shortener.dto';
import { FindOriginalUrlByHashResponse, UrlInterface } from './interface/url.interface';

@Injectable()
export class UrlService {
    constructor(
        @Inject("DATABASE_CONNECTION")
        private db:Db,
        private utils:UtilsService,

        // cache url data
        @Inject(CACHE_MANAGER) 
        private urlCache: Cache
    ){}
    private readonly UrlCollection=this.db.collection("url");


// ****************************************************************************************************
    // find All user urls
    async findAll(userId:ObjectId):Promise<UrlInterface[]>{        
        return (await this.UrlCollection.find({userId}).toArray()) as unknown as UrlInterface[];
    }

// ****************************************************************************************************
    // find url data by hash
    async findByHash({hash}:HashUrlDto,userId?:ObjectId):Promise<UrlInterface>{   
        
        let query= userId ? await this.UrlCollection.findOne({hash,userId}) : await this.UrlCollection.findOne({hash});
        const url=query;
        if(!url) throw new NotFoundException("Url not found !")
        return url as unknown as UrlInterface;   
    }

// ****************************************************************************************************
    // find **original url** by hash
    async findOriginalUrlByHash(urlHash:HashUrlDto):Promise<FindOriginalUrlByHashResponse>{   
        // check cache manager
        const {hash}=urlHash
        const cache=(await this.urlCache.get(hash)) as FindOriginalUrlByHashResponse;
        if(cache) return cache
        const url=await this.findByHash(urlHash);
        // save to cache manager
        await this.urlCache.set(hash,{originalUrl:url['originalUrl']},{ttl:60}) // expire time=60sec

        return {originalUrl:url['originalUrl']}
    }

// ***************************************************************************************************
    // shortener url **without** authentication and customization
    async urlShortener(urlShortenerDto:UrlShortenerDto):Promise<UrlInterface>{
        const {url}=urlShortenerDto;
        // don't shortener it one more if URL was exist
        const urlIsExist=(await this.UrlCollection.findOne({ originalUrl:url,userId:undefined })) as unknown as UrlInterface
        if(urlIsExist)
            return urlIsExist;
        // shortener new url
        const shortener:UrlInterface={
            hash:await this.utils.generateHash(),
            originalUrl:(url.startsWith("https://")||url.startsWith("http://"))? url : "http://"+url,
            expireAt:Math.floor(Date.now() / 1000)+(60*60*24*365), // expire in 1 year
            createdAt:Math.floor(Date.now() / 1000),
            visitCount:0
        };
        await this.UrlCollection.insertOne(shortener);
        return shortener;
    }

// ***************************************************************************************************
    // customization url shortener
    async customUrlShortener(customUrlShortener:CustomUrlShortenerDto,userId:ObjectId):Promise<UrlInterface>{
        const {hash,originalUrl,expireAt} =customUrlShortener;
        // check originalurl exists or not
        const urlIsExist=await this.UrlCollection.findOne({originalUrl,userId})
        if(urlIsExist)
            throw new ConflictException("Url already exist! ")

        const shortUrl:UrlInterface={
            hash:"",
            originalUrl,
            userId,
            expireAt:expireAt,
            createdAt:Date.now(),
            visitCount:0
        }    
        //if user want to create a custom hash, check hash is unique
        if(hash) {
            // if hash exists, throw new Error
            await this.IsHashExist({hash});
            // else, use custom hash
            shortUrl.hash=hash;
        }
        // if  user doesn't want to create a custom hash, create  a random hash
        else{
            shortUrl.hash=await this.utils.generateHash()            
        }
        // finaly, save that.
        await this.UrlCollection.insertOne(shortUrl)
        return shortUrl;
    }


// ****************************************************************************************************
    // remove url
    async remove(urlHash:HashUrlDto,userId:ObjectId):Promise<string>{   
        await this.findByHash(urlHash,userId);
        const {hash}=urlHash
        await this.UrlCollection.deleteOne({hash})
        return "ok"
    }


// ***************************************************************************************************
    //edit url
    async edit(urlHash:HashUrlDto,editUrl:EditUrlDto,userId:ObjectId):Promise<string>{   
        const url=await this.findByHash(urlHash,userId);
        
        const {expireAt,originalUrl}=editUrl

        await this.UrlCollection.updateOne({hash:urlHash.hash},{
            $set :
            {
                "expireAt" : expireAt || url.expireAt,
                "originalUrl" : originalUrl || url.originalUrl
            }
        })
        return "updated"
    }

// ***************************************************************************************************
    // check hash existence
    async IsHashExist({hash}):Promise<void>{
        const url=await this.UrlCollection.findOne({hash});
        
        if(url) throw new ConflictException("Url hash exists!")
    }

}

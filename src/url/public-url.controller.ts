import { Body, Controller, Post, UsePipes, ValidationPipe, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HashUrlDto } from './dto/custom-url-shortener.dto';
import { UrlShortenerDto } from './dto/url-shortener.dto';
import { FindOriginalUrlByHashResponse, UrlInterface } from './interface/url.interface';
import { UrlService } from './url.service';

@Controller('public')
@ApiTags("Public URL shortener")
export class PublicUrlController {
    constructor(
        private service:UrlService
    ){}

    // get original url by hash 
    @Get(":hash/original-url")
    @UsePipes(ValidationPipe)
    findOriginalUrlByHash(@Param() hash:HashUrlDto):Promise<FindOriginalUrlByHashResponse>{
        return this.service.findOriginalUrlByHash(hash)
    }


    // shortener url without authentication and customization
    @Post("/shortener")
    @UsePipes(ValidationPipe)
    urlShortener(@Body() urlShortenerDto:UrlShortenerDto):Promise<UrlInterface> {
        return this.service.urlShortener(urlShortenerDto)
    }

    // custom hash URL exists or not
    @Post("/check-hash-existence")
    @UsePipes(ValidationPipe)
    urlIsExist(@Body() customHashUrlDto:HashUrlDto):Promise<void> {
         return this.service.IsHashExist(customHashUrlDto);   
    }

}

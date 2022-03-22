import { Body, Controller, Post, UsePipes, ValidationPipe, UseGuards, Get, Delete, Param, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/decorator/user.decorator';
import { HashUrlDto, CustomUrlShortenerDto } from './dto/custom-url-shortener.dto';
import { EditUrlDto } from './dto/edit-url.dto';
import { UrlShortenerDto } from './dto/url-shortener.dto';
import { FindOriginalUrlByHashResponse, UrlInterface } from './interface/url.interface';
import { UrlService } from './url.service';

@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('url')
@ApiTags("URL shortener")
export class UrlController {
    constructor(
        private service:UrlService
    ){}

    
    // shortener url
    @Post()
    @UsePipes(ValidationPipe)
    customUrlShortener(@Body() customUrlShortener:CustomUrlShortenerDto, @User() user):Promise<UrlInterface>{
        return this.service.customUrlShortener(customUrlShortener,user['_id'])
    }

    // get all url
    @Get()
    findAll(@User() user):Promise<UrlInterface[]>{        
        return this.service.findAll(user['_id'])
    }

    // get url data by hash
    @Get(":hash")
    @UsePipes(ValidationPipe)
    findByHash(@Param() hash:HashUrlDto,@User() user):Promise<UrlInterface>{
        return this.service.findByHash(hash,user['_id'])
    }

    // remove hash
    @Delete(":hash")
    @UsePipes(ValidationPipe)
    remove(@Param() hash:HashUrlDto,@User() user):Promise<string>{
        return this.service.remove(hash,user['_id'])
    }

    // edit url
    @Patch(":hash")
    @UsePipes(ValidationPipe)
    edit(@Param() hash:HashUrlDto,@Body()  editUrlDto:EditUrlDto,@User() user):Promise<string>{
        return this.service.edit(hash,editUrlDto,user['_id'])
    }

}

import { Body, Controller, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import {FastifyReply} from 'fastify'
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConfigService } from '@nestjs/config';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private authService:AuthService,
        private configService:ConfigService
    ){}

    @Post("/register")
    @UsePipes(ValidationPipe)
    register(@Body() authCredentialsDto:AuthCredentialsDto):Promise<void>{
        return this.authService.register(authCredentialsDto)
    }

    @Post("/login")
    @UsePipes(ValidationPipe)
    async login(@Body() authCredentialsDto:AuthCredentialsDto,@Res({ passthrough: true }) response: FastifyReply){
        const {token}=await this.authService.login(authCredentialsDto)
        response.setCookie("accessToken",token,{
            path:"/",
            secure:true,
            httpOnly:true,
            expires:this.configService.get<Date>('cookie.expires')
        }).send({token})
        // return {token}
    }
}

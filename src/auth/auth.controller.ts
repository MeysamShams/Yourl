import { Body, Controller, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import {FastifyReply} from 'fastify'
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private authService:AuthService
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
            expires:new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)) // 7 days
        }).send({token})
        // return {token}
    }
}

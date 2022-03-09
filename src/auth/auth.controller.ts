import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
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
    login(@Body() authCredentialsDto:AuthCredentialsDto):Promise<{token:string}>{
        return this.authService.login(authCredentialsDto)
    }
}

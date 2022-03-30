import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports:[
    DatabaseModule,
    PassportModule.register({defaultStrategy:"jwt"}),
    JwtModule.registerAsync({
      inject:[ConfigService],
      useFactory:async(config:ConfigService)=>({
          secret:config.get<string>("jwt.secret"),
          signOptions:{
            expiresIn:config.get<string>('jwt.expiresIn') // 7 days
          }
        })
    }),
  ],
  providers: [AuthService,JwtStrategy],
  controllers: [AuthController],
  exports:[JwtStrategy,PassportModule]
})
export class AuthModule {}

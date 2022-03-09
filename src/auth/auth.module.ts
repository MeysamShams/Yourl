import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports:[
    DatabaseModule,
    PassportModule.register({defaultStrategy:"jwt"}),
    JwtModule.register({
      secret:"StrongSecret",
      signOptions:{
        expiresIn:86400 // 1 day
      }
    }),
  ],
  providers: [AuthService,JwtStrategy],
  controllers: [AuthController],
  exports:[JwtStrategy,PassportModule]
})
export class AuthModule {}

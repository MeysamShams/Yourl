import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Db } from "mongodb";
import {Strategy} from 'passport-jwt'
import { JwtPayloadInterface } from "../interface/jwtPayload.interface";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @Inject("DATABASE_CONNECTION")
        private db:Db,
        private configService: ConfigService
    ){
        super({
            secretOrKey:configService.get<string>("jwt.secret"),
            ignoreExpiration: false,
            jwtFromRequest:(req:any) => {
                if (!req || !req.cookies) return null;
                return req.cookies['accessToken'];
              },
        })
    }

    async validate(payload:JwtPayloadInterface){
        const {username}=payload
        const user=await this.db.collection("user").findOne({username});
        if(!user){
            throw new UnauthorizedException()
        }
        delete user['password']
        return  user
    }
}
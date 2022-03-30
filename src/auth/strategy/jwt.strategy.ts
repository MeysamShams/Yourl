import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Db } from "mongodb";
import {Strategy} from 'passport-jwt'
import { JwtPayloadInterface } from "../interface/jwtPayload.interface";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @Inject("DATABASE_CONNECTION")
        private db:Db
    ){
        super({
            secretOrKey:"Vg7$2!klTM&yoP@",
            ignoreExpiration: false,
            jwtFromRequest:(req) => {
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
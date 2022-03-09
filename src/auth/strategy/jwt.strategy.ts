import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Db } from "mongodb";
import {ExtractJwt,Strategy} from 'passport-jwt'
import { JwtPayloadInterface } from "../interface/jwtPayload.interface";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @Inject("DATABASE_CONNECTION")
        private db:Db
    ){
        super({
            secretOrKey:"StrongSecret",
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload:JwtPayloadInterface){
        const {username}=payload
        const user=await this.db.collection("user").findOne({username});
        if(!user){
            throw new UnauthorizedException()
        }
        return user
    }
}
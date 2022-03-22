import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Db } from 'mongodb';
import * as bcrypt from 'bcrypt'
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayloadInterface } from './interface/jwtPayload.interface';


@Injectable()
export class AuthService {
    constructor(
        // inject database provider and JWT service
        @Inject("DATABASE_CONNECTION")
        private db:Db,
        private jwtService:JwtService
    ){}
    private readonly collection=this.db.collection("user");

    async register(authCredentialsDto:AuthCredentialsDto):Promise<void>{

        const {username,password}=authCredentialsDto
        // hash password
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        
        // check username in db
        const user=await this.collection.findOne({username})
        if(user) throw new ConflictException("Username already exist !")

        // create new user
        await this.collection.insertOne({username,password:hashedPassword})
        

    }

    async login(authCredentialsDto:AuthCredentialsDto):Promise<{token:string}>{

        // check username and password
        const {username,password}=authCredentialsDto
        const user=await this.collection.findOne({username});
        
        // compare password
        if(user && (await bcrypt.compare(password,user.password))) {
            // generate access token
            const payload:JwtPayloadInterface={username}
            const token=await this.jwtService.signAsync(payload)
            return {token};
        }
        else throw new BadRequestException("Username or password is wrong ! ")
    }
}

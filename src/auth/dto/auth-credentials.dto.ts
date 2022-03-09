import { ApiProperty } from "@nestjs/swagger"
import {  Length } from "class-validator"

export class AuthCredentialsDto{
    
    @ApiProperty({
        required:true,
        maxLength:100,
        minLength:6
    })
    @Length(6,100)
    username:string

    @ApiProperty({
        required:true,
        maxLength:100,
        minLength:6
    })
    @Length(6,100)
    password:string
}
import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsNotEmpty, IsOptional, IsUrl, Length, Min } from "class-validator";

// just validate hash
export class HashUrlDto{
    @ApiProperty({required:true,type:"string",minLength:6,maxLength:6})
    @IsAlphanumeric()
    @Length(6,6)
    hash:string
}

// check all require fields to create custom links
export class CustomUrlShortenerDto{
    @ApiProperty({required:true,type:"string",minLength:6,maxLength:6})
    @IsOptional()
    @IsAlphanumeric()
    @Length(6,6)
    hash?:string

    @ApiProperty({required:true,type:"string",})
    @IsNotEmpty()
    @IsUrl()
    originalUrl:string

    @ApiProperty({required:true,type:"number",})    
    @IsNotEmpty()
    @Min(Math.floor(Date.now() / 1000),{message:'Invalid expire date'}) // expireDate must not be less than Date.now()
    expireAt:number 

}
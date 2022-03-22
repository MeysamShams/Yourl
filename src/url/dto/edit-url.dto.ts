import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsUrl, Min } from "class-validator";



export class EditUrlDto{


    @ApiProperty({required:false,type:"string",})
    @IsOptional()
    @IsNotEmpty()
    @IsUrl()
    originalUrl:string

    @ApiProperty({required:false,type:"number",})    
    @IsOptional()
    @IsNotEmpty()
    @Min(Math.floor(Date.now() / 1000),{message:'Invalid expire date'}) // expireDate must not be less than Date.now()
    expireAt:number 

}
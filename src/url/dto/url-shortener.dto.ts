import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUrl } from "class-validator";

export class UrlShortenerDto{
    @ApiProperty({required:true,type:"string",}) 
    @IsNotEmpty()
    @IsUrl()
    url:string
}
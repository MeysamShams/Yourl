import { Injectable } from '@nestjs/common';
import {customAlphabet} from 'nanoid'

@Injectable()
export class UtilsService {

    async generateHash():Promise<string>{
        const hashId = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)
        return await hashId();
    }
}

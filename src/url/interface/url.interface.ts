import {ObjectId} from 'mongodb'
export interface UrlInterface{
    _id?:ObjectId
    hash:string
    originalUrl:string
    userId?:ObjectId
    expireAt:number
    createdAt:number
    updatedAt?:number
    visitCount:number
}

export interface FindOriginalUrlByHashResponse{
    originalUrl:string
}
import { ObjectId } from "mongoose";

interface SessionUser {
    accessToken:string,
    isAuthenticated:boolean,
    loading:boolean,
    user:string,
    userId:string,
    userProfile:string,
    totalUnReadMessages:number,
    unReadMsgPerChat?:{ _id: ObjectId, unReadMsg: number }[] | null
}

export interface IUserDataSession {
    firstName:string,
    profileImg:string,
    userName:string,
    _id:string
}

export interface ISessionParams {
    accessToken:string,
    totalUnReadMessages:number
    user:IUserDataSession
}

export function handleSession(data:ISessionParams) : SessionUser {
    return {
        accessToken:data?.accessToken,
        isAuthenticated:true,
        userId:data?.user?._id,
        user:data?.user?.userName,
        userProfile:data?.user?.profileImg,
        totalUnReadMessages:data?.totalUnReadMessages,
        loading:false
    }
}
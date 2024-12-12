import { ObjectId } from "mongoose"

export interface IFollow {
    follower:string,
    following:string,
}

export interface IFollowService {
    follow(data:IFollow):Promise<void>
    unFollow(data:IFollow):Promise<void>
    acceptFollowRequest(followId:ObjectId,notificationId:string):Promise<void>
    rejectFollowRequest(followId:string,notificationId:string):Promise<unknown>
    cancleFollowRequest(data:IFollow):Promise<unknown>
}

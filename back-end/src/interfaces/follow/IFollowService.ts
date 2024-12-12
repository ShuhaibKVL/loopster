import { ObjectId } from "mongoose"
import { IFollow } from "../../models/followCollectionModal"

export interface IFollowService {
    follow(data:IFollow):Promise<any>
    unFollow(data:IFollow):Promise<any>
    deleteById(followId:string):Promise<unknown>

    //To show the followed / followers users on profile
    findFollowedUsers(userId:string):Promise<unknown>
    findFollowers(userId:string):Promise<unknown>

    // find by doc
    findByDoc(data:IFollow):Promise<unknown>
    //for suggesting users
    findUnFollowedUsers(userId:string):Promise<unknown>
    //To get must followers user for admin side
    findMostFollowersUsers():Promise<unknown>
    // Accept follow request by updating isRequsePending.
    AcceptFollowRequest(followId:string):Promise<unknown>
}
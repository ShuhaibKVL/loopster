import { IFollow } from "../../models/followCollectionModal"

export interface IFollowService {
    follow(data:IFollow):Promise<any>
    unFollow(data:IFollow):Promise<any>

    //To show the followed / followers users on profile
    findFollowedUsers(userId:string):Promise<unknown>
    findFollowers(userId:string):Promise<unknown>
    //for suggesting users
    findUnFollowedUsers(userId:string):Promise<unknown>
    //To get must followers user for admin side
    findMostFollowersUsers():Promise<unknown>
}
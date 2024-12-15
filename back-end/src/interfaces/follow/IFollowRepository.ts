import { IFollow } from "../../models/followCollectionModal"

export interface IFollowRepository {
    create(data:IFollow):Promise<any>
    delete(data:IFollow):Promise<any>
    isExist(data:IFollow):Promise<any>

    //To show the followed / followers users on profile
    findFollowedUsers(userId:string):Promise<unknown>
    findFollowers(userId:string):Promise<unknown>
    // TO show the suggestion part
    findUnFollowedUsers(userId:string):Promise<unknown>
    //To get must followers user for admin side
    findMostFollowersUsers():Promise<unknown>
}
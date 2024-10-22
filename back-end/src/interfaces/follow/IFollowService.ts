import { IFollow } from "../../models/followCollectionModal"

export interface IFollowService {
    follow(data:IFollow):Promise<any>
    unFollow(data:IFollow):Promise<any>
}
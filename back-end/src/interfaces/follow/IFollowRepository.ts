import { IFollow } from "../../models/followCollectionModal"

export interface IFollowRepository {
    create(data:IFollow):Promise<any>
    delete(data:IFollow):Promise<any>
    isExist(data:IFollow):Promise<any>
}
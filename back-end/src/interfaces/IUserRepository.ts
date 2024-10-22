import { ObjectId } from "mongoose"

export interface IUserRepository {
    create(userData:any):Promise<any>
    findByEmail(email:string):Promise<any>
    findByUserName(userName:string):Promise<any>
    verifyUser(_id:ObjectId):Promise<void> // update isVerified field to " true ""
    findById(_id:string):Promise<void>

    updateProfileImage(userId:string,imageUrl:string):Promise<void>
    findByIdAndUpdate(userId:string,formData:FormData):Promise<void>

    // To find latest new users
    findLatestUsers(userId:string):Promise<any>

}
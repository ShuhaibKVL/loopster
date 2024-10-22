import { ObjectId } from "mongoose"

export interface IUserService {
    createUser(userData:any):Promise<any>
    findUserByEmail(email:string):Promise<any>
    findUserByUserName(userName:string):Promise<any>
    verifyUser(_id:ObjectId):Promise<any>
    findUserById(_id:string):Promise<any>

    //s3 image upload
    uploadProfileImage(userId: string, imageBuffer: Buffer, mimeType: string): Promise<string>;
    updateProfile(userId:string,formData:FormData):Promise<any>

    //To show new  users on feed recommended section
    findLatestUsers(userId:string):Promise<any>
}
import { IUserWithCounts } from "@/lib/utils/interfaces/IUserWIthCounts"

export interface IUserManagementService {
    getAllUsers(page:number):Promise<unknown>
    handleBlockUnBlock(userId:string):Promise<void>
    handleListUnList(userId:string):Promise<void>
    findMostFollowedAccounts():Promise<unknown>
    getTotalAccounts():Promise<{message:string,status:boolean,totalUsers:number}>
    getUserData(userId:string):Promise<{message:string,status:boolean,user:IUserWithCounts[]}>
}
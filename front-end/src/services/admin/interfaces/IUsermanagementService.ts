export interface IUserManagementService {
    getAllUsers(page:number):Promise<any>
    handleBlockUnBlock(userId:string):Promise<void>
    handleListUnList(userId:string):Promise<void>
}
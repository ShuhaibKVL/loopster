export interface IUserManagementService {
    getAllUsers():Promise<any>
    handleBlockUnBlock(userId:string):Promise<void>
    handleListUnList(userId:string):Promise<void>
}
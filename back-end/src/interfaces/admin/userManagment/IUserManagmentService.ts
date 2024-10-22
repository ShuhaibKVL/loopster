export interface IUserManagementService {
    getAllUsers():Promise<any>
    blockUnBlock(userId:string):Promise<any>
    listUnList(userId:string):Promise<any>
}
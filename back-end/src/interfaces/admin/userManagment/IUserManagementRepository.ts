export interface IUserManagementRepository {
    findAllUsers():Promise<any>
    updateIsBlock(userId:string):Promise<any>
    updateIsList(userId:string):Promise<any>
}
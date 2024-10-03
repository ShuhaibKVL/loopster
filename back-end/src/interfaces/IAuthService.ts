export interface IAuthService {
    generateToken(userId:string):string;
    verifyPassword(plainPassword:string , hashedPassword:string):Promise<boolean>
}
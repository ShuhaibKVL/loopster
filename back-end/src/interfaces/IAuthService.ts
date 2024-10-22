export interface IAuthService {
    generateToken(userId:string,expires:string):string;
    verifyPassword(plainPassword:string , hashedPassword:string):Promise<boolean>
}
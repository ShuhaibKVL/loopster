import  jwt  from "jsonwebtoken";
import { IAuthService } from "../interfaces/IAuthService";
import bcrypt from 'bcryptjs'


export class AuthService implements IAuthService {
    generateToken(userId: string,expires : string): string {
        return jwt.sign({userId},process.env.JWT_SECRET!,{expiresIn:expires})
    }

    async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword , hashedPassword)
    }
}
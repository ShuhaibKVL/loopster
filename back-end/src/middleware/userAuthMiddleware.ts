import { Request , Response , NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { HttpStatus } from "../enums/httpStatus";
import { ErrorMessages } from "../enums/errorMessages";
import { userService } from "../routes/user/userRoutes";

interface JwtPayload {
  userId: string;
  exp:number,
  email?:string
}

export const authorize = async (req:Request , res:Response , next:NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        // console.log("authHeader :",authHeader)

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: ErrorMessages.TOKEN_NOT_FONT});
        }
        const token = authHeader.split(' ')[1]
        const claims = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload

        if(!claims){
            res.status(HttpStatus.FORBIDDEN).json({message:ErrorMessages.TOKEN_VERIFIED_FAILED})
            return;
        }

        const user = await userService.findUserById(claims?.userId)
        console.log('user is Blocked :',user[0].isBlocked,)
        if(!user && user[0]?.isBlocked){
            console.log('blocked ')
            res.status(HttpStatus.FORBIDDEN).json({message:ErrorMessages.BLOCKED})
            return
        }

        next()
        
    } catch (error : any) {
        console.log(error.message)
        res.status(HttpStatus.FORBIDDEN).json({message:ErrorMessages.TOKEN_VERIFIED_FAILED})
    }
}
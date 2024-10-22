import { Request , Response , NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { HttpStatus } from "../enums/httpStatus";
import { ErrorMessages } from "../enums/errorMessages";

export const authorize = async (req:Request , res:Response , next:NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        console.log("admin authHeader :",authHeader)

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: ErrorMessages.TOKEN_NOT_FONT});
        }
        const token = authHeader.split(' ')[1]
        console.log("admin : token after extract :",token)
        const claims = jwt.verify(token, process.env.JWT_SECRET as string)
        console.log("claims :",claims)

        if(!claims){
            res.status(HttpStatus.FORBIDDEN).json({message:ErrorMessages.TOKEN_VERIFIED_FAILED})
            return;
        }
        next()
        
    } catch (error : any) {
        console.log(error.message)
        res.status(HttpStatus.FORBIDDEN).json({message:ErrorMessages.TOKEN_VERIFIED_FAILED})
    }
}
import { Request , Response , NextFunction } from "express";
import jwt from 'jsonwebtoken'

export const authorize = async (req:Request , res:Response , next:NextFunction) => {
    try {
        const accessToken = req.cookies['accessToken']
        if (!accessToken) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
        const claims = jwt.verify(accessToken, process.env.JWT_SECRET as string)
        console.log("claims :",claims)

        if(!claims){
            res.status(403).json({message:'Unauthorized request'})
        }
        next()
        
    } catch (error : any) {
        console.log(error.message)
        res.status(403).json({message:"Unauthorized user."})
    }
}
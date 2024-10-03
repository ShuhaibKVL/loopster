import { Request,Response } from "express";
import jwt from 'jsonwebtoken'

interface CustomRequest extends Request {
    cookies : {
        accessToken?:string
    }
}

export const isVerifiedJwt = async(req:CustomRequest , res:Response):Promise<any> => {
    const { accessToken} = req.body
    const token = req.cookies.accessToken

    console.log(
        'cookie token :',req.cookies,token,
        "body token :",accessToken)

    console.log('jwt verification controll invoked ,',accessToken)
        if (!accessToken) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
        const claims = jwt.verify(accessToken, process.env.JWT_SECRET as string)
        console.log("claims :",claims)

        if(!claims){
            res.status(403).json({message:'Unauthorized request'})
        }
        res.status(200).json({message:'Token Valid.'})
}
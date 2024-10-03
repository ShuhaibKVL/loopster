import { NextFunction, Request, Response } from "express"

const globalErrorMiddleware = (err : any,req:Request,res : Response,next : NextFunction) => {
    console.log("global error middleware invoked :-",err.stack)
    res.status(500).json({
        success:false,
        message:err.message || 'Internal Server Error'
    })
}

export default globalErrorMiddleware
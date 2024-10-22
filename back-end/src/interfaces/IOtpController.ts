import { NextFunction, Request, Response } from "express";

export interface IOtpController {
    verifyOtp(req:Request,res:Response):Promise<any>
    resendOtp(req:Request,res:Response):Promise<any>
}
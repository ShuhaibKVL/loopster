import { NextFunction, Request, Response } from "express";

export interface IUserController {
    signUp(req:Request , res:Response):Promise<void>
    signIn(req:Request , res:Response):Promise<void>
    logout(req:Request , res:Response):Promise<void>
    getUser(req:Request,res:Response):Promise<void>
    uploadProfileImage(req:Request,res:Response ):Promise<void>
    updateProfile(req:Request,res:Response):Promise<void>
}


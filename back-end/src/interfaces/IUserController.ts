import { NextFunction, Request, Response } from "express";

export interface IUserController {
    signUp(req:Request , res:Response, next:NextFunction):Promise<void>
    signIn(req:Request , res:Response, next:NextFunction):Promise<void>
    logout(req:Request , res:Response, next:NextFunction):Promise<void>
}


import { NextFunction, Request,Response } from "express"

export interface IAdminController {
    signIn(req:Request,res:Response):Promise<void>
    
}
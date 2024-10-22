import { NextFunction , Request ,Response } from "express";

export interface IUserManagementController {
    getAllUsers(req:Request,res:Response):Promise<void>
    blockUnBlock(req:Request ,res:Response):Promise<void>
    listUnList(req:Request,res:Response):Promise<void>
}
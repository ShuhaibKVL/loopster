import { Response,Request } from "express"
import { adminSignIn, getAllUsers, Iadmin } from "../services/adminServices"

export const signIn = async(req:Request,res:Response):Promise<void> => {
    try {
        const formData = req.body
        console.log('formData :',formData)
        const admin = await adminSignIn(formData)
        console.log('admin :',admin)
        if(admin){
            res.status(200).json({message:'Log in successful.',data:formData})
        }else{
            res.status(400).json({message:'Authentication failed..!'})
        }
    } catch (error) {
        res.status(400).json({message:'Sign In failed..!'})
    }
}

export const getusers = async(req:Request,res:Response):Promise<any> => {
    try {
        const users =  await getAllUsers()
        console.log('users :',users)
    } catch (error:any) {
        res.status(400).json({message:error.message})
    }
}
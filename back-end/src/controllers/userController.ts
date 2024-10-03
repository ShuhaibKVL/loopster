import { IUser } from "../models/userModel"
import { registerNewUser, resent_Otp, signInUser, signUpUser, verifyOtpUser } from "../services/userServices"
import { Request,Response } from "express"
import { signInSchema, signUpSchema } from "../utils/validationSchemas"
import { ValidationError } from "yup"


export const signUp= async (req:Request,res:Response):Promise<void> => {
    try {
        const userData = req.body

        await signUpSchema.validate(userData ,{abortEarly:true})

        const newUser = await signUpUser(userData)
        console.log("response inside userController :",newUser)
        if(newUser){
            res.status(201).json({message:'Otp successfully send to your email.',user:userData})
        }
    } catch (error:any) {
        console.log("1",error.message)
        if(error instanceof ValidationError) {
            const validationErrors = error.inner.map((err:any) => err.message).join(', ')
            console.log("validationErrors :",validationErrors)
            res.status(400).json({
                success:false,
                errors:error.errors
            })
        }
        if (!res.headersSent) {  // This check prevents sending multiple responses
            if (error.message.includes('already exists')) {
                console.log("2",error.message)
                res.status(409).json({ message: error.message });
            } else {
                res.status(400).json({ message: error.message });
            }
        }
    }
}

export const verifyOtp = async (req:Request,res:Response):Promise<void> => {
    try {
        const { email, otp } = req.body
        console.log(email,otp ,"<<< inside controller")

        const isVerified = await verifyOtpUser(email,otp)
        console.log("isVerified",isVerified)
        if(!isVerified){
            res.status(401).json({message:"Invalid otp..!"})
        }else{
            const newUser = await registerNewUser(email)
            console.log("new User :",newUser)
            res.status(200).json({message:`${newUser.fullName}Account registration success.`})
        }
    }catch(error:any) {
        console.log(error)
        res.status(500).json({message:error.message})
    }
}

export const resentOtp = async(req:Request,res:Response):Promise<void> => {
    console.log("resent otp invoked")
    try {
    const {email} = req.body
    console.log("email :",email)
        const response = await resent_Otp(email)
        if(response){
            res.status(201).json({message:"Otp recent successfully"})
        }else{
            res.status(400).json({message:"OTP recent failed"})
        }
    } catch (error:any) {
        console.log(error)
        res.status(500).json({message:error.message})
    }
}

export const signIn = async (req:Request,res:Response):Promise<void> =>{
    try {
        const userData = req.body

        await signInSchema.validate(userData ,{abortEarly:true})
        
        const isExistUser : any = await signInUser(userData)

        if(!isExistUser){
            res.status(401).json({message:"Invalid credential..!",user:false})
        }else if(isExistUser === 'Invalid Password'){
            res.status(401).json({message:isExistUser})
        }
        const { refreshToken , accessToken , ...user } = isExistUser
        const { fullName , userName,_id} = user.userData

        res.cookie('accessToken',accessToken,
            {
            httpOnly:false,
            secure:false,
            sameSite:'lax',
            maxAge:600000,
        }
    )
    // console.log("000",req.cookies)
    // res.cookie('accessToken', accessToken, { /* options */ });
    // console.log(">>>>",res.getHeader('Set-Cookie'));

        res.status(200).json({
            message:'User Login success',
            accessToken:accessToken,
            userData:{
                _id:_id,
                firstName:fullName,
                userName:userName
            }
        })
    } catch (error:any) {
        if(error instanceof ValidationError) {
            const validationErrors = error.inner.map((err:any) => err.message).join(', ')
            console.log("validationErrors :",validationErrors)
            res.status(400).json({
                success:false,
                errors:error.errors
            })
        }
        console.log(error)
        res.status(500).json({message:error.message})
        
    }
}

export const logout_User = async(req:Request , res:Response):Promise<void> => {
    try {
        res.cookie('accessToken','',{maxAge:0})

        res.status(200).json({message:"success"})

    } catch (error:any) {
        res.status(400).json({message:error.message})
    }
}

export const user = async(req:Request , res:Response):Promise<void> => {
    try {
        console.log("Authenticated....")
    } catch (error:any) {
        res.status(404).json({message:error.message})
    }
}




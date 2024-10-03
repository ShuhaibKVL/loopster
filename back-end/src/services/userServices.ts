import { createUser, findUserByEmailOrUserName, isExistUser, isVerified } from "../repositories/userRepository";
import User, { IUser } from '../models/userModel'
import bcrypt from 'bcryptjs'
import { generateOtp } from '../utils/otpGenerator'
import { mailSender } from "../utils/mailSender";
import { verify_Otp } from "../repositories/otpRepository";
import jwt from 'jsonwebtoken'


export const signUpUser = async (userData:IUser):Promise<boolean> => {
    console.log("user data inside service layer :",userData)

    // Check userName or email all ready existed..
    const isExisted = await findUserByEmailOrUserName(userData.email,userData.userName)
    if(isExisted){
        console.log("all ready existed...")
        throw new Error('User with this email or username already exists');
    }
    console.log("sender email :",userData.email)
    const newUser = await createUser(userData)
    console.log("newUser",newUser)

    const otp = await generateOtp(userData.email)
    console.log("otp :",otp)
    const emailBody = `<h4>confirm your password</h4>
            <p>Here is your one time  OTP code :</p>
            <h2 style ="color:yellow;">OTP : ${otp.otp}</h2>
            <p>Do not share the otp anywhere</p>`

    const sendEmail = await mailSender(
        userData.email,
        "Verification Email Loopster.ltd",
        emailBody
    )
    if(sendEmail){
        return true
    }
    return false
}

export const verifyOtpUser = async (email:string,otp:string):Promise<boolean | null> => {
    const isVerified = await verify_Otp(email,otp)
    console.log("isVerified :",isVerified)
    return isVerified
}

export const resent_Otp = async (email:string):Promise<boolean> => {
    const otp = await generateOtp(email)
    console.log("otp :",otp)
    const emailBody = `<h4>confirm your password</h4>
            <p>Here is your one time  OTP code :</p>
            <h2 style ="color:yellow;">OTP : ${otp.otp}</h2>
            <p>Do not share the otp anywhere</p>`

    const sendEmail = await mailSender(
        email,
        "Verification Email Loopster.ltd",
        emailBody
    )
    if(sendEmail){
        return true
    }
    return false
}

export const registerNewUser = async(email:string):Promise<IUser> => {
    return await isVerified(email)
}

export const signInUser = async (userData:IUser):Promise<object | boolean | string> => {

    const { email , password } = userData

    const isExist = await isExistUser(email)
    if(!isExist){
        return false
    }
    const isPasswordMatch = await bcrypt.compare(password,isExist.password)
    if(isPasswordMatch){
        const accessToken = jwt.sign({
            username:isExist.userName,
            email:isExist.email
        },process.env.JWT_SECRET as string ,
        {expiresIn:'10m'}
        )

        const refreshToken = jwt.sign({
            email:isExist.email,
        },process.env.JWT_SECRET as string ,
        {expiresIn:'1d'}
        )

        const data = {
            userData :isExist,
            accessToken:accessToken,
            refreshToken:refreshToken
        }
            
        return data
    }else{
        return "Invalid Password"
    }
}

export const deleteUnverifiedUsers = async () => {
    try {
        const countOfUsers = await User.find({}).countDocuments()
        const countOfUsersIsVerifeid_false = await User.find({isVerified:false}).countDocuments()
        console.log("countOfUsers :",countOfUsers)
        console.log("count Of Users IsVerifeid = false :",countOfUsersIsVerifeid_false)

        const result = await User.deleteMany({
        isVerified: false,
    });

        console.log(`${result.deletedCount}${Date.now()} unverified users deleted`);
        console.log('delete result is :',result)
    } catch (error) {
        console.error('Error deleting unverified users:', error);
        throw error;
    }
};


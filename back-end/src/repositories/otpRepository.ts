import Otp from "../models/otpModel"


export const verify_Otp = async(email:string,otp:string):Promise<boolean | null> => {
    const isHave = await Otp.findOne({email:email}).sort({createdAt:-1})
    if(isHave){
        if(isHave.otp === otp){
            return true
        }
    }
    console.log("isHave :",isHave)
    return false
}
import { IOtpRepository } from "../interfaces/IOtpRespository"
import Otp from "../models/otpModel"


// export const verify_Otp = async(email:string,otp:string):Promise<boolean | null> => {
//     const isHave = await Otp.findOne({email:email}).sort({createdAt:-1})
//     if(isHave){
//         if(isHave.otp === otp){
//             return true
//         }
//     }
//     console.log("isHave :",isHave)
//     return false
// }

export class OtpRepository implements IOtpRepository {
    async isExist(email: string, otp: number): Promise<boolean> {
        const isExist = await Otp.findOne({email:email , otp:otp}).sort({createdAt:-1}).lean()
        console.log("isExist otp in Repo :",isExist)
        return !!isExist
    }

    async create(email: string, otp: number): Promise<void> {
        Otp.create({email,otp})
    }
}
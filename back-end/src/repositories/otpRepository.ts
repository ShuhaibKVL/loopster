import { IOtpRepository } from "../interfaces/IOtpRespository"
import Otp from "../models/otpModel"
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
import { IOtpRepository } from "../interfaces/IOtpRespository";
import { IOtpService } from "../interfaces/IOtpService";
import { generateOtp } from "../utils/otpGenerator";

export class OtpService implements IOtpService {
    constructor(private otpRepository : IOtpRepository){}

    async generateAndSaveOtp(email: string): Promise<any> {
        const otp = await generateOtp()
        await this.otpRepository.create(email,otp)
        return otp
    }

    async verifyOtp(email: string, otp: number): Promise<any> {
        return this.otpRepository.isExist(email,otp)
    }
}
import { user_publicApi } from "../apis/axiosInstance";
import { IOtpService } from "./interfaces/IOtpService";

class OtpService implements IOtpService{
    async verifyOtp(email: string, otp: string): Promise<any> {
        const response = await user_publicApi.post('/verifyOtp',{email,otp})
        return response.data
    }

    async resendOtp(email: string): Promise<any> {
        const response = await user_publicApi.post('/resendotp',email)
    }
}

const otpService = new OtpService()
export default otpService
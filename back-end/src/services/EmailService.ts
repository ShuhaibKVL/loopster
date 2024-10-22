import { IEmailService } from '../interfaces/IEmailService';
import { mailSender } from '../utils/mailSender';

export class EmailService implements IEmailService {
    
    async sendVerificationEmail(email: string, otp: Number): Promise<void> {
        console.log('email service invoked')
        console.log(email,otp)
        const emailBody = `<h4>confirm your password</h4>
            <p>Here is your one time  OTP code :</p>
            <h2 style ="color:yellow;">OTP : ${otp}</h2>
            <p>Do not share the otp anywhere</p>`

        return await mailSender(
            email,
            "Verification Email Loopster.ltd",
            emailBody
        )
    }
}
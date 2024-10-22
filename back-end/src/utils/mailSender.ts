import nodemailer from 'nodemailer'

export const mailSender = async(email:string , title:string , body:string):Promise<any> => {
    console.log(email,title,body)
    try {
        // Transporter to send email
        let transporter = nodemailer.createTransport({
        // host:process.env.MAIL_HOST,
        service:"gmail",
        auth:{
            user: process.env.MAIL_USER,
            pass:process.env.MAIL_PSSS
        }
        })

        // Configure email content
        
        let info = await transporter.sendMail({
            from:"www.mshuhabkvl.me - Muhammed Shuhaib",
            to:email,
            subject:title,
            html:body
        })
        console.log("Email Info : > ",info)
        return info

    } catch (error:any) {
        console.log("error on mailSender",error)
    }
}
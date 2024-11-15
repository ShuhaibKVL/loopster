'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import Counter from '@/components/cm/Counter'
import { useSearchParams , useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"
import otpService from '@/services/authServices/otpService'


export default function page() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const [ otp , setOtp ] = useState('')
    const [error, setError] = useState('')
    const [ email , setEmail ] = useState('')
    const [ resetCounterComponent , setResetCounterCp ] = useState(false)

    const { toast } = useToast()

    useEffect(() => {
        setTimeout(() => {
            setError('')
        },3000)
    },[error])

    useEffect(() => {
        const emailParams = searchParams.get('email')
        console.log("emailParams :",emailParams)
        if(emailParams){
            try {
                setEmail(emailParams)
            } catch (error) {
                // router.push('/signUp')
                toast({
                    variant:'destructive',
                    title: "Retry",
                    description: "UserData not get.Please signUp once more",
                })
            }
        }
    },[searchParams, router])

    async function handleSubmit():Promise<any> {
        if(otp.length <6){
            setError("Please enter valid otp.")
        }
        console.log("otp :",otp,"userData :",email)
        try {
            const result = await otpService.verifyOtp(email,otp)
            console.log("result :",result)
            if(!result.status){
                toast({
                    title: 'Failed',
                    description: result.message,
                    className:'toast-failed'
                })
            }else{
                toast({
                    title: 'Success',
                    description: result.message,
                    className:"toast-success"
                })
                router.push('/signIn')
            }
        } catch (error:any) {
            console.log(error.message)
        }
    }

    async function handleResendOtp():Promise<void> {
        console.log("invoked")
        try {
            const response = await otpService.resendOtp(email)
            console.log("resend otp response :",response)
            setResetCounterCp((prev) => !prev)
            toast({
                title: 'Success',
                description: response.message,
                className:"toast-success"
            })
        } catch (error) {
            console.log(error)
            setError('Otp resend failed.')
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-[var(--color-bg)]'>
            <div className='flex flex-col md:flex-row bg-[var(--secondary-bg)] items-center justify-center max-w-4xl w-full h-full m-4 p-4 border shadow-sm rounded-lg overflow-hidden'>
                {/* Form Section */}
                <div className='w-full md:w-1/2 h-full bg-[var(--secondary-bg)]'>
                    <div className='min-h-24'>
                        <h1 className='text-2xl font-bold text-center m-2'> Please Enter Otp</h1>
                        <p className=''>Please enter the <span className='font-bold'>OTP</span> received on your respective email.</p>
                    </div>
                    
                    <div className=''><p className='text-red-600'>{error}</p></div>
                    <div className='flex justify-center'><Counter initialMinutes={2} resetTrigger={resetCounterComponent} /></div>
                    <div className='w-full flex justify-center min-h-20'>
                    
                    <InputOTP maxLength={6}
                    onChange={(otp) => setOtp(otp)}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                        </InputOTPGroup>
                        {/* <InputOTPSeparator /> */}
                        <InputOTPGroup>
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                        </InputOTPGroup>
                        {/* <InputOTPSeparator /> */}
                        <InputOTPGroup>
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    </div>
                    <p onClick={handleResendOtp} className='w-full text-center mb-4 opacity-50 hover:opacity-100 cursor-pointer'>Resent Otp</p>
                    <button onClick={handleSubmit} type="submit" className='w-full py-2 text-white px-4 rounded-md bg-primary hover:bg-secondary transition'>
                        Submit
                    </button>
                    
                </div>
                {/* Image Section */}
                <div className='hidden md:block md:w-1/2 h-full bg-[var(--secondary-bg)]'>
                        <div className='h-full w-full border-yellow-800 flex items-center justify-center'>
                        <Image src='/Images/iPhone14Pro.png'
                        alt='Login Page Illustrator'
                        width={500}
                        height={600}
                        style={{objectFit:'contain'}}
                        />
                        </div>
                </div>
            </div>
        </div>
    )
}

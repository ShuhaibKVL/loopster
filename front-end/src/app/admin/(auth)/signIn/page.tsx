'use client'

import Form from '@/components/cm/Form';
import adminWithAuth from '@/app/contexts/adminWithAuth'
import { useToast } from '@/hooks/use-toast'
import { login } from '@/lib/redux/features/auth/adminSlice'
import { signInSchema } from '@/lib/utils/validationSchemas'
import adminAuthService from '@/services/admin/adminAuthService'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import logoWithTitle from '../../../../../public/Images/LogowithTitle.png'


export interface IsignIn{
    email:string,
    password:string,
}

const Page =() => {
    const signInFields = [
        {name:'email',type:"email",label:'Email',placeHolder:"Enter your email",required:true},
        {name:'password',type:"password",label:'Password',placeHolder:"Enter your password",required:true},
    ]
    const router = useRouter()
    const { toast} = useToast()
    const dispatch = useDispatch()

    const [ error,setError] = useState('')
    useEffect(() => {
        setTimeout(() => {
            setError('')
        },3000)
    })

    const handleSubmit = async(formData:IsignIn):Promise<void> => {
        await signInSchema.validate(formData , {abortEarly:true})
        try {
            const admin = await adminAuthService.signIn(formData)

            if(admin?.status){
                toast({
                    title:"Success",
                    description:admin.message,
                    className:'toast-success'
                })
                const payload = {
                    email : admin?.email,
                    accessToken :admin?.accessToken
                } 
                dispatch(login(payload))
                router.replace('/admin/dashboard')
                return
            } 
            setError(admin?.message as string) 
        } catch (error:unknown) {
            if (error instanceof Error) {
                setError(error.message);
              } else {
                setError("An unknown error occurred.");
              }
        }
    }


    return (
        <div className='min-h-screen flex items-center justify-center bg-[var(--color-bg)]'>
        <div className='flex flex-col md:flex-row items-center justify-center bg-[var(--secondary-bg)] max-w-4xl w-full m-4 p-4 border shadow-sm rounded-lg overflow-hidden'>
            {/* Form Section */}
            <div className='w-full md:w-1/2 h-full'>
                <div className='mb-24'>
                    <h1 className='text-2xl font-bold text-center m-2'>Admin Sign In</h1>
                </div>
                <div className='h-5 overflow-hidden'>
                    <p className='text-red-600'>{error}</p>
                </div>
                <Form fields={signInFields} onSubmit={handleSubmit} />
                
            </div>
            {/* Image Section */}
            <div className='hidden md:block md:w-1/2 h-full relative flex-col items-center'>
                <Image src={logoWithTitle}
                    alt='Login Page Illustrator'
                    fill
                    style={{objectFit:'contain'}}
                    priority
                />
            </div>
        </div>
    </div>
    )
}

export default adminWithAuth(Page , false)

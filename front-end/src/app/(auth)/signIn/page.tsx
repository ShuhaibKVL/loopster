'use client'

import Image from 'next/image'
import Form from '@/app/components/Form'
import "../../globals.css";
import { signIn } from '@/services/authServices/userAuthService';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast"
import { signInSchema } from '@/app/utils/validationSchemas';
import { ValidationError } from 'yup';
import Link from 'next/link';
import { UseSelector , useDispatch, useSelector } from 'react-redux';
import { login } from '@/lib/features/auth/userSlice';
import { RootState } from '@/lib/store/store';

export interface signIn{
    name:String,
    password:String,
}

export default function Page() {
    const signInFields = [
        {name:'email', type:"email",label:'Email',placeHolder:"Enter your email",required:true},
        {name:'password',type:"password",label:'Password',placeHolder:"Enter your password",required:true},
    ]
    const router = useRouter()
    const { toast} = useToast()
    const dispatch = useDispatch()

    const isAuthenticated = useSelector((state:RootState) => state.user.isAuthenticated)

    const [ error , setError ] = useState('')

    useEffect(() => {
        setTimeout(() => {
            setError('')
        },3000)
    })

    const handleSubmit = async(formData:Object) => {

        await signInSchema.validate(formData, {abortEarly:true})

        try {
            const user =  await signIn(formData)
            console.log("user",user,)

            setError(user.message)
            if(user.message === 'User Login success'){
                toast({
                    title: 'Success',
                    description: user.message,
                    className:"toast-success"
                })

                dispatch(login(user))
                router.replace('/feed')

                // router.push('/feed')
            }else if (user.errors) {
                // Handle validation errors
                user.errors.forEach((error:any) => {
                    toast({
                    variant: 'destructive',
                    title: 'Validation Error',
                    description: error,
                });
            })}
        } catch (error:any) {
            if(error instanceof ValidationError) {
                const validationErrors = error.inner.map((err:any) => err.message).join(', ')
                console.log("validationErrors :",validationErrors)
                setError(validationErrors)
            }
            console.log(error.message)
            setError(error.message)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg[var(--background)]'>
            <div className='flex flex-col md:flex-row items-center justify-center max-w-4xl w-full  m-4 p-4 border shadow-sm shadow-gray-700 rounded-lg overflow-hidden'>
                {/* Form Section */}
                <div className='w-full md:w-1/2 h-full'>
                    <div className='mb-24'>
                        <h1 className='text-2xl font-bold text-center m-2'> Sign In</h1>
                    </div>
                    <div className=''>
                        {error === 'User login success' ?
                        <p className='text-red-600'>{error}</p>:
                        <p className='text-green-600'>{error}</p> }
                    </div>
                    <Form fields={signInFields} onSubmit={handleSubmit} />
                    <p className='text-right w-full p-4'>
                    <span className='opacity-50'>
                        You have not a account ?
                    </span>
                        <Link href='/signUp'> Create account</Link>
                    </p>
                </div>
                {/* Image Section */}
                <div className='hidden md:block md:w-1/2 h-full relative flex-col items-center'>
                
                <Image src='/Images/LogowithTitle.png'
                        alt='Login Page Illustrator'
                        width={100}
                        height={50}
                        className='align-middle'
                        style={{objectFit:'contain'}}
                        priority/>
                    <Image src='/Images/iPhone14Pro.png'
                        alt='Login Page Illustrator'
                        fill
                        style={{objectFit:'contain'}}
                        priority/>
                </div>
            </div>
        </div>
    )
}

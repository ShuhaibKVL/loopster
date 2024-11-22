'use client'

import Form from '@/components/cm/Form';
import withAuth from '@/app/contexts/withAuth';
import { useToast } from "@/hooks/use-toast";
import { login } from '@/lib/redux/features/auth/userSlice';
import userAuthService from '@/services/user/userAuthService';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ValidationError } from 'yup';
import "../../globals.css";
import { SignIn } from '@/app/actions/auth';

export interface IsignIn{
    email:string,
    password:string,
}
const signInFields = [
    {name:'email', type:"email",label:'Email',placeHolder:"Enter your email"},
    {name:'password',type:"password",label:'Password',placeHolder:"Enter your password"},
]

const Page = () => {
    const router = useRouter()
    const { toast} = useToast()
    const dispatch = useDispatch()

    const [ error , setError ] = useState('')

    useEffect(() => {
        setTimeout(() => {
            setError('')
        },3000)
    })

    const handleSubmit = async(formData:IsignIn) => {
        if(formData?.email.length <= 1 ){
            setError('Please enter your valid email')
            return
        }
        if(formData?.password.length <= 1){
            setError('Please enter your password')
            return
        }

        try {
            const user =  await userAuthService.signIn(formData)
            if(user.status){
                toast({
                    title: 'Success',
                    description: user.message,
                    className:"toast-success"
                })

                const userData ={
                    user:user?.userData,
                    accessToken:user?.accessToken,
                    totalUnReadMessages:user?.totalUnReadMessages
                }
                dispatch(login(userData))
                router.replace('/feed')

            }else if (user.errors) {
                // Handle validation errors
                user.errors.forEach((error:any) => {
                    toast({
                    title: 'Validation Error',
                    description: user.message,
                    className:'toast-failed'
                });
            })}
        } catch (error:any) {
            if(error instanceof ValidationError) {
                const validationErrors = error.inner.map((err:any) => err.message).join(', ')
                setError(validationErrors)
            }
            if (error.response) {
                console.log(error,error.response)
                const { status } = error.response;

                if (status === 401) {
                  // Incorrect credentials
                  setError("Email or password is incorrect.");
                } else if (status === 403) {
                  // Account blocked
                  setError("Your account has been blocked. Please contact support.");
                } else {
                  console.log('erororoor')
                }
            }
        }
    }

    // const handleSubmit = async(formData:IsignIn) => {
    //     console.log('formData :',formData)
    //     if(formData?.email.length <= 1 ){
    //         setError('Please enter your valid email')
    //         return
    //     }
    //     if(formData?.password.length <= 1){
    //         setError('Please enter your password')
    //         return
    //     }

    //     try {
    //         const result = await SignIn(formData)
    //         if (result.status) {
    //             dispatch(login({
    //               user: result.userData,
    //               // Don't store token in Redux, it's now in an HTTP-only cookie
    //             }));
                
    //             toast({
    //               title: 'Success',
    //               description: result.message,
    //               className: "toast-success"
    //             });
                
    //             router.replace('/feed');
    //           } else {
    //             toast({
    //               title: 'Error',
    //               description: result.message,
    //               className: 'toast-failed'
    //             });
    //           }
    //     } catch (error) {
    //         toast({
    //             title: 'Error',
    //             description: 'An unexpected error occurred',
    //             className: 'toast-failed'
    //           });
    //     }
    // }

    return (
        <div className='min-h-screen flex items-center justify-center bg[var(--color-bg)'>
            <div className='flex flex-col md:flex-row items-center justify-center max-w-4xl w-full bg-[var(--secondary-bg)] m-4 p-4 border shadow-sm rounded-lg overflow-hidden'>
                {/* Form Section */}
                <div className='w-full md:w-1/2 h-full'>
                    <div className='mb-24'>
                        <h1 className='text-2xl font-bold text-center m-2'> Sign In</h1>
                    </div>
                    <div className='h-5 overflow-hidden'>
                        {error === 'Login successful' ?
                        <p className='text-green-600'>{error}</p>:
                        <p className='text-red-600'>{error}</p> }
                    </div>
                    <Form fields={signInFields} onSubmit={handleSubmit} />
                    <p className='text-right w-full p-4 text-md'>
                    <span className='opacity-50'>
                        You have not a account ?
                    </span>
                        <Link href='/signUp'> Create account</Link>
                    </p>
                </div>  
                {/* Image Section */}
                <div className='hidden md:block md:w-1/2 h-full bg-[var(--secondary-bg)]'>
                        <div className='h-full w-full border-yellow-800 flex items-center justify-center'>
                        <Image src='/Images/iPhone14Pro.png'
                        alt='Login Page Illustrator'
                        width={100}
                        height={500}
                        sizes='100vw'
                        quality={100}
                        priority
                        style={{width:'100%',height:'100%'}}
                        />
                        </div>
                </div>
            </div>
        </div>
    )
}
// export default Page
export default withAuth(Page,false)

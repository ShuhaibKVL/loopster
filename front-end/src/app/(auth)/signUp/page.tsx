'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Form from '@/app/components/Form'
import { signUp } from '@/services/authServices/userAuthService'
import { useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"
import { signUpSchema } from '@/app/utils/validationSchemas'
import { ValidationError } from 'yup'
import Link from 'next/link'

export default function Page() {
  const signUpFields = [
    {name:'fullName',type:"text",label:"Full Name",placeHolder:"full name" ,required:true},
    {name:'userName',type:"text",label:"User Name",placeHolder:"user name" ,required:true},
    {name:'email',type:"email",label:"Email",placeHolder:"email" ,required:true},
    {name:'password',type:"password",label:"Password",placeHolder:"********" ,required:true},
    {name:'confirmPassword',type:"password",label:"Confirm Password",placeHolder:"********" ,required:true},
  ]

  const [ error , setError ] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if(error){
      setTimeout(() => {
        setError('')
      },3000)
    }
  },[error])

  
  const handleSubmit = async (formData:IUser) => {
    try {
      console.log("Handle submit function invoked...!",formData.password)

      const isValidate = await signUpSchema.validate(formData , {abortEarly:true})
      console.log('isValidate :',isValidate)

      if(formData.password !== formData.confirmPassword){
        setError('Password miss match')
        return false
      }else{
        
  
        const response = await signUp(formData)
        console.log("response :",response)

        if(response.message === 'Otp successfully send to your email.'){
          toast({
            title: response.message,
            description: "Check your email and share the otp.",
            className:"toast-success"
          })
  
          router.push(`/signUp/otp/?email=${response.user.email}`)
          
        }else if (response.errors) {
          // Handle validation errors
          response.errors.forEach((error:any) => {
            toast({
              variant: 'destructive',
              title: 'Validation Error',
              description: error,
            });

        })}else{
          toast({
            variant:'destructive',
            title: response.message,
            description: "SignUp failed",
          })
        }
      }
      
    } catch (error:any) {
      if(error instanceof ValidationError) {
        const validationErrors = error.inner.map((err:any) => err.message).join(', ')
        console.log("validationErrors :",validationErrors)
        setError(validationErrors)
      }
      setError(error.message)
      console.log("Error on signUp :",error)
    }
    
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-[var(--color-bg)]'>
            <div className='flex flex-col md:flex-row bg-[var(--secondary-bg)] items-center justify-center max-w-4xl w-full h-full m-4 p-4 border shadow-sm rounded-lg overflow-hidden'>
                {/* Form Section */}
                <div className='w-full md:w-1/2 h-full bg-[var(--secondary-bg)]'>
                    <div className='mb-24'>
                        <h1 className='text-2xl font-bold text-center m-2'> Sign Up</h1>
                    </div>
                    <div className=''><p className='text-red-600'>{error}</p></div>
                    <Form fields={signUpFields} onSubmit={handleSubmit} />
                    <p className='text-right w-full p-4'>
                    <span className='opacity-50'>
                        All ready have a account ?
                    </span>
                        <Link href='/signIn'> Sign In</Link>
                    </p>
                </div>
                {/* Image Section */}
                <div className='hidden md:block md:w-1/2 h-full border bg-[var(--secondary-bg)]'>
                        <div className='h-full w-full border-yellow-800 flex items-center justify-center'>
                        <Image src='/Images/iPhone14Pro.png'
                        alt='Login Page Illustrator'
                        width={100}
                        height={500}
                        sizes='100vw'
                        quality={100}
                        style={{width:'100%',height:'100%'}}
                        />
                        </div>
                </div>
            </div>
        </div>
  )
}

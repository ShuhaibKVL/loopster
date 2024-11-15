'use client';

import Form from '@/components/cm/Form';
import withAuth from '@/app/contexts/withAuth';
import { useToast } from "@/hooks/use-toast";
import { signUpSchema } from '@/lib/utils/validationSchemas';
import userAuthService from '@/services/user/userAuthService';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ValidationError } from 'yup';

export interface ISignUp_user {
  fullName: string;
  userName: string;
  email: string;
  profileImage?: string;
  password: string;
  confirmPassword: string;
}

const Page = () => {
  const [fields] = useState([
    { name: 'fullName', type: "text", label: "Full Name", placeHolder: "full name" },
    { name: 'userName', type: "text", label: "User Name", placeHolder: "user name" },
    { name: 'email', type: "email", label: "Email", placeHolder: "email" },
    { name: 'password', type: "password", label: "Password", placeHolder: "********" },
    { name: 'confirmPassword', type: "password", label: "Confirm Password", placeHolder: "********" },
  ]);
  
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
        setFieldErrors({})
      }, 4000); // Clear error after 4 seconds
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [error]);

  const handleSubmit = async (formData: ISignUp_user) => {
    try {
      console.log("Handle submit function invoked...!", formData.password);

      // Reset field errors
      setFieldErrors({});

      if (formData.password !== formData.confirmPassword) {
        setFieldErrors({ confirmPassword: 'Password does not match' });
        return false;
      } else {
        await signUpSchema.validate(formData, { abortEarly: false });

        const response = await userAuthService.signUp(formData);
        console.log("response :", response);

        if (response.status === true) {
          toast({
            title: response.message,
            description: response.message,
            className: "toast-success"
          });

          router.push(`/signUp/otp/?email=${response.user}`);

        } else if (response.errors) {
          // Handle validation errors
          const errors: { [key: string]: string } = {};
          response.errors.forEach((error: any) => {
            // Assuming error contains { field: string, message: string }
            errors[error.field] = error.message;
            toast({
              variant: 'destructive',
              title: 'Validation Error',
              description: error.message,
            });
          });
          setFieldErrors(errors); // Set the field-specific errors

          // Clear errors after 4 seconds
          setTimeout(() => {
            setFieldErrors({});
          }, 4000); // Clear field errors after 4 seconds

        } else {
          toast({
            variant: 'destructive',
            title: response.message,
            description: "SignUp failed",
          });
        }
      }

    } catch (error: any) {
      if (error instanceof ValidationError) {
        const validationErrors = error.inner.reduce((acc: any, err: any) => {
          acc[err.path] = err.message; // Set error message by field name
          return acc;
        }, {});

        setFieldErrors(validationErrors); // Update field errors
      }
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
          <Form fields={fields} onSubmit={handleSubmit} fieldErrors={fieldErrors} />
          <p className='text-right w-full p-4 text-md'>
            <span className='opacity-50'>All ready have an account?</span>
            <Link href='/signIn'> Sign In</Link>
          </p>
        </div>
        {/* Image Section */}
        <div className='hidden md:block md:w-1/2 h-full bg-[var(--secondary-bg)]'>
          <div className='h-full w-full border-yellow-800 flex items-center justify-center'>
          <Image
            src='/Images/iPhone14Pro.png'
            alt='Sign Up Page Illustrator'
            width={100}
            height={500}
            sizes='100vw'
            quality={100}
            priority
          />

          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Page, false);

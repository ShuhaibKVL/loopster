'use server'

import { cookies } from "next/headers"
import { BASE_URL, userApi } from "@/services/apis/axiosInstance"

export interface SignInData{
    email:string,
    password:string,
}

export async function SignIn(formData: SignInData): Promise<{status:boolean,message:string,userData?:{},accessToken?:string,}> {
    try {
      const response = await userApi.post('/signIn',formData)
      console.log("signIn response in auth action :",response)
      
      // Set HTTP-only cookie for better security
      cookies().set('accessToken', response.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge:3600 * 1000
      });
      console.log('cookie setled ')
      return {
        status: true,
        userData: response.data.userData,
        accessToken:response.data.accessToken,
        message: 'Login successful'
      };
    } catch (error: any) {
      console.log('errror:',error)
      if (error.response) {
        const { status } = error.response;
        
        switch (status) {
          case 401:
            return { status: false, message: 'Email or password is incorrect' };
          case 403:
            return { status: false, message: 'Your account has been blocked' };
          default:
            return { status: false, message: 'An error occurred during sign in' };
        }
      }
      return { status: false, message: 'Unable to connect to the server' };
    }
  }


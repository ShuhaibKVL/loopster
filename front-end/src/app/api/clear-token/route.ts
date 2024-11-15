import { NextResponse } from "next/server";
import { cookies  } from "next/headers";

export async function GET(){
    console.log('delete function invoked')
    console.log('BASE URL :',process.env.NEXT_PUBLIC_PORT_URL)
    cookies().set('accessToken','',{maxAge:0})
    return NextResponse.redirect(new URL('/signIn',process.env.NEXT_PUBLIC_PORT_URL))
  }
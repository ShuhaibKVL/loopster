import { isVerifiedJwt } from "@/services/authServices/jwtService"
import { NextResponse } from "next/server";


export const middleware = async(req:Request ) => {
    console.log("Next js middleware function invoked...")

    const excludeRoutes = ['api/user/signIn','api/user/signUp']
    const currentPathname = new URL(req.url).pathname;
    console.log("currentPathname :",currentPathname)

    if(excludeRoutes.includes(currentPathname)){
        console.log("exclude >>")
        return NextResponse.next()
    }
    // token from localstorage
    // const accessToken = localStorage.getItem('accessToken')

    try {
        const isVerified = await isVerifiedJwt()
        console.log("isVerified :",isVerified)
        if(isVerified){
            NextResponse.next()
        }else{
            const loginUrl = new URL('/signIn', req.url);  // Create an absolute URL for redirection
            return NextResponse.redirect(loginUrl);
        }
        
    } catch (error:any) {
        console.log(error.message)
    }
}

export const config = {
    matcher: ['/about'],
};
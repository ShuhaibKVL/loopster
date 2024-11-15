// middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers'
import isTokenExpired from './lib/utils/isTokenExpired';

const protectedRoutes = [
    '/feed',
    'feed/profile',
    'feed/book_mark'
]

const publicRoute = [
    '/',
    '/signIn',
    'signUp'
]
// This function is executed for every incoming request
export async function middleware(req: NextRequest) {
  // You can add your middleware logic here
 
  const currentPath = req.nextUrl.pathname
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
  console.log('current path :',currentPath)
  const isProtectedRoute = protectedRoutes.includes(currentPath)
  const isPublicRoute = publicRoute.includes(currentPath)
  const accessToken = cookies().get('accessToken')?.value
  console.log('isProtected :',isProtectedRoute,)
  console.log("isPublicRoute :",isPublicRoute)
  console.log("accessToken :",accessToken)
    // if (accessToken) {      
    //     const isExpired = isTokenExpired(accessToken);
    //     if (isExpired && isProtectedRoute) {
    //         console.log('if')
    //         return NextResponse.redirect(new URL('/api/clear-token', req.nextUrl));
    //     } else if (!isExpired && publicRoute.includes(currentPath)) {
    //         console.log('else')
    //         return NextResponse.redirect(new URL('/feed', req.nextUrl));
    //     }
    //     console.log('>>>')
    //     return NextResponse.next();
    // }
    // console.log('not have access key')
    // if(isProtectedRoute){
    //     return NextResponse.redirect(new URL('signIn',process.env.NEXT_PUBLIC_PORT_URL))
    // }
}

export const config = {
  matcher: ['/feed','/feed/profile','/signUp','/signIn'],
};
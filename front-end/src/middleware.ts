import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers'
import isTokenExpired from './lib/utils/isTokenExpired';
import { deleteCookie  } from 'cookies-next';
import { signOut } from 'next-auth/react';

const protectedRoutes = [
    '/feed',
    '/feed/profile',
    '/feed/book_mark',
    '/feed/create_post',
    '/feed/gemini_bot',
    '/feed/messages',
    '/feed/messages/chat[chatId]',
    '/feed/notifications',
    '/feed/notifications/view-post/[postId]',
    '/story-carasoll/[storyId]',
    '/feed/settings'
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
  console.log('current path :',currentPath)
  const response = NextResponse.next()

  const isProtectedRoute = protectedRoutes.includes(currentPath)
  const isPublicRoute = publicRoute.includes(currentPath)

  const cookieStore = cookies();
  const session = cookieStore.get('session');
  console.log('sesion got :',session)
  let accessToken ;
  if(session){
    const sessionData = JSON.parse(session?.value as string);
    accessToken = sessionData?.accessToken

    console.log('session data :',sessionData)
  }

  console.log('isProtected :',isProtectedRoute,)
  console.log("isPublicRoute :",isPublicRoute)
  console.log("accessToken :",accessToken)

  
    if (accessToken) {      
        const isExpired = isTokenExpired(accessToken);
        if (isExpired && isProtectedRoute) {
            console.log('if')
            
            // Remove session cookies
            deleteCookie ('session');
            
            // Remove session cookie using NextResponse
            response.cookies.set('session', '', { maxAge: 0 });

            return NextResponse.redirect(new URL('/signIn', req.nextUrl));
        } else if (!isExpired && publicRoute.includes(currentPath)) {
            console.log('else')
            return NextResponse.redirect(new URL('/feed', req.nextUrl));
        }
        console.log('>>>')
        return NextResponse.next();
    }
    console.log('not have access key')
    if(isProtectedRoute){
        return NextResponse.redirect(new URL('signIn',process.env.NEXT_PUBLIC_PORT_URL))
    }
}

export const config = {
  matcher: ['/signUp','/signIn',
            '/',
            '/feed','/feed/profile','/feed/book_mark','/feed/create_post',
            '/feed/gemini_bot','/feed/messages','/feed/messages/chat[chatId]',
            '/feed/notifications','/feed/notifications/view-post/[postId]',
            '/story-carasoll/[storyId]','/feed/settings'
          ],
};
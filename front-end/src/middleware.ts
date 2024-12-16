import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers'
import isTokenExpired from './lib/utils/isTokenExpired';
import { deleteCookie  } from 'cookies-next';

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
  const response = NextResponse.next()

  const isProtectedRoute = protectedRoutes.includes(currentPath)

  const cookieStore = cookies();
  const session = cookieStore.get('session');

  let accessToken ;
  if(session){
    const sessionData = JSON.parse(session?.value as string);
    accessToken = sessionData?.accessToken

  }
  
    if (accessToken) {      
        const isExpired = isTokenExpired(accessToken);
        if (isExpired && isProtectedRoute) {
            
            // Remove session cookies
            deleteCookie ('session');
            
            // Remove session cookie using NextResponse
            response.cookies.set('session', '', { maxAge: 0 });

            return NextResponse.redirect(new URL('/signIn', req.nextUrl));
        } else if (!isExpired && publicRoute.includes(currentPath)) {
            return NextResponse.redirect(new URL('/feed', req.nextUrl));
        }
        return NextResponse.next();
    }
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
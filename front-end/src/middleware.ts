// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    console.log('middleware invoked.....',request.cookies.getAll())
    const accessToken = request.cookies.get('accessToken')?.value;
    console.log('access token inside the middleware from cookie :-',accessToken)

    // if (!accessToken && ['/feed', '/profile'].includes(request.nextUrl.pathname)) {
    //     return NextResponse.redirect(new URL('/signIn', request.url));
    // }

    return NextResponse.next();
}

export const config = {
    matcher: ['/feed/:path*', '/profile/:path*'],
};

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    console.log('logout api invoked .....')
    cookies().set("accessToken", "", { maxAge: 0 }); // Clear cookie by setting maxAge to 0
    console.log("BASE_URL",process.env.NEXT_PUBLIC_PORT_URL)
    return NextResponse.redirect(new URL("/signIn", process.env.NEXT_PUBLIC_PORT_URL)); // Redirect after logout
}
    
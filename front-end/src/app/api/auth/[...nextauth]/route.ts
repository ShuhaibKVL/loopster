// import userAuthService from '@/services/user/userAuthService'
// import NextAuth,
//     {NextAuthOptions}
//     // {AuthOptions } 
// from 'next-auth'
// import GoogleProvider from 'next-auth/providers/google'
// import { ISignUp_user} from '@/app/(auth)/signUp/page' 
// import { ISessionParams } from '@/lib/utils/sessionHandler'
// import { setCookie } from 'cookies-next';
// import { IAccount_Next_Auth, IToken_Next_Auth, User_Next_Auht } from '@/lib/utils/interfaces/INext-Auth'


// // next auth configuration
// export const authOptions:NextAuthOptions ={
//     providers:[
//         GoogleProvider({
//             clientId:process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
//             clientSecret:process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string
//         })
//     ],

//     callbacks:{
//         async jwt({token, account , user}:{token:IToken_Next_Auth,account:IAccount_Next_Auth,user:User_Next_Auht}){
//             console.log('response :',token,account,user)
//             if(user){
//                 const userData : ISignUp_user = {
//                     email:user?.email as string,
//                     fullName:user?.name as string,
//                     userName:user?.name as string,
//                     profileImage:user?.image as string,
//                     isGoogleSignIn:true  
//                 }
    
//                 const create = await userAuthService.signInWithGoogle(userData)
//                 console.log('signUp response of google signIn :',create)
//                 if(!create.status){
//                     console.log('create respnse :',create?.message)
//                 }

//                 const responseData : ISessionParams ={
//                     user:create?.userData,
//                     accessToken:create?.accessToken,
//                     totalUnReadMessages:create?.totalUnReadMessages
//                 }

//                 setCookie("session", JSON.stringify(responseData), {
//                     httpOnly: false,
//                     secure: process.env.NODE_ENV === "production",
//                     sameSite: "strict",
//                 });

//                 if (create?.status) {
//                     token.session = {
//                       user: create.userData,
//                       accessToken: create.accessToken,
//                       totalUnReadMessages: create.totalUnReadMessages,
//                     };
//                 } // Attach session to the token
                
//             }
//             return token
//         },
        
//         async session({ session , token }) {
//           if (token?.session) {
//             session.user = token.session?.user;
//             session.accessToken = token.session.accessToken;
//             session.totalUnReadMessages = token.session.totalUnReadMessages;
//           }
//           return session;
//         },
//     },
//     pages: {
//         signIn: '/signIn',
//         newUser: '/feed', // Redirect new users to the feed page
//       },
// }

// const handler = NextAuth(authOptions)
// export { handler as GET , handler as POST}
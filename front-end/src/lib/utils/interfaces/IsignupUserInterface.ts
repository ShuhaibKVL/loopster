export interface IsignupUserInterface{
    _id:string,
    fullName:string,
    userName:string,
    email:string,
    profileImage?:string,
    password:string,
    isList?:boolean,
    isBlocked?:boolean,
    isVerified?:boolean
    isGoogleSignIn?:boolean
    isPrivateAccount?:boolean
}
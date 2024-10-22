export interface IsignupUserInterface{
    _id:string,
    fullName:string,
    userName:string,
    email:string,
    imgUrl?:string,
    password:string,
    isList?:boolean,
    isBlocked?:boolean,
    isVerified?:boolean
}
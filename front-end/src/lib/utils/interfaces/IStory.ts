import { ObjectId } from "mongoose"

export enum IColorTheme{
    "bg-gradient-to-r from-gray-100 via-gray-300 to-gray-200", "bg-gradient-to-b from-white via-blue-100 to-blue-50" ,
     "bg-gradient-to-r from-green-50 via-teal-100 to-blue-50" , "bg-gradient-to-bl from-pink-50 via-red-100 to-yellow-50" ,
     "bg-gradient-to-r from-indigo-50 via-purple-100 to-pink-50" , "bg-gradient-to-tl from-yellow-100 via-orange-200 to-red-100" ,
     'bg-black' , 'bg-white'
}

export const colorTheme = [
    "bg-gradient-to-r from-gray-100 via-gray-300 to-gray-200", "bg-gradient-to-b from-white to-blue-500" ,
    "bg-gradient-to-r from-green-50 via-teal-100 to-blue-50" , "bg-gradient-to-bl from-pink-50 via-red-100 to-yellow-50" ,
    "bg-gradient-to-r from-indigo-50 via-purple-100 to-pink-50" , "bg-gradient-to-tl from-yellow-100 via-orange-200 to-red-100" ,
    'bg-black' , 'bg-white'
]

export interface IStory{
    color:IColorTheme;
    note:string;
    userId:string;
    isReaded?:ObjectId[]
}

export interface IStoryResponse{
    _id:string,
    color:IColorTheme;
    note:string;
    userId:{userName:string,_id:string,profileImage:string};
    isReaded?:ObjectId[],
    createdAt:string
}
import { IPost } from "@/app/utils/interfaces/IPost"

export interface IPostServices {
    createPost(data:IPost):Promise<any>
    deletePost(postId:string):Promise<any>
}
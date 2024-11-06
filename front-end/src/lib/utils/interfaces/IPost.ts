export interface IPost {
    userId:string,
    content:string,
    mediaType:"none" | "video" | "image",
    mediaUrl?:File | null,
    isList?:boolean,
    isReported?:boolean,
    createdAt?:string
}

export interface IPostResponse extends IPost{
    _id:string,
}
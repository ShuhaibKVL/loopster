export interface IPost {
    userId:string,
    content:string,
    mediaType:"none" | "video" | "image",
    mediaUrl?:File | null,
}
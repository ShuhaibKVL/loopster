export interface IPost {
    userId:string,
    content:string,
    mediaType:"none" | "video" | "img",
    mediaUrl?:string,
}
export interface ILike{
    userId:string,
    postId:string
}

export interface ILikeResponse extends ILike{
    _id:string,
    createdAt:string
}
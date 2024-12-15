export interface IComment{
    postId:string,
    userId:string,
    comment:string,
}

export interface ICommentResponse extends IComment{
    _id:string
    createdAt:string,
    user:{
        userName:string,
        profileImage:string
    },
    likes:string[]
}

export interface ICommentResponseWInnerComment extends ICommentResponse{
    innerComments:ICommentResponse[]
}
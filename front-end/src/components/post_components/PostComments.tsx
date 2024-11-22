import React, { useEffect, useState } from 'react'
import CommentFeed from './CommentFeed'
import { ICommentResponse, ICommentResponseWInnerComment } from '@/lib/utils/interfaces/IComment'
import { ObjectId } from 'mongoose'

interface IPostCommentsProps{
  comments:ICommentResponseWInnerComment[]
  getComments:(postId:string) => void
  commentInputRef:React.RefObject<HTMLElement>
  selectedComment:React.Dispatch<React.SetStateAction<null | {userProfile:string,comment:string,commentId:string}>>
}

export default function PostComments({comments,getComments,commentInputRef,selectedComment}:IPostCommentsProps) {
  return (
    <>
    {comments.length > 0 ? 
    (
      comments.map((item) => (
        <CommentFeed
        comment={item}
        userName={item?.user?.userName}
        userProfileImg={item?.user?.profileImage}
        getComments={getComments}
        commentInputRef={commentInputRef}
        selectedComment={selectedComment}
        />
      )) 
    ) : (
      <>
      <p className='w-full text-center'>No more comments</p>
      </>
    )} 
    </>
  )
}

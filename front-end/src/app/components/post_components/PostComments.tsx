import React, { useEffect, useState } from 'react'
import CommentFeed from './CommentFeed'
import { ICommentResponse } from '@/lib/utils/interfaces/IComment'

interface IPostCommentsProps{
  comments:ICommentResponse[]
  getComments:(postId:string) => void
}

export default function PostComments({comments,getComments}:IPostCommentsProps) {
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

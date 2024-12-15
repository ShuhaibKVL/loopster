import React from 'react'
import CommentFeed from './CommentFeed'
import { ICommentResponseWInnerComment } from '@/lib/utils/interfaces/IComment'

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
        key={item?._id}
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

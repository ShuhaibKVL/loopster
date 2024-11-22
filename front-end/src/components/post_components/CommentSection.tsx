'use client'

import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/hooks/typedUseDispatch'
import { RootState } from '@/lib/redux/store/store'
import { IComment, ICommentResponse, ICommentResponseWInnerComment } from '@/lib/utils/interfaces/IComment'
import commentService from '@/services/user/post/comment/commentService'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import AvatarComponent from '../cm/Avatar'
import CommentFeedSkeleton from '../skeltons/CommentFeedSkeleton'
import PostComments from './PostComments'
import { ObjectId } from 'mongoose'
import { CiSquareRemove } from "react-icons/ci";

interface ICommentSectionProps{
    postId:string
}
export default function CommentSection({postId}:ICommentSectionProps) {
    const userProfileImg = useAppSelector((state:RootState) => state?.user?.userProfile)
    const logedUserId = useAppSelector((state:RootState) => state.user.userId)
    const [ commentInput , setCommmentInput ] = useState<string>('')
    const [ comments , setComments ] = useState<ICommentResponseWInnerComment[]>([])
    const commentInputRef = useRef<HTMLInputElement>(null)
    const [ selectedComment , setSelectedComment ]= useState<{userProfile:string,comment:string,commentId:string} | null>(null)

    // Fetch the post's comments
    async function getComments(postId:string) {
        const response = await commentService.getPostComments(postId)
        setComments(response?.comments)
    }

    useEffect(() => {
        getComments(postId)
    },[postId])

    // handle create comment
    const handleCommentInput =(e:React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        setCommmentInput(e.target.value)
    }
  
    const handleSubmit = async () => {
      if(!logedUserId && !postId && commentInput.length <= 0){
        alert('missing valid credential')
        return
      }
      let newComment : IComment = {
        postId:postId,
        userId:logedUserId,
        comment:commentInput
      }

      if(selectedComment){
         newComment ={
          postId:selectedComment?.commentId,
          userId:logedUserId,
          comment:commentInput
        }
      }
        const response  = await commentService.createComment(newComment)
  
        if(response){
          setCommmentInput('')
          getComments(postId)
          setSelectedComment(null)
        }
    }

  return (
    <>
    <div className='relative border mt-10 p-2 overflow-y-auto flex flex-col gap-2 h-full'>
      {/* comments of posts */}
      <Suspense fallback={<CommentFeedSkeleton/>} >
        <PostComments
         comments={comments} 
         getComments={getComments} 
         commentInputRef={commentInputRef}
         selectedComment={setSelectedComment}
         />
      </Suspense>
    </div>
    {/* show if the any replay comment is selected */} 
    {selectedComment && (
          <div className='h-1/6 flex items-center justify-between bg-green-100 w-full gap-2 p-2 overflow-hidden'>
            <div className='flex items-center'>
              <AvatarComponent
                imgUrl={selectedComment?.userProfile}
              />
              <p>{selectedComment?.comment}</p>
            </div>
            <CiSquareRemove onClick={() => setSelectedComment(null)} />
          </div>
      )}
    {/* add new comment  */}
      <div className='h-1/6 flex items-center justify-between w-full gap-2 p-2 overflow-hidden'>
          <AvatarComponent
          imgUrl={userProfileImg}
          />
          <input onChange={handleCommentInput} type="text" value={commentInput}
          ref={commentInputRef}
          placeholder='comment here...' className='rounded-sm border w-full'/>
          <Button disabled={commentInput.length <= 0}
          onClick={handleSubmit}
          >Post</Button>
      </div>    
    </>
  )
}

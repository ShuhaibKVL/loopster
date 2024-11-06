'use client'

import React, { Suspense, useEffect, useState } from 'react'
import CommentFeedSkeleton from '../skeltons/CommentFeedSkeleton'
import PostComments from './PostComments'
import AvatarComponent from '../Avatar'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/hooks/typedUseDispatch'
import { RootState } from '@/lib/redux/store/store'
import commentService from '@/services/user/post/comment/commentService'
import { IComment, ICommentResponse } from '@/lib/utils/interfaces/IComment'

interface ICommentSectionProps{
    postId:string
}
export default function CommentSection({postId}:ICommentSectionProps) {
    const userProfileImg = useAppSelector((state:RootState) => state?.user?.userProfile)
    const logedUserId = useAppSelector((state:RootState) => state.user.userId)
    const [ commentInput , setCommmentInput ] = useState<string>('')
    const [ comments , setComments ] = useState<ICommentResponse[]>([])

    // Fetch the post's comments
    async function getComments(postId:string) {
        const response = await commentService.getPostComments(postId)
        setComments(response?.comments)
    }

    useEffect(() => {
      console.log('fetch comments :')
      console.log('post id :',postId)
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
      const newComment : IComment = {
        postId:postId,
        userId:logedUserId,
        comment:commentInput
      }
      const response  = await commentService.createComment(newComment)

      if(response){
        setCommmentInput('')
        getComments(postId)
      }
    }
  return (
    <>
    <div className='relative border mt-10 p-2 overflow-y-auto flex flex-col gap-2 h-full'>
      {/* comments of posts */}
      <Suspense fallback={<CommentFeedSkeleton/>} >
        <PostComments comments={comments} getComments={getComments}/>
      </Suspense>
    </div>
    {/* add new comment  */}
    <div className='h-1/6 flex items-center justify-between w-full gap-2 p-2 overflow-hidden'>
        <AvatarComponent
        imgUrl={userProfileImg}
        />
        <input onChange={handleCommentInput} type="text" value={commentInput}
        placeholder='comment here...' className='rounded-sm border w-full'/>
        <Button disabled={commentInput.length <= 0}
        onClick={handleSubmit}
        >Post</Button>
    </div>
    </>
  )
}

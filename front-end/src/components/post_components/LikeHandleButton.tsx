import { useAppSelector } from '@/hooks/typedUseDispatch'
import { RootState } from '@/lib/redux/store/store'
import likeService from '@/services/user/post/like/likeService'
import { InfiniteData, QueryObserverResult } from '@tanstack/react-query'
import React from 'react'
import { IoMdHeartEmpty } from 'react-icons/io'

export default function LikeHandleButton({postId,refetchPosts}:{
  postId:string,
  refetchPosts: () => Promise<void> | (() => Promise<QueryObserverResult<InfiniteData<{ posts: unknown; hasMore: boolean }>, Error>> );
}) {
    const userId = useAppSelector((state:RootState) => state?.user?.userId)
    const handleLike = async() => {
        await likeService.like(userId,postId)   
        refetchPosts()
    }
  return (
    <IoMdHeartEmpty onClick={handleLike} className='sm:w-5 sm:h-5 opacity-75'/>
  )
}

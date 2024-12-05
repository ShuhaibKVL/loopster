import { useAppSelector } from '@/hooks/typedUseDispatch'
import { RootState } from '@/lib/redux/store/store'
import likeService, { LikeService } from '@/services/user/post/like/likeService'
import { InfiniteData, QueryObserverResult } from '@tanstack/react-query';
import React from 'react'
import { FaHeart } from "react-icons/fa";

export default function UnlikeHandleButton({postId,refetchPosts}:{postId:string,refetchPosts: () => Promise<void> | (() => Promise<QueryObserverResult<InfiniteData<{ posts: any; hasMore: boolean }>, Error>> );}) {
    const userId = useAppSelector((state:RootState) => state?.user?.userId)
    const handleUnLike = async() => {
        const response = await likeService.unlike(postId,userId)   
        refetchPosts()
    }
  return (
    <FaHeart onClick={handleUnLike} className='sm:w-5 sm:h-5 opacity-75 text-red-600'/>
  )
}
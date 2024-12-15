import { useAppSelector } from '@/hooks/typedUseDispatch';
import { RootState } from '@/lib/redux/store/store';
import bookMarkService from '@/services/user/post/bookmark/BookMarkService';
import { InfiniteData, QueryObserverResult } from '@tanstack/react-query';
import React from 'react'
import { FaRegBookmark } from 'react-icons/fa'

interface IBookMarkHandleButton{
    postId:string,
    refetchPosts: () => Promise<void> | (() => Promise<QueryObserverResult<InfiniteData<{ posts: any; hasMore: boolean }>, Error>> );
}

export default function BookMarkHandleButton({postId,refetchPosts}:IBookMarkHandleButton) {
    const userId = useAppSelector((state:RootState) => state?.user?.userId)
    
    const handleCreateBookMark = async() => {
       const res = await bookMarkService.create(userId,postId)
       await refetchPosts()
    }
  return (
    <FaRegBookmark onClick={handleCreateBookMark} className='sm:w-5 sm:h-5 opacity-75' />
  )
}

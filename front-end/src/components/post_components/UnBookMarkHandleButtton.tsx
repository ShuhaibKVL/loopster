import { useAppSelector } from '@/hooks/typedUseDispatch';
import { RootState } from '@/lib/redux/store/store';
import bookMarkService from '@/services/user/post/bookmark/BookMarkService';
import { InfiniteData, QueryObserverResult } from '@tanstack/react-query';
import React from 'react'
import { MdBookmark } from "react-icons/md";

interface IUnBookMarkHandleButton{
    postId:string,
    refetchPosts: () => Promise<void> | (() => Promise<QueryObserverResult<InfiniteData<{ posts: unknown; hasMore: boolean }>, Error>> );
}

export default function UnBookMarkHandleButtton({postId,refetchPosts}:IUnBookMarkHandleButton) {
    const userId = useAppSelector((state:RootState) => state?.user?.userId)

    const handleDeleteBookMark = async() => {
        await bookMarkService.delete(userId,postId)
        await refetchPosts()
    }
  return (
    <MdBookmark onClick={handleDeleteBookMark} className='sm:w-5 sm:h-5 text-primary' />
  )
}

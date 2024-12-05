import { Button } from '@/components/ui/button'
import { RootState } from '@/lib/redux/store/store'
import followService from '@/services/folllow/followService'
import React from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@/hooks/typedUseDispatch'
import { fetchLatestPosts } from '@/lib/redux/features/postSlice'
import { InfiniteData, QueryObserverResult } from '@tanstack/react-query'

interface IFollowUserIds{
    following:string,
    isButton?:boolean,
    refetchPosts: () => Promise<void> | (() => Promise<QueryObserverResult<InfiniteData<{ posts: any; hasMore: boolean }>, Error>> );
}
export default function FollowHandleButton({following,refetchPosts,isButton}:IFollowUserIds) {
    const userId = useSelector((state:RootState) => state.user.userId)
    const dispatch = useAppDispatch()

    async function handleFollow(){
        if(!userId && following){
            throw Error('follower and following id not get inside the FollowHandleButton component')
        }
        const newFollowDoc = {
            follower : userId,
            following: following
        }
        const follow = await followService.follow(newFollowDoc)
        await refetchPosts()
    }
    return (
        <>
        {isButton ? (
            <Button onClick={handleFollow} className='w-full'>Follow</Button>
        ) : (
            <p onClick={handleFollow} className='text-blue-500 cursor-pointer text-md'>Follow</p>
        )}
        </> 
    )
}

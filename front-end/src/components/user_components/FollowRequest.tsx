'use client'

import { Button } from '@/components/ui/button'
import { RootState } from '@/lib/redux/store/store'
import followService from '@/services/folllow/followService'
import React from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@/hooks/typedUseDispatch'
import { fetchLatestPosts } from '@/lib/redux/features/postSlice'
import { InfiniteData, QueryObserverResult } from '@tanstack/react-query'
import { confirmAction } from '../cm/ConfirmationModal'
import { getProfileUserData } from '@/lib/redux/features/storySlice'

interface IFollowUserIds{
    following:string,
    isButton?:boolean,
    isFromProfile?:boolean,
    refetchPosts: () => Promise<void> | (() => Promise<QueryObserverResult<InfiniteData<{ posts: any; hasMore: boolean }>, Error>> );
}
export default function FollowRequest({following,refetchPosts,isButton = true,isFromProfile=false}:IFollowUserIds) {
    const userId = useSelector((state:RootState) => state?.user?.userId)
    const dispatch = useAppDispatch()
    
    async function handleUnFollow(){
        if(!userId && following){
            throw Error('follower and following id not get inside the FollowHandleButton component')
        }

        const willProceed = await confirmAction({
            title: `Change your mind..!`,
            text: `Are you sure to cancel the request?`,
            icon: 'warning',
        });
    
        if(willProceed){
            console.log('Go ahead..>>>')
            let deleteDoc = {
                follower:userId,
                following:following
            }

            const follow = await followService.cancleFollowRequest(deleteDoc)
            console.log('request cancle response :',follow)
            await refetchPosts()
            if(isFromProfile){
                dispatch(getProfileUserData(userId))
            }
        }
        
    }

    return (
        <>
        {isButton ? (
            <Button onClick={handleUnFollow} className='w-full'>Requested</Button>
        ) : (
            <p onClick={handleUnFollow} className='text-blue-500 cursor-pointer text-md'>Requested</p>
        )}
        </> 
    )
}
'use client'

import { Button } from '@/components/ui/button'
import { RootState } from '@/lib/redux/store/store'
import followService from '@/services/folllow/followService'
import React from 'react'
import { useSelector } from 'react-redux'
import { confirmAction } from '../cm/ConfirmationModal'
import { InfiniteData, QueryObserverResult } from '@tanstack/react-query'
import { IFollow } from '@/services/folllow/interfaces/IFollowService'
import { useAppDispatch } from '@/hooks/typedUseDispatch'
import { getProfileUserData } from '@/lib/redux/features/storySlice'

interface IFollowUserIds{
    following:string,
    isButton?:boolean,
    isFromProfile?:boolean,
    isDisplay?:boolean,
    label?:string,// for accepting the remove follower also
    removeFollower?:IFollow | null,
    refetchPosts: () => Promise<void> | (() => Promise<QueryObserverResult<InfiniteData<{ posts: unknown; hasMore: boolean }>, Error>> );
}
export default function UnFollowHandleButton({following,refetchPosts,isButton = true,label = 'UnFollow',removeFollower = null,isFromProfile=false}:IFollowUserIds) {
    const userId = useSelector((state:RootState) => state.user.userId)
    const dispatch = useAppDispatch()

    async function handleUnFollow(){
        if(!userId && following){
            throw Error('follower and following id not get inside the FollowHandleButton component')
        }

        const willProceed = await confirmAction({
            title: `CAUTION !!!`,
            text: `Are you sure to ${label} the user?`,
            icon: 'warning',
        });
    
        if(willProceed){
            let newFollowDoc ;// the unfollow / remove follower is same functionality. so to dynamically use this component for unfollow and remove follower

            if(!removeFollower){
                console.log('unfollow')
                newFollowDoc = {
                    follower : userId,
                    following: following
                }
            }else {
                console.log('remove follower')
                newFollowDoc = {
                    follower:following,
                    following:userId
                }
            }
            if(newFollowDoc){
                await followService.unFollow(newFollowDoc)
                await refetchPosts()
                if(isFromProfile){
                    dispatch(getProfileUserData(userId))
                }
            }
        }
        
    }
    return (
        <>
        {isButton ? (
            <Button onClick={handleUnFollow} className='w-full'>{label}</Button>
        ) : (
            <p onClick={handleUnFollow} className='text-blue-500 cursor-pointer text-md'>{label}</p>
        )}
        </> 
    )
}

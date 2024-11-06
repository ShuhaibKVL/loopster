
import { Button } from '@/components/ui/button'
import { RootState } from '@/lib/redux/store/store'
import followService from '@/services/folllow/followService'
import React from 'react'
import { useSelector } from 'react-redux'
import { confirmAction } from '../ConfirmationModal'
import { fetchLatestPosts } from '@/lib/redux/features/postSlice'
import { useAppDispatch } from '@/hooks/typedUseDispatch'
import { InfiniteData, QueryObserverResult } from '@tanstack/react-query'

interface IFollowUserIds{
    following:string,
    refetchPosts: () => Promise<QueryObserverResult<InfiniteData<{ posts: any; hasMore: boolean }>, Error>>;
}
export default function UnFollowHandleButton({following,refetchPosts}:IFollowUserIds) {
    const userId = useSelector((state:RootState) => state.user.userId)

    const dispatch = useAppDispatch()

    async function handleUnFollow(){
        if(!userId && following){
            throw Error('follower and following id not get inside the FollowHandleButton component')
        }

        const willProceed = await confirmAction({
            title: `CAUTION !!!`,
            text: `Are you sure to UNFOLLOW the user?`,
            icon: 'warning',
        });
    
        if(willProceed){
            const newFollowDoc = {
                follower : userId,
                following: following
            }

            const follow = await followService.unFollow(newFollowDoc)
            // dispatch(fetchLatestPosts({userId}))
            await refetchPosts()
        }
        
    }
    return (
        <Button onClick={handleUnFollow} className='w-full'>UnFollow</Button>
    )
}

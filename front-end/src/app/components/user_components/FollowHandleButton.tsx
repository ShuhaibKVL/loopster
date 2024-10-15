import { Button } from '@/components/ui/button'
import { RootState } from '@/lib/redux/store/store'
import followService from '@/services/folllow/followService'
import React from 'react'
import { useSelector } from 'react-redux'

interface IFollowUserIds{
    following:string,
    onUserUpdate:() => void
}
export default function FollowHandleButton({following,onUserUpdate}:IFollowUserIds) {
    const userId = useSelector((state:RootState) => state.user.userId)

    async function handleFollow(){
        if(!userId && following){
            throw Error('follower and following id not get inside the FollowHandleButton component')
        }
        const newFollowDoc = {
            follower : userId,
            following: following
        }
        const follow = await followService.follow(newFollowDoc)
        console.log('follow :',follow)
        onUserUpdate()
        
    }
    return (
        <Button onClick={handleFollow} className='w-full'>Follow</Button>
    )
}

import { Button } from '@/components/ui/button'
import { RootState } from '@/lib/redux/store/store'
import followService from '@/services/folllow/followService'
import React from 'react'
import { useSelector } from 'react-redux'
import { confirmAction } from '../ConfirmationModal'

interface IFollowUserIds{
    following:string,
    onUserUpdate:() =>void
}
export default function UnFollowHandleButton({following,onUserUpdate}:IFollowUserIds) {
    const userId = useSelector((state:RootState) => state.user.userId)

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
            console.log('follow :',follow)
            onUserUpdate()
        }
        
    }
    return (
        <Button onClick={handleUnFollow} className='w-full'>UnFollow</Button>
    )
}

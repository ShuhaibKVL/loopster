import React from 'react'
import ProfileHeaderSkeleton from './ProfileHeaderSkeleton'
import PostIMageSkelton from './PostIMageSkelton'

export default function PostSkelton() {
    return (
        <div className='w-full border-2 rounded-md p-2 space-y-2'>
            <ProfileHeaderSkeleton />
            <div className='w-full h-48'>
            <PostIMageSkelton />
            </div>
            
        </div>
    )
}

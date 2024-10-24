import React from 'react'
import ProfileHeaderSkeleton from './ProfileHeaderSkeleton'
import PostIMageSkelton from './PostIMageSkelton'

export default function PostSkelton() {
    return (
        <div className='w-full min-h-48 border-2 rounded-md p-2'>
            <ProfileHeaderSkeleton />
            <PostIMageSkelton />
        </div>
    )
}

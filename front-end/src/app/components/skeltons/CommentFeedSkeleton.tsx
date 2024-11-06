import React from 'react'
import AvatarComponent from '../Avatar'
import { CiHeart } from 'react-icons/ci'

export default function CommentFeedSkeleton() {
  return (
    <div className='flex gap-1'>
        <AvatarComponent
        />
        <h1 className='skeleton w-full h-10 mr-1'></h1>
        <div className='skeleton w-full h-10 mr-1'></div>
        <CiHeart />
    </div>
  )
}

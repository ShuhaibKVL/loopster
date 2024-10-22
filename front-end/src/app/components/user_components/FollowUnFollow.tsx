import React from 'react'

interface IFollowUnfollow{
    follow:number,
    followers:number
}
export default function FollowUnFollow({follow , followers}:IFollowUnfollow) {
    return (
        <section className='flex items-center justify-center gap-x-1 w-full mt-2'>
        <div className='space-y-1'>
            <p className='px-1 border rounded-lg py-1 font-mono'>Following</p>
            <p className='text-center'>{follow}</p>
        </div>
        <div className='space-y-1'>
            <p className='px-1 border rounded-lg py-1 font-mono'>Followers</p>
            <p className='text-center'>{followers}</p>
        </div>
        </section>
    )
}

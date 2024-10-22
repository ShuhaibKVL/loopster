import { Avatar, AvatarImage } from '@/components/ui/avatar'
import React from 'react'
import { AvatarFallback } from '@radix-ui/react-avatar'
import AvatarSkelton from '../skeltons/AvatarSkelton'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import FollowUnFollow from './FollowUnFollow'
import FollowButton from './FollowHandleButton'
import FollowHandleButton from './FollowHandleButton'
import UnFollowHandleButton from './UnFollowHandelButton'


export interface IUserHeader {
    _id:string,
    imgUrl:string,
    fullName:string,
    userName:string,
    follow:number,
    followers:number,
    isFollowed:boolean,
    onUserUpdate:() => void,
    followedCount:number,
    followersCount:number
}

export default function UserHeader({
    _id,
    imgUrl,
    fullName,
    userName,
    follow,
    followers,
    isFollowed,
    followedCount,
    followersCount,
    onUserUpdate
}:IUserHeader) {
    return (
    <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
        <HoverCard>
            <HoverCardTrigger>
                <div className="h-10 w-10 overflow-hidden shrink-0 rounded-full border">
                    <Avatar >
                        {imgUrl !== '' ? (
                            <AvatarImage
                            src= {imgUrl}// Image URL for the user profile
                            alt="PR" // Accessible alt text
                            className=''
                        />
                        ) : (
                            <AvatarFallback>
                                {<AvatarSkelton />}
                            </AvatarFallback>
                        )}
                    </Avatar>
                </div>
            </HoverCardTrigger >
            <HoverCardContent className='bg-[var(--secondary-bg)]' >

                {/* The React Framework – created and maintained by @vercel. */}
                <div className="flex items-center gap-4">
                <div className="h-10 w-10 overflow-hidden shrink-0 rounded-full border">
                    <Avatar >
                    <AvatarImage
                        src={imgUrl} // Image URL for the user profile
                        alt="PR" // Accessible alt text
                        className='overflow-hidden object-contain'
                    />
                    <AvatarFallback>{<AvatarSkelton />}</AvatarFallback>
                    </Avatar>
                </div>
            <div className="flex flex-col gap-1">
                <h1 className='font-bold'>{fullName || 'fullName'}</h1>
                <p className='font-mono'>{userName || 'userName'}</p>
            </div>
            </div>
            <FollowUnFollow follow={followedCount} followers={followersCount} />

            {/* Follow / UnFollow section */}
            {isFollowed ? (
                <UnFollowHandleButton following={_id} onUserUpdate={onUserUpdate} />
            ) : (
                <FollowHandleButton following={_id}  onUserUpdate={onUserUpdate} />
            )}
                

                </HoverCardContent>
            </HoverCard>
            <div className="flex flex-col gap-1">
                <h1 className='font-bold'>{fullName || 'fullName'}</h1>
                <p className='font-mono'>{userName || 'userName'}</p>
            </div>
        </div>
        </div>
    )
}

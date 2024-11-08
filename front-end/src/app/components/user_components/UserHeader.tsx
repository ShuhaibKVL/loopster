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
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store/store'
import { InfiniteData, QueryObserverResult } from '@tanstack/react-query'
import defaultUserAvatar from '../../../../public/Images/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg'
import { BiSolidUserCircle } from "react-icons/bi";


export interface IUserHeader {
    _id:string,
    imgUrl:string,
    fullName:string,
    userName:string,
    follow:number,
    followers:number,
    isFollowed:boolean,
    followedCount:number,
    followersCount:number,
    refetchPosts: () => Promise<QueryObserverResult<InfiniteData<{ posts: any; hasMore: boolean }>, Error>>;
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
    refetchPosts
}:IUserHeader) {

    const userId = useSelector((state:RootState) => state?.user?.userId)

    return (
    <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
        <HoverCard >
            <HoverCardTrigger className='z-50'>
                <div className="h-10 w-10 overflow-hidden shrink-0 rounded-full">
                    <Avatar >
                        {imgUrl !== '' ? (<>
                            <AvatarImage
                                src= {imgUrl}
                                alt="PR"
                                className=''
                            />
                        </>
                        ) : ( 
                            <BiSolidUserCircle className='text-[var(--hover-card)] w-full h-full object-contain' />
                        )}
                    </Avatar>
                </div>
            </HoverCardTrigger >
            {userId !== _id ? (
            <HoverCardContent className='bg-[var(--secondary-bg)] z-50' >
                <div className="flex items-center gap-4">
                <div className="h-10 w-10 overflow-hidden shrink-0 rounded-full">
                    <Avatar >
                    {imgUrl !== '' ? (<>
                            <AvatarImage
                                src= {imgUrl}
                                alt="PR"
                                className='overflow-hidden object-cover'
                            />
                        </>
                        ) : ( 
                            <BiSolidUserCircle className='text-[var(--hover-card)] w-full h-full object-contain' />
                        )}
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
                <UnFollowHandleButton following={_id} refetchPosts={refetchPosts} />
                ) : (
                <FollowHandleButton following={_id} refetchPosts={refetchPosts} />
                )}
                </HoverCardContent>
            ) : ('')}
            
            </HoverCard>
            <div className="flex flex-col gap-1">
                <h1 className='font-bold'>{fullName || 'fullName'}</h1>
                <p className='font-mono'>{userName || 'userName'}</p>
            </div>
        </div>
        </div>
    )
}

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { RootState } from '@/lib/redux/store/store'
// import { InfiniteData, QueryObserverResult } from '@tanstack/react-query'
import { BiSolidUserCircle } from "react-icons/bi"
import { useSelector } from 'react-redux'
import FollowHandleButton from './FollowHandleButton'
import FollowUnFollow from './FollowUnFollow'
import UnFollowHandleButton from './UnFollowHandelButton'
import Link from 'next/link'
import FollowRequest from './FollowRequest'


export interface IUserHeader {
    _id:string,
    imgUrl:string,
    fullName:string,
    userName:string,
    isFollowed:boolean,
    followedCount:number,
    followersCount:number,
    isRequestPending?:boolean
    refetchPosts:() => Promise<void> 
    // | (() => Promise<QueryObserverResult<InfiniteData<{ posts: unknown; hasMore: boolean }>, Error>> );
}

export default function UserHeader({
    _id,
    imgUrl,
    fullName,
    userName,
    isFollowed,
    followedCount,
    followersCount,
    isRequestPending,
    refetchPosts
}:IUserHeader) {

    const userId = useSelector((state:RootState) => state?.user?.userId)
    console.log('is request in userHeader :',isRequestPending)
    return (
    <div className="flex flex-col gap-4 max-w-60">
        <div className="flex items-center justify-between ">
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
                <Link href={`/feed/profile/${_id}`} >
                    <div className="flex flex-col gap-1">
                    <h1 className='font-bold'>{fullName || 'fullName'}</h1>
                    <p className='font-mono'>{userName || 'userName'}</p>
                    </div>
                </Link>
                
                </div>
                <FollowUnFollow  profileUserId={_id} follow={followedCount} followers={followersCount} />

                {/* Follow / UnFollow section */}
                {
                isRequestPending ? (
                    <FollowRequest following={_id} refetchPosts={refetchPosts} isButton={true}  />
                ) :isFollowed ? (
                    <UnFollowHandleButton following={_id} refetchPosts={refetchPosts} />
                ) : (
                    <FollowHandleButton following={_id} refetchPosts={refetchPosts} />
                )}
                </HoverCardContent>
            ) : ('')}
            
            </HoverCard>
            <Link href={`/feed/profile/${_id}`} >
                <div className="flex flex-col gap-1">
                <h1 className='font-bold'>{fullName || 'fullName'}</h1>
                <p className='font-mono'>{userName || 'userName'}</p>
                </div>
            </Link>
            </div>
            {/* Follow / UnFollow section */}
            {userId !== _id && (
                <div className=''>
                {
                isRequestPending ? (
                    <FollowRequest following={_id} refetchPosts={refetchPosts} isButton={false}  />
                ) :
                isFollowed ? (
                    <UnFollowHandleButton following={_id} refetchPosts={refetchPosts} isButton={false} />
                ) : (
                    <FollowHandleButton following={_id} refetchPosts={refetchPosts} isButton={false} />
                )}
                </div>
            )}
        </div>
        </div>
    )
}

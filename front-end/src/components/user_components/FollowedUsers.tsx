'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from '@/hooks/typedUseDispatch';
import userAuthService from '@/services/user/userAuthService';
import { IFollowedUser } from './FollowUnFollow';
import { RootState } from '@/lib/redux/store/store';
import AvatarComponent from '../cm/Avatar';
import Link from 'next/link';
import UnFollowHandleButton from './UnFollowHandelButton';
import { getProfileUserData } from '@/lib/redux/features/storySlice';

export default function FollowedUsers({follow,profileUserId}:{follow:number,profileUserId:string}) {
    const [ isOpen , setIsOpen ] = useState<boolean>(false)
    const [users , setUsers ] = useState<IFollowedUser[] | []>([])
    const dispatch = useAppDispatch()

    const userId  = useAppSelector((state:RootState) => state?.user?.userId)

    const getFollowedUsers = async() => {
        const response = await userAuthService.getFollowedUsers(profileUserId)
        setUsers(response?.data)
        setIsOpen(true)
        dispatch(getProfileUserData(profileUserId))
    }

  return (
    <div className='space-y-1'>
        <p className='px-1 rounded-lg py-1 font-mono'>Following</p>
        <p className='text-center cursor-pointer' onClick={getFollowedUsers}>{follow || 0}</p>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild> 
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle className='text-center overflow-hidden'>Followed Accounts</DialogTitle>
                    <DialogDescription className='overflow-y-scroll max-h-[70vh] scrollbar-hide'>
                        <div className='w-full p-2 flex flex-col'>
                            {users.map((user) => (
                                <div key={user?._id} className='flex w-full p-2 items-center justify-between'>
                                    <Link href={`/feed/profile/${user?.following?._id}`} >
                                    <div className='flex items-center gap-3'>
                                        <AvatarComponent imgUrl={user?.following?.profileImage}/>
                                        <div>
                                            <p className='font-semibold'>{user?.following?.userName}</p>
                                            <p className='font-mono'>{user?.following?.fullName}</p>
                                        </div>
                                    </div>
                                    </Link>
                                    {profileUserId === userId && (
                                        <div>
                                        <UnFollowHandleButton following={user?.following?._id} refetchPosts={getFollowedUsers} />
                                    </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
    </div>
  )
}

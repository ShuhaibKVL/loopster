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
import { useAppSelector } from '@/hooks/typedUseDispatch';
import userAuthService from '@/services/user/userAuthService';
import { IFollowers } from './FollowUnFollow';
import { RootState } from '@/lib/redux/store/store';
import AvatarComponent from '../cm/Avatar';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function Followers({followers}:{followers:number}) {
    const [ isOpen , setIsOpen ] = useState<boolean>(false)
    const [users , setUsers ] = useState<IFollowers[] | []>([])
    const userId  = useAppSelector((state:RootState) => state?.user?.userId)

    const getFollowers = async() => {
        const response = await userAuthService.getFollowers(userId)
        console.log('response :',response)
        setUsers(response?.data)
        setIsOpen(true)
    }

  return (
    <div className='space-y-1'>
        <p className='px-1 rounded-lg py-1 font-mono'>Followers</p>
        <p className='text-center cursor-pointer' onClick={getFollowers}>{followers}</p>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild> 
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle className='text-center overflow-hidden'>Followers</DialogTitle>
                    <DialogDescription className='overflow-y-scroll max-h-[70vh] scrollbar-hide'>
                        <div className='w-full p-2 flex flex-col'>
                            {users.map((user) => (
                                <div className='flex w-full p-2 items-center justify-between'>
                                    <Link href={`/feed/profile/${user?.follower?._id}`} >
                                    <div className='flex items-center gap-3'>
                                        <AvatarComponent imgUrl={user.follower?.profileImage}/>
                                        <div>
                                            <p className='font-semibold'>{user?.follower?.userName}</p>
                                            <p className='font-mono'>{user?.follower?.fullName}</p>
                                        </div>
                                    </div>
                                    </Link>
                                    <Button >Follow</Button>
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

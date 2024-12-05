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
import userAuthService from '@/services/user/userAuthService';
import { useAppSelector } from '@/hooks/typedUseDispatch';
import { RootState } from '@/lib/redux/store/store';
import AvatarComponent from '../cm/Avatar';
import { Button } from '../ui/button';
import { IFollow } from '@/services/folllow/interfaces/IFollowService';
import { IUserData } from '../post_components/Post';
import FollowedUsers from './FollowedUsers';
import Followers from './Followers';


interface IFollowUnfollow{
    follow:number,
    followers:number,
}

export interface IFollowedUser{
    _id:string,
    createdAt:string,
    following:IUserData,
    follower:string
}

export interface IFollowers{
    _id:string,
    createdAt:string,
    following:string,
    follower:IUserData
}

export default function FollowUnFollow({follow , followers}:IFollowUnfollow) {
    return (
        <section className='flex items-center justify-center gap-x-1 w-full mt-2'>
            <FollowedUsers follow={follow} />
            <Followers followers={followers} />
        </section> 
    )
}

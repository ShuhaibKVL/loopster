import React from 'react'
import { IUserData } from '../post_components/Post';
import FollowedUsers from './FollowedUsers';
import Followers from './Followers';


interface IFollowUnfollow{
    follow:number,
    followers:number,
    profileUserId:string
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

export default function FollowUnFollow({follow , followers,profileUserId}:IFollowUnfollow) {
    return (
        <section className='flex items-center justify-center gap-x-1 w-full mt-2'>
            <FollowedUsers follow={follow} profileUserId={profileUserId}/>
            <Followers followers={followers} profileUserId={profileUserId} />
        </section> 
    )
}

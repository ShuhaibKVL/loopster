import React from 'react'
import UserHeader from '../user_components/UserHeader'

export interface IUserData {
    _id:string,
    fullName:string,
    userName:string,
    profileImage:string,
    follow:number,
    followers:number,
    isFollowed:boolean,
    followedCount:number,
    followersCount:number
}

export interface IPostProps {
    userData: IUserData; // Accept a single userData object
    onUserUpdate : () => void
}

export default function Post({userData , onUserUpdate}:IPostProps){
    return (
        <div className='w-full min-h-48 border-2 rounded-md p-2'>
            <UserHeader imgUrl={userData?.profileImage} fullName={userData?.fullName}
            userName={userData?.userName} follow={userData?.follow} followers={userData?.followers}
            _id={userData?._id} isFollowed={userData?.isFollowed} followedCount={userData?.followedCount}
            followersCount={userData?.followersCount}
            onUserUpdate={onUserUpdate} />
        </div>
    )
}

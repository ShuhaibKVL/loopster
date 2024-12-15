'use client'

import { useAppSelector } from '@/hooks/typedUseDispatch'
import { RootState } from '@/lib/redux/store/store'
import userAuthService from '@/services/user/userAuthService'
import React, { useEffect, useState } from 'react'
import { IUserData } from './Post'
import UserHeader from '../user_components/UserHeader'

export default function Suggestion() {
  const  userId  = useAppSelector((state:RootState) => state?.user?.userId)
  const [ users , setUsers ] = useState<IUserData[] | []>([])
  
  const fetchSuggestionUser = async() => {
    const response = await userAuthService.getLatestUsers(userId)
    console.log('suggestion response :',response)
    if(response.status){
      setUsers(response?.data)
    }
  }

  useEffect(() => {
    fetchSuggestionUser()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userId])

  return (
    <div className='w-full h-full flex flex-col gap-1 p-2'>
      <h1 className='border-b p-2 text-[0.9rem]'>Suggested for you</h1>
      {users.length > 0 ? (
        users.map((user) => (
          <UserHeader
          _id={user?._id}
          followedCount={user?.followedCount}
          followersCount={user?.followersCount}
          isFollowed={user?.isFollowed}
          fullName={user?.fullName}
          userName={user?.userName}
          imgUrl={user?.profileImage}
          key={user?._id}
          isRequestPending={user?.isRequestPending}
          refetchPosts={fetchSuggestionUser}
           /> 
        ))
      ) : (
        <p className='w-full text-center' >No more suggestins</p>
      )}
    </div>
  )
}

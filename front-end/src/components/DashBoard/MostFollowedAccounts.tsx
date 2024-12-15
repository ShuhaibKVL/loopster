'use client'

import userManagementService from '@/services/admin/userManagementService'
import React, { useEffect, useState } from 'react'
import AvatarComponent from '../cm/Avatar'
import Link from 'next/link'

export interface IMostFollowedAccount{
    followersCount:number,
    userDetails:{
        _id:string,
        userName:string,
        fullName:string,
        profileImage:string
    }[]
}

export default function MostFollowedAccounts() {
    const [users , setUsers ] = useState<IMostFollowedAccount[] | []>([])
    
    const fetchPosts =async () => {
        const users =await userManagementService.findMostFollowedAccounts()
        console.log('accounts on the basis of follows :',users)
        if(users?.status){
            setUsers(users?.data)
        }
    }

    useEffect(() => {
        fetchPosts()
    },[])
  return (
    <div className='relative w-full sm:w-1/2 h-96 border p-4'>
        <h1 className='font-semibold space-x-2 absolute bg-[var(--secondary-bg)]'>Top followers accounts</h1>
        <div className='w-full mt-6 flex flex-col gap-2'>
            {users.length > 0 && (
                users?.map((user,index) => (
                    <div key={index} className='w-full flex items-center justify-between px-2'>
                        <div className='flex gap-2'>
                        <AvatarComponent imgUrl={user?.userDetails[0]?.profileImage} />
                            <div>
                            <Link href={`/admin/dashboard/userManagement/user-details/${user?.userDetails[0]?._id}`}>
                                <p className='font-semibold cursor-pointer'>{user?.userDetails[0]?.fullName}</p>
                            </Link>
                            <p>{user?.userDetails[0]?.userName}</p>
                            </div>
                        </div>                        
                        <p>{user?.followersCount}</p>
                    </div>
                ))
            )}
             </div>
    </div>  
  )
}

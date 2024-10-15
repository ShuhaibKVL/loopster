'use client'

import React, { useEffect, useLayoutEffect, useState } from 'react'
import userAuthService from '@/services/user/userAuthService'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store/store'
import withAuth from '../contexts/withAuth'
import CreatePostComponent from '../components/post_components/CreatePost'
import UserHeader from '../components/user_components/UserHeader'
import Post from '../components/post_components/Post'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/custome-tabs"
import { IUserData } from '../components/post_components/Post'
import useUserData from '@/hooks/customHooks/useUserData'


const Page = () => {
    const { users , fetchUsers} = useUserData()
    console.log('users data inside the feed page :',users)

    useEffect(() => {
        console.log('Users updated in Page component: ha ha ha ha ', users);
    },[users])
    
return (
        <>
        <CreatePostComponent />
        <Tabs defaultValue="Followers" className="w-full">
            <TabsList className='w-full'>
                <div className='w-full border rounded-md flex items-center justify-around'>
                <TabsTrigger value="Followers">Followers</TabsTrigger>
                <TabsTrigger value="Recommended">Recommended</TabsTrigger>
                </div>
            </TabsList>
            <TabsContent value="Followers" className='flex flex-col gap-2'>
                <Post />
            </TabsContent>
            <TabsContent value="Recommended"  className='flex flex-col gap-2'>
                {users.map((user) => (
                    <Post key={user._id} userData={user} onUserUpdate={fetchUsers} />
                ))}
            </TabsContent>
        </Tabs>
        </>
)
}

export default withAuth(Page,true)
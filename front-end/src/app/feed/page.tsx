'use client'

import React, { useEffect, useState } from 'react'
import { RootState } from '@/lib/redux/store/store'
import withAuth from '../contexts/withAuth'
import CreatePostComponent from '../components/post_components/CreatePost'
import Post from '../components/post_components/Post'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/custome-tabs"
import useUserData from '@/hooks/customHooks/useUserData'
import { fetchLatestPosts } from '@/lib/redux/features/postSlice'
import { useAppDispatch , useAppSelector } from '@/hooks/typedUseDispatch'
import { Suspense } from 'react'
import CreatePostSkelton from '../components/skeltons/CreatePostSkelton'
// import RecommendPosts from '../components/post_components/feedComponents/RecommendPosts'
import PostSkelton from '../components/skeltons/PostSkelton'

const Page = () => {
    const dispatch = useAppDispatch()
    const { users , fetchUsers} = useUserData()
    const userId = useAppSelector((state:RootState) => state.user.userId)

    const { posts , error , status } = useAppSelector((state:RootState) => state.post)
    console.log("posts , error . status :",posts,error,status)

    useEffect(() => {
        if(userId){
            dispatch(fetchLatestPosts(userId))
        }
    },[dispatch,userId])

return (
        <div className='h-fit flex flex-col gap-2'>
            <Suspense fallback={<CreatePostSkelton />} >
                <CreatePostComponent />
            </Suspense>
        <Tabs defaultValue="Followers" className="w-full">
            <TabsList className="w-full">
                <div className="w-full border rounded-md flex items-center justify-around">
                <TabsTrigger
                    value="Followers"
                    className="data-[state=active]:bg-[var(--color-bg)]"
                >
                    Followers
                </TabsTrigger>
                <TabsTrigger
                    value="Recommended"
                    className="data-[state=active]:bg-[var(--color-bg)]"
                >
                    Recommended
                </TabsTrigger>
                </div>
            </TabsList>
            <TabsContent value="Followers" className="flex flex-col gap-2">
                {/* // use here suspense and supporate the followers components to another components */}
                <Post />
            </TabsContent>
            <TabsContent value="Recommended" className="flex flex-col gap-2">
                {posts?.map((post) => (
                    <Post key={post?._id} postData={post} onUserUpdate={fetchUsers} />
                ))}
                {/* <Suspense fallback={<PostSkelton />} >
                    <RecommendPosts />
                </Suspense> */}
            </TabsContent>
        </Tabs>
        </div>
)
}

export default withAuth(Page,true)
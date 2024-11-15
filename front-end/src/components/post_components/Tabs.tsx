'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/custome-tabs"
import { Suspense } from 'react'
import PostSkelton from '../skeltons/PostSkelton'
import FollowersPosts from './feedComponents/FollowersPosts'
import RecommendPosts from './feedComponents/RecommendPosts'

export default function PostTabs() {
    
  return (
    <Tabs defaultValue="Followers" className="w-full sticky top-2 ">
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
                <Suspense fallback={<PostSkelton />} >
                    <FollowersPosts />
                </Suspense>
            </TabsContent>
            <TabsContent value="Recommended" className="flex flex-col gap-2">
                <Suspense fallback={<PostSkelton />} >
                    <RecommendPosts />
                </Suspense>
            </TabsContent>
        </Tabs>
  )
}

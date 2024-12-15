'use client'

import adminWithAuth from '@/app/contexts/adminWithAuth'
import AvatarComponent from '@/components/cm/Avatar'
import Content from '@/components/post_components/Content'
import PostContentContainer from '@/components/post_components/PostContentContainer'
import PostContentSkeleton from '@/components/skeltons/PostContentSkeleton'
import PostIMageSkelton from '@/components/skeltons/PostIMageSkelton'
import FollowUnFollow from '@/components/user_components/FollowUnFollow'
import { dateToDays, dateToHours, dateToMinutes } from '@/lib/utils/convertDateDifference'
import { IUserWithCounts } from '@/lib/utils/interfaces/IUserWIthCounts'
import userManagementService from '@/services/admin/userManagementService'
import Image from 'next/image'
import React, { Suspense, useEffect, useState } from 'react'
const Page = ({params}:{params:{userId:string}}) => {
    const [user , setUser ] = useState<IUserWithCounts | null>(null)
    const fertchUser = async() => {
        const response = await userManagementService.getUserData(params?.userId)
        console.log('user data :',response)
        if(response?.status){
            setUser(response?.user[0])
        }
    }

    useEffect(() => {
        fertchUser()
    },[])
    
  return (
    <div className='p-5 space-y-2 sm:space-y-10'>
        <div className="relative w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] m-auto group overflow-hidden rounded-full">
            <AvatarComponent imgUrl={user?.profileImage} h='h-full' w='w-full' />
        </div>

        <div className='flex flex-col items-center justify-center gap-x-1 w-full mt-2 '>
            {user && (
                <>
                <p className='font-semibold'>{user?.userName}</p>
                <p>{user?.fullName}</p>
                </> 
            )}
        </div>

    {/* Follow / Following section */}
    <section className='flex items-center justify-center gap-x-9 w-full'>
        <FollowUnFollow
            follow={Number(user?.counts?.followedCount)}
            followers={Number(user?.counts?.followersCount)}
        />
    </section>
        {/* User Posts */}
        <section>
            <h2 className='w-full p-2 text-center border rounded-lg mb-2 bg-[var(--color-bg)]'>Your Posts</h2>
            <div className='flex items-start flex-wrap justify-start rounded-sm gap-2 p-2'>
                {user && user?.posts?.length !== 0 ? (
                    user?.posts?.map((post) => (
                        <div className='relative mx-auto min-h-48 max-h-80 min-w-48 max-w-80 border rounded-sm bg-[var(--secondary-bg)]'>
                            <Suspense fallback={<PostContentSkeleton />}>
                                  {post?.mediaType === 'image' ? (
                                    post?.mediaUrl ? (
                                      <Image
                                        src={`${post?.mediaUrl}`}
                                        alt="Postcard Image"
                                        className="w-full h-auto object-cover rounded-lg"
                                        width={700}
                                        height={500}
                                        layout="responsive"
                                      />
                                    ) : (
                                      <PostIMageSkelton />
                                    )
                                  ) : post?.mediaType === 'video' ? (
                                    post?.mediaUrl ? (
                                      <video
                                        src={`${post?.mediaUrl}`}
                                        className="w-full h-auto rounded-md"
                                        controls
                                        playsInline
                                        />
                                  ) : (
                                    <PostIMageSkelton />
                                  )
                                ) : (
                                  ''
                                )}
                                <div className="relative mt-4 flex items-start justify-between">
                                  <Content
                                  content={post?.content}
                                   />
                                  <p className="absolute right-0 mt-2 text-gray-500 text-sm">
                                    {new Date(post?.createdAt as string).getDate()}
                                  </p>
                                </div>
                            </Suspense>
                        </div>
                    ))
                ) : (
                    <p>No more posts</p>
                )}
            </div>
        </section>
        
    </div>
  )
}

export default adminWithAuth(Page , true)
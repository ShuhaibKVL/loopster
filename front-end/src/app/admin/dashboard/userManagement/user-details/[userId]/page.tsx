'use client'

import adminWithAuth from '@/app/contexts/adminWithAuth'
import AvatarComponent from '@/components/cm/Avatar'
import Content from '@/components/post_components/Content'
import PostContentSkeleton from '@/components/skeltons/PostContentSkeleton'
import PostIMageSkelton from '@/components/skeltons/PostIMageSkelton'
import { IUserWithCountsAdmin } from '@/lib/utils/interfaces/IUserWIthCounts'
import userManagementService from '@/services/admin/userManagementService'
import Image from 'next/image'
import React, { Suspense, useEffect, useState } from 'react'

const Page = ({params}:{params:{userId:string}}) => {
    const [user , setUser ] = useState<IUserWithCountsAdmin | null>(null)
    const fertchUser = async() => {
        const response = await userManagementService.getUserData(params?.userId)
        if(response?.status){
            setUser(response?.user[0])
        }
    }

    useEffect(() => {
        fertchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[params])
    
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
    
        <section className='flex items-center justify-center gap-x-1 w-full mt-2'>
          <div className='space-y-1'>
            <p className='px-1 rounded-lg py-1 font-mono'>Following</p>
            <p className='text-center cursor-pointer'>{user?.counts?.followedCount || 0}</p>
          </div>
          <div className='space-y-1'>
            <p className='px-1 rounded-lg py-1 font-mono'>Followers</p>
            <p className='text-center cursor-pointer'>{user?.counts?.followersCount || 0}</p>
          </div>
        </section>

    </section>
        {/* User Posts */}
        <section>
            <h2 className='w-full p-2 text-center border rounded-lg mb-2 bg-[var(--color-bg)]'>Your Posts</h2>
            <div className='flex items-start flex-wrap justify-start rounded-sm gap-2 p-2'>
                {user && user?.posts?.length !== 0 ? (
                    user?.posts?.map((post,index) => (
                        <div key={index} className='relative mx-auto min-h-48 max-h-80 min-w-48 max-w-80 border rounded-sm bg-[var(--secondary-bg)]'>
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
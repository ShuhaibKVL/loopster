'use client'

import { IPostResponse } from '@/lib/utils/interfaces/IPost'
import postManagementService from '@/services/admin/postManagmentService'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import PostIMageSkelton from '../skeltons/PostIMageSkelton'
import Content from '../post_components/Content'

export interface ITopLikedPost{
    likeCount:number,
    postDetails:IPostResponse[]
}
export default function TopLikedPosts() {
    const [ posts ,setPosts ] = useState<ITopLikedPost[] | []>([])
    const fetchPosts = async() => {
        const posts = await postManagementService.findMostLikedPost()
        console.log('post on the basis of likes :',posts)
        if(posts?.status){
            setPosts(posts?.data)
        }
    }

    useEffect(() => {
        console.log('posts set to state : >>>>>>>>>>>>>>',posts)
    },[posts])

    useEffect(() => {
        fetchPosts()
    },[])

  return (
    <div className='w-full sm:w-1/2 h-96 border rounded-md p-4'>
        <h1 className='font-semibold space-x-2 absolute bg-[var(--secondary-bg)]'>Top Liked Posts</h1>
        <div className='w-full mt-6 flex flex-col gap-2'>
            {posts.length > 0 && (
                posts?.map((post,index) => (
                    <div key={index} className='w-full flex items-center justify-between'>
                        <div className='w-24 h-24'>
                            {post?.postDetails[0]?.mediaType === 'image' && post?.postDetails[0]?.mediaUrl !== null ? (
                                <Image 
                                width={100}
                                height={100}
                                className='w-full h-full object-cover'
                                alt='PI'
                                src={post?.postDetails[0]?.mediaUrl?.toString() as string}
                                />
                            ) : post?.postDetails[0]?.mediaType === 'video' && post?.postDetails[0]?.mediaUrl !== null ? (
                                <video src={post?.postDetails[0]?.mediaUrl?.toString() as string}/>
                            ) :(
                                <PostIMageSkelton />
                            ) }
                        </div>
                        <Content content={post?.postDetails[0]?.content} />
                        <p>{post?.likeCount}</p>
                    </div>
                ))
            )}
        </div>
    </div>
  )
}

'use client'

import { useAppSelector } from '@/hooks/typedUseDispatch'
import { RootState } from '@/lib/redux/store/store'
import postService from '@/services/user/post/postServices'
import React, { useEffect, useState } from 'react'
import { IPostProps } from '@/lib/utils/interfaces/PostProps'
import Post from '../post_components/Post'

interface ViewPostProps{
    postId:string
}

export default function ViewPost({ postId }:ViewPostProps) {
    const [post , setPost] = useState<IPostProps | null>(null)
    const userId = useAppSelector((state:RootState) => state?.user?.userId)

    const getPost =async () => {
        const response = await postService.getPost(postId,userId)
        console.log('post >>',response)
        setPost(response?.posts[0] as IPostProps)
    }

    useEffect(() => {
        getPost()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[userId,postId])

  return (
    <div className='w-full h-full'>
        {post  ? (
            <Post postData={post as IPostProps} refetchPosts={getPost}   />
        ) : (
            <p>post data not reachable...</p>
        )}
    </div>
  )
}

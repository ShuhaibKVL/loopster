'use client'

import React, { useLayoutEffect , useEffect} from 'react'
import { fetchLatestPosts } from '@/lib/redux/features/postSlice'
import { useAppDispatch } from '@/hooks/typedUseDispatch'
import { useAppSelector } from '@/hooks/typedUseDispatch'
import { RootState } from '@/lib/redux/store/store'
import PostContentContainer from '@/app/components/post_components/PostContentContainer'
import { IPostProps } from '@/app/utils/interfaces/PostProps'
import Image from 'next/image'
import adminWithAuth from '@/app/contexts/adminWithAuth'
import { useSelector } from 'react-redux'

const Page = () => {  

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchLatestPosts('670626b38c8d140884212b76'))
  })

  const { posts , error , status } = useAppSelector((state:RootState) => state?.post || { posts:[],error:null,status:'idle'})
  console.log("state :",useSelector((state:RootState) => state))
  useEffect(() => {
    console.log('Current posts:', posts);
    console.log('Current status:', status);
}, [posts, status]);
  const postData: IPostProps[] =  [...posts]
 
  return (
    <div className='w-full h-auto overflow-y-auto flex flex-col items-start justify-start gap-4p-5'>
        Post Management
        {posts.length > 0 ?
         (
          posts.map((post) => (
            <div className='w-full min-h-52 aspect-square border p-5 flex items-center justify-between gap-2 rounded-md overflow-hidden'>
              {post?.mediaType === 'image' ?
               (
                <div className='w-52 h-52'>
                  <Image
                src={`${post?.mediaUrl}`}
                alt={`${post?.user}`}
                className="h-52 w-52 aspect-square rounded-md"
                width={200}
                height={200}
                layout='responsive'
                priority
                />
                </div>
               ) : 
               (post?.mediaType === 'video' ? 
                (
                  <video
                  src={`${post?.mediaUrl}`}
                  // ref={videoRef}
                  className="w-52 h-52 rounded-md aspect-video"
                  // autoPlay
                  loop
                  muted
                  controls
                  playsInline
                  />      
                ) : (null))
              }
              <div>
                  <p dangerouslySetInnerHTML={{ __html: post?.content }}></p>
              </div> 
              <div>
                 <p>{post?.followedCount}</p>
                 <p>{post?.followersCount}</p>
                 <p>{post?.createdAt.toString()}</p>
                 <p>{post?.user?.userName}</p>
              </div>
            </div>
          ))
         ) : 
         (<p>Loading...</p>)
        }
    </div>
  )
}

export default adminWithAuth(Page , true)

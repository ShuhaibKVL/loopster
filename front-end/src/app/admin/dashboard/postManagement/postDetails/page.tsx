'use client'

import { IPostResponse } from '@/lib/utils/interfaces/IPost'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function page() {
    const searchParams = useSearchParams()
    const postId = searchParams.get('postId')
    console.log('post id inside postDetails :',postId)
    const [ post , setPost ] = useState<IPostResponse | null>(null)

    const fetchPost = async(postId:string) => {
        
    }

    useEffect(() => {
        if(!postId){
            alert('post id missing')
            return
        }
        fetchPost(postId)
    },[postId])
  return (
    <div className='p-2 w-full h-full'>
      <h1 className='font-semibold p-5'>Post detailed view</h1>
      <div className='flex border w-full h-full'>
        <div></div>
      </div>
    </div>
  )
}

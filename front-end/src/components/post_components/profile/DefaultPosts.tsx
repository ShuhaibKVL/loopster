import PostIMageSkelton from '@/components/skeltons/PostIMageSkelton'
import { IUserWithCounts } from '@/lib/utils/interfaces/IUserWIthCounts'
import Image from 'next/image'
import React, { useState } from 'react'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { IoImages } from "react-icons/io5";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { PiArticleNyTimesThin } from "react-icons/pi";
import Content from '../Content'
import Link from 'next/link'


export default function DefaultPosts({userData}:{userData:IUserWithCounts}) {
    const [type , setType ] = useState<'image' | 'video' | 'none'>('image')
  return (
    <>
    <ToggleGroup 
    type="single" 
    value={type} 
    onValueChange={(value) => {
        if (value) setType(value as 'image' | 'video' | 'none');
    }} 
    >
      <ToggleGroupItem  value="image">
        <IoImages />
      </ToggleGroupItem>
      <ToggleGroupItem value="video">
        <MdOutlineSlowMotionVideo />
      </ToggleGroupItem>
      <ToggleGroupItem value="none">
        <PiArticleNyTimesThin />
      </ToggleGroupItem>
    </ToggleGroup>

    <div className='w-full min-h-64 flex flex-wrap gap-2 items-start justify-start'>
        {userData?.posts.length !== 0 ? (
                userData?.posts.map((post) => (
                    type === 'image' ? (
                        post?.mediaType === 'image' && (
                            post?.mediaUrl ? (
                            <Link href={`/feed/notifications/view-post/${post?._id}`}>
                            <div className='relative w-16 h-16 md:w-44 md:h-44 overflow-hidden scrollbar-hide transition-transform duration-300 hover:scale-110'>
                              <Image
                                src={`${post?.mediaUrl}`}
                                alt="Postcard Image"
                                className="w-full h-full object-cover rounded-sm"
                                layout="fill"
                              />
                            </div>
                            </Link>
                            ) : (
                              <PostIMageSkelton />
                            )
                        )
                    ) : type === 'video' ? (
                        post?.mediaType === 'video' && (
                            post?.mediaUrl ? (
                            <Link href={`/feed/notifications/view-post/${post?._id}`}>
                              <div className='relative w-16 h-16 md:w-44 md:h-44 overflow-hidden transition-transform duration-300 hover:scale-110'>
                                <video
                                  src={`${post?.mediaUrl}`}
                                  className="w-full h-full object-cover rounded-md"
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                />
                              </div>
                              </Link>
                            ) : (
                              <PostIMageSkelton />
                            )
                          )
                    ) :type === 'none' ? (
                        <Link href={`/feed/notifications/view-post/${post?._id}`}>
                        <div className='relative w-full h-full md:w-60 md:h-20 overflow-hidden object-fill object-center border rounded-md'>
                            <Content content={post?.content} fonts={150} />
                        </div>
                        </Link>
                    ) :(null)
                ))
            ) : (
                <p>No more posts</p>
            )}
    </div>
    </>
  )
}

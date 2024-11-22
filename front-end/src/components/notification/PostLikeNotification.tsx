'use client'

import Image from 'next/image'
import React from 'react'
import AvatarComponent from '../cm/Avatar'
import { INotificationResponse } from '@/lib/utils/interfaces/INotification'
import Content from '../post_components/Content'
import { useNotifications } from '@/app/contexts/notificationContext'
import Link from 'next/link'

interface IPostLikeNotificationProps{
    notification:INotificationResponse
}
export default function PostLikeNotification({ notification }:IPostLikeNotificationProps) {
    const { markAsRead} = useNotifications()

  return (
    <div onClick={() => markAsRead(notification?._id.toString())} className='flex w-full items-center justify-between hover:bg-[var(--hover-card)] duration-100 rounded-md'>
        <div className={`flex items-center gap-2`}>
            <Link href={`/feed/profile/${notification?.userId?._id}`} >
            <div className='relative'>
                {notification?.isRead === false ? (
                    <div className='w-2 h-2 bg-green-600 rounded-full absolute right-0'></div>
                ) : (null)}
                <AvatarComponent imgUrl={notification?.userId?.profileImg} />
            </div>
            </Link>
            <p>
                <Link href={`/feed/profile/${notification?.userId?._id}`} >
                    {notification?.userId?.userName}
                </Link>
                {notification?.message}
            </p>
            {notification?.postId?.mediaType === 'none' && (
                <p className='text-xs '>{notification?.postId?.content?.toString()?.slice(0,15)}..</p>
            )}
        </div>
        <Link href={`/feed/notifications/view-post/${notification?.postId}`}>
        <div className='w-10 h-10'>
            {notification?.postId?.mediaType === 'image' ? (
                
                <Image
                src={notification?.postId?.mediaUrl}
                alt='Loading'
                width={100}
                height={100}
                className='w-full h-full object-cover rounded-sm'
                 />
            ) : notification?.postId?.mediaType === 'video' ? (
                <video src={notification?.postId?.mediaUrl}
                  className='w-full h-full'
                />
            ) : (
                null
            )}
        </div>
        </Link>
      </div>
  )
}

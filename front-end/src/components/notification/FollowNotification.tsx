'use client'

import React from 'react'
import { Button } from '../ui/button'
import AvatarComponent from '../cm/Avatar'
import { INotificationResponse } from '@/lib/utils/interfaces/INotification'
import Link from 'next/link'
import { useNotifications } from '@/app/contexts/notificationContext'

interface FollowNotificationProps{
    notification:INotificationResponse
}

export default function FollowNotification({ notification }:FollowNotificationProps) {
    const { markAsRead} =useNotifications()
  return (
    
    <div onClick={() => markAsRead(notification?._id.toString())} className='flex w-full items-center justify-between'>
        <div className='flex items-center gap-2'>
            <Link href={`/feed/profile/${notification?.userId?._id}`} >
            <div className='relative'>
                {notification?.isRead === false ? (
                    <div className='w-2 h-2 bg-green-600 rounded-full absolute right-0'></div>
                ) : (null)}
                <AvatarComponent imgUrl={notification?.userId?.profileImg} />
            </div>
            </Link>
            <p>
                <span className='font-semibold pr-2'>
                <Link href={`/feed/profile/${notification?.userId?._id}`} >
                    {notification?.userId?.userName}
                </Link>
                </span>
                {notification?.message}
            </p>
        </div>
        <Link href={`/feed/profile/${notification?.userId?._id}`} ><p className='text-blue-600 text-xs'>View</p></Link>
    </div>
  )
}

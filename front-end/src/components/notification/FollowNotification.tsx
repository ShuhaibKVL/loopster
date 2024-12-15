'use client'

import React from 'react'
import AvatarComponent from '../cm/Avatar'
import { INotificationResponse } from '@/lib/utils/interfaces/INotification'
import Link from 'next/link'
import { useNotifications } from '@/app/contexts/notificationContext'
import { dateToDays, dateToHours, dateToMinutes } from '@/lib/utils/convertDateDifference'

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
                <AvatarComponent imgUrl={notification?.userId?.profileImage} />
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
        {dateToDays(notification?.createdAt as Date) > 0 ? (
                <time className='text-xs'>{dateToDays(notification?.createdAt as Date)} days ago</time>
            ) : dateToHours(notification?.createdAt as Date) > 0 ? (
                <time className='text-xs'>{dateToHours(notification?.createdAt as Date)}hour ago</time>
            ) : dateToMinutes(notification?.createdAt as Date) > 0 ? (
                <time className='text-xs'>{dateToMinutes(notification?.createdAt as Date)}minutes ago</time>
            ) :(<p className='text-xs'>jus now</p>)}
    </div>
  )
}

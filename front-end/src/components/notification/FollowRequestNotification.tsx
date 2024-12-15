'use client'

import { useNotifications } from '@/app/contexts/notificationContext'
import { INotificationResponse } from '@/lib/utils/interfaces/INotification'
import React from 'react'
import AvatarComponent from '../cm/Avatar'
import { dateToDays, dateToHours, dateToMinutes } from '@/lib/utils/convertDateDifference'
import { Button } from '../ui/button'
import Link from 'next/link'
import AcceptFollowRequest from './AcceptFollowRequest'
import { ObjectId } from 'mongoose'
import CancleFollowRequest from './CancleFollowRequest'

interface FollowRequestProps{
    notification:INotificationResponse
}

export default function FollowRequestNotification({notification}:FollowRequestProps) {
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
        <div className='text-end'>
            <div className='flex items-center justify-between space-x-2'>
                <CancleFollowRequest 
                    followId={notification?.followId as ObjectId}
                    notificationId={notification?._id.toString()}
                 />
                <AcceptFollowRequest 
                    followId={notification?.followId as ObjectId}
                    notificationId={notification?._id.toString()}
                 /> 
            </div>
            {dateToDays(notification?.createdAt as Date) > 0 ? (
                <time className='text-[10px]'>{dateToDays(notification?.createdAt as Date)} days ago</time>
            ) : dateToHours(notification?.createdAt as Date) > 0 ? (
                <time className='text-[10px]'>{dateToHours(notification?.createdAt as Date)}hour ago</time>
            ) : dateToMinutes(notification?.createdAt as Date) > 0 ? (
                <time className='text-[10px]'>{dateToMinutes(notification?.createdAt as Date)}minutes ago</time>
            ) :(<p className='text-[10px]'>jus now</p>)
            }
        </div>
        
    </div>
  )
}

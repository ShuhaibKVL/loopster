'use client'

import { useNotifications } from '@/app/contexts/notificationContext'
import React, { useEffect } from 'react'
import PostLikeNotification from './PostLikeNotification'
import FollowNotification from './FollowNotification'
import { INotificationResponse } from '@/lib/utils/interfaces/INotification'

export default function Notifications() {
    const { notifications ,markAsRead }= useNotifications()
    useEffect(() => {
      console.log("notification updated :",notifications)
    },[notifications])
    
    return (
      <div className='w-full min-h-full flex flex-col gap-2 md:p-2'>
       {notifications.length > 0 ? (
        notifications?.map((item : INotificationResponse) => (
            item?.type === 'post' || item?.type === 'comment' ? (
                <PostLikeNotification notification={item}/>
            ) : (
                <FollowNotification notification={item} />
            )
        ))
       ) : (
         <p> no more notifications </p> 
       )}
      </div>
    )
}

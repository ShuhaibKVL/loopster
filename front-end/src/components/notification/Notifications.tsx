'use client'

import { useNotifications } from '@/app/contexts/notificationContext'
import React from 'react'
import PostLikeNotification from './PostLikeNotification'
import FollowNotification from './FollowNotification'
import { INotificationResponse } from '@/lib/utils/interfaces/INotification'
import FollowRequestNotification from './FollowRequestNotification'

export default function Notifications() {
    const { notifications }= useNotifications()
    
    return (
      <div className='w-full min-h-full flex flex-col gap-2 md:p-2'>
       {notifications.length > 0 ? (
        notifications?.map((item : INotificationResponse,index:number) => (
            item?.type === 'post' || item?.type === 'comment' ? (
              <PostLikeNotification key={index} notification={item}/>
            ) :item?.type === 'follow-request' ? (
              <FollowRequestNotification notification={item} />
            ) :
             (
              <FollowNotification notification={item} />
            )
        ))
       ) : (
         <p> no more notifications </p> 
       )}
      </div>
    )
}

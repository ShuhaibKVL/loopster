'use client'

import { useNotifications } from '@/app/contexts/notificationContext'
import React, { useEffect } from 'react'
import PostLikeNotification from './PostLikeNotification'
import FollowNotification from './FollowNotification'
import { INotificationResponse } from '@/lib/utils/interfaces/INotification'
import FollowRequestNotification from './FollowRequestNotification'

export default function Notifications() {
    const { notifications ,markAsRead }= useNotifications()
    
    return (
      <div className='w-full min-h-full flex flex-col gap-2 md:p-2'>
       {notifications.length > 0 ? (
        notifications?.map((item : INotificationResponse) => (
            item?.type === 'post' || item?.type === 'comment' ? (
              <PostLikeNotification notification={item}/>
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

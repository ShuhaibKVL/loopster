'use client'

import { ObjectId } from 'mongoose'
import React from 'react'
import { Button } from '../ui/button'
import followService from '@/services/folllow/followService'
import { useNotifications } from '@/app/contexts/notificationContext'

export default function CancleFollowRequest({followId,notificationId}:{followId:ObjectId,notificationId:string}) {
    const {fetchNotifications} = useNotifications()
    async function handleCancleFollowRequest() {
        if(!followId && !notificationId){
            alert('followId && !notificationId is missing')
        }
        followService.rejectFollowRequest(followId.toString(),notificationId)
        fetchNotifications()
    }
  return (
    <Button onClick={handleCancleFollowRequest} variant={'outline'} >Cancle</Button>
  )
}

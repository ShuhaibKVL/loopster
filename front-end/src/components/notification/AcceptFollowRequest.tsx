import React from 'react'
import { Button } from '../ui/button'
import { ObjectId } from 'mongoose'
import followService from '@/services/folllow/followService'
import { useNotifications } from '@/app/contexts/notificationContext'

export default function AcceptFollowRequest({followId,notificationId}:{followId:ObjectId,notificationId:string}) {
    const {fetchNotifications} = useNotifications()
    async function handleAcceptFollowRequest() {
        if(!followId && !notificationId){
            alert('followId && !notificationId is missing')
        }
        await followService.acceptFollowRequest(followId,notificationId)
        fetchNotifications()
    }

  return (
    <Button onClick={handleAcceptFollowRequest} variant={'ghost'}>Accept</Button> 
  )
}

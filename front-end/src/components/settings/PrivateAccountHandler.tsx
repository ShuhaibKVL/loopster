'use client'

import React from 'react'
import { Switch } from "@/components/ui/switch"
import { useAppDispatch, useAppSelector } from '@/hooks/typedUseDispatch'
import { RootState } from '@/lib/redux/store/store'
import userAuthService from '@/services/user/userAuthService'
import { confirmAction } from '../cm/ConfirmationModal'
import { getProfileUserData } from '@/lib/redux/features/storySlice'


export default function PrivateAccountHandler() {
    const userData = useAppSelector((state:RootState) => state?.stories?.profileUserData)
    const userId = useAppSelector((state:RootState) => state?.user?.userId)

    const dispatch = useAppDispatch()

    const isPrivate = userData?.isPrivateAccount
    console.log('is private account :',isPrivate)

    const handlePrivateAccount =async () => {
      console.log('handle private account')
        if(!userId){
            alert('userId is missing')
            return
        }
        const willProceed = await confirmAction({
          title: `Are you sure to switch account to ${isPrivate ? 'Public' : 'Private'} ?`,
          text: `${isPrivate ? 'The public account can see every user' : 'The private account can see who followed you'}`,
          icon: 'warning',
        });

        if(willProceed){
          const update = await userAuthService.updateIsPrivateAccount(userId)
          console.log('update is private account :',update)
          if(update?.status){
              dispatch(getProfileUserData(userId))
          }
        }
    }
    
  return (
    <div className='flex items-center justify-between p-3'>
        <p className='pl-3'>Private account</p>
        
        <Switch
          checked={isPrivate}
          onCheckedChange={handlePrivateAccount}
          className={`${
            isPrivate ? 'bg-blue-500' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200`}
        >
        <span
          className={`${
              isPrivate ? 'translate-x-6 bg-white' : 'translate-x-1 bg-black'
          } inline-block h-4 w-4 transform rounded-full transition-transform duration-200`}
        />
        </Switch>
        
    </div>
  )
}
 
'use client'

import React from 'react'
import { confirmAction } from '../cm/ConfirmationModal';
import { useChat } from '@/app/contexts/chatContext';

export default function DeleteFromEveryOne({messageId}:{messageId:string}) {
    const {delete_from_everyOne} = useChat()

    const handleDelete = async() => {
        const willProceed = await confirmAction({
            title: `Are you sure to delete from every one?`,
            text: `Once deleted, you are not able to return..!`,
            icon: 'warning',
        });

        if(willProceed){
            if(!messageId){
                return 
            }
            delete_from_everyOne(messageId)
        }

    }
  return (<p onClick={handleDelete} className='cursor-pointer'>Delte from Every One</p>)
}

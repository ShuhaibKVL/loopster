'use client'

import React from 'react'
import { confirmAction } from '../cm/ConfirmationModal';
import { useChat } from '@/app/contexts/chatContext';

export default function DeleteFromMe({messageId}:{messageId:string}) {
    const {delte_from_me} = useChat()

    const handleDelete = async() => {
        const willProceed = await confirmAction({
            title: `Are you sure to delete ?`,
            text: `Once deleted, you are not able to return..!`,
            icon: 'warning',
        });

        if(willProceed){
            if(!messageId){
                return 
            }
            delte_from_me(messageId)

        }

    }
  return (<p onClick={handleDelete} className='cursor-pointer'>Delte from me</p>)
}

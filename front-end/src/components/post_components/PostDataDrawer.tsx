import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { IPostResponse } from '@/lib/utils/interfaces/IPost'
import Image from 'next/image'

interface IPostDataDrawerProps{
    isOpen:boolean,
    setIsOpen:(open:boolean) => void
    postData:IPostResponse
}

export default function PostDataDrawer({isOpen,setIsOpen,postData}:IPostDataDrawerProps) {
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className='w-full'>
                <DialogHeader>
                    <DialogTitle>Review the post</DialogTitle>
                    <DialogDescription>
                    <div className='w-70 p-5 flex flex-col items-center text-md'>
                        {postData?.mediaUrl && (
                            <Image width={100} height={100} src={`${postData?.mediaUrl}`} alt="Post Image" className='w-full h-auto rounded-md mb-4' />
                        )}
                        <p className='border rounded-md p-3 w-full' dangerouslySetInnerHTML={{ __html: postData?.content }}></p>
                        <p><span className='font-semibold' >Media Type :</span>{postData?.mediaType}</p>
                        <p><span className='font-semibold' >Created at :</span>{postData?.createdAt}</p>
                        <p><span className='font-semibold' >User Id :</span>{postData?.userId}</p>
                        
                     </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    </div>
  )
}

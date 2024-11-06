'use client'

import React, { Dispatch, SetStateAction, Suspense, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import PostComments from './PostComments';
import AvatarComponent from '../Avatar';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/hooks/typedUseDispatch';
import { RootState } from '@/lib/redux/store/store';
import CommentFeedSkeleton from '../skeltons/CommentFeedSkeleton';
import { IComment } from '@/lib/utils/interfaces/IComment';
import commentService from '@/services/user/post/comment/commentService';
import Image from 'next/image';
import PostIMageSkelton from '../skeltons/PostIMageSkelton';
import CommentSection from './CommentSection';

interface IModalProps {
    isOpen : boolean,
    setIsOpen :Dispatch<SetStateAction<boolean>>;
    postId:string
    mediaUrl:string,
    mediaType:string,
    content:string,
}

export default function PostCommentModal({isOpen,setIsOpen,postId,mediaType,mediaUrl,content}:IModalProps) {

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={`${mediaType === 'none' ? 'w-[40vw]' : 'w-[70vw]'} h-[70vh] max-w-none p-0`}>
            <DialogHeader>
            <DialogTitle className='hidden'></DialogTitle>
            <DialogDescription className='h-full'>
                <div className='flex items-center h-full w-full justify-center'>
                  {/* medaiSection */}
                  <div className={`w-1/2 h-full border-r ${mediaType === 'none' ? 'hidden' : ''}`}>
                    {mediaType === 'image' ? (
                      mediaUrl ? (
                        <Image
                          src={`${mediaUrl}`}
                          alt="Postcard Image"
                          className="w-full h-auto rounded-lg"
                          width={700}
                          height={500}
                          layout="responsive"
                        />
                      ) : (
                        <PostIMageSkelton />
                      )
                    ) : mediaType === 'video' ? (
                      mediaUrl ? (
                        <video
                          src={`${mediaUrl}`}
                          className="w-full h-auto rounded-md"
                          autoPlay
                          loop
                          muted
                          controls
                          playsInline
                        />
                      ) : (
                        <PostIMageSkelton />
                      )
                    ) : (
                      ''
                    )}
                    <p
                      className="text-base p-3"
                      dangerouslySetInnerHTML={{
                          __html:content
                      }}
                    />
                  </div>
                  {/* comment section */}
                  <div className={`relative h-full flex flex-col ${mediaType === 'none' ? 'w-full' : 'w-1/2'}`}>
                     <CommentSection postId={postId} />
                  </div>
                </div>
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}

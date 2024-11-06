'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { IoMdHeartEmpty } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import Modal from './PostCommentModal';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
  } from "@/components/ui/drawer"
import AvatarComponent from '../Avatar';
import { useAppSelector } from '@/hooks/typedUseDispatch';
import { RootState } from '@/lib/redux/store/store';
import { Button } from '@/components/ui/button';
import { IoChevronBackSharp } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import CommentFeed from './CommentFeed';
import commentService from '@/services/user/post/comment/commentService';
import { IComment } from '@/lib/utils/interfaces/IComment';
import PostComments from './PostComments';
import CommentFeedSkeleton from '../skeltons/CommentFeedSkeleton';
import PostCommentModal from './PostCommentModal';
import CommentSection from './CommentSection';
import LikeHandleButton from './LikeHandleButton';
import UnlikeHandleButton from './UnlikeHandleButton';
import { InfiniteData, QueryObserverResult } from '@tanstack/react-query';
import BookMarkHandleButton from './BookMarkHandleButton';
import UnBookMarkHandleButtton from './UnBookMarkHandleButtton';

interface IPostFooterProps{
  postId:string,
  userId:string,
  isLiked:boolean,
  isBookMarked:boolean,
  postData:{
    mediaType:string,
    mediaUrl:string,
    content:string,
  },
  refetchPosts: () => Promise<QueryObserverResult<InfiniteData<{ posts: any; hasMore: boolean }>, Error>>;
}

export default function PostFooter({postId,postData,isLiked,isBookMarked,refetchPosts}:IPostFooterProps) {
    const [ isOpenDrawer , setIsOpenDrawer ] = useState<boolean>(false)
    const [ isOpenModal , setIsOpenModal ] = useState<boolean>(false)
    const [ screen , setScreen ] = useState<'small' | 'greater'>('greater')

    useEffect(() => {
      const checkScreenSize = () => {
        console.log('screen size :-',window.innerWidth)
        if(window.innerWidth <= 640){
          setScreen('small')
        }else{
          setScreen('greater')
        }
      }

      checkScreenSize()
      window.addEventListener('resize',checkScreenSize)
      return () => window.removeEventListener('resize',checkScreenSize)
    },[])

    const handleModal = () => {
      if(screen === 'greater'){
        setIsOpenModal(true)
      }if(screen === 'small'){
        setIsOpenDrawer(true)
      }
    }
    return (
      <>
        <div className='flex items-center justify-between w-full pt-1 bg-[var(--secondary-bg)] '>
            <div className='flex items-center gap-2 px-1'>
              {isLiked ? 
              (
                <UnlikeHandleButton refetchPosts={refetchPosts} postId={postId} />
              ) : 
              (
                <LikeHandleButton refetchPosts={refetchPosts} postId={postId} />
              )}
               
                <FaRegComment className='sm:w-5 sm:h-5 opacity-75' onClick={handleModal} />
            </div>
            {isBookMarked ? 
            (<UnBookMarkHandleButtton postId={postId} refetchPosts={refetchPosts}  />) : 
            (
              <BookMarkHandleButton postId={postId} refetchPosts={refetchPosts} />
            )}
            
        </div>

        {/* TO open on sm > screen size */}
        <PostCommentModal postId={postId}
        isOpen={isOpenModal} setIsOpen={setIsOpenModal}
        content={postData?.content} mediaType={postData?.mediaType}
        mediaUrl={postData?.mediaUrl}
        />

        {/* To open on < sm screens */}
        <Drawer open={isOpenDrawer} onOpenChange={setIsOpenDrawer}>
          <DrawerContent className='h-[70vh] overflow-hidden'>
            <DrawerHeader className='border-b fixed top-0'>
              <DrawerDescription className='flex items-center justify-between w-full'>
                <DrawerClose className=''>
                  <IoChevronBackSharp />
                </DrawerClose>
              </DrawerDescription>
            </DrawerHeader>
            <DrawerTitle className='hidden'>dfo</DrawerTitle>
              <CommentSection postId={postId} />
          </DrawerContent>
        </Drawer>
      </>
    )
}

'use client'

import React, { Suspense, use, useEffect, useState } from 'react'
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
import { IoChevronBackSharp } from "react-icons/io5";
import PostCommentModal from './PostCommentModal';
import CommentSection from './CommentSection';
import LikeHandleButton from './LikeHandleButton';
import UnlikeHandleButton from './UnlikeHandleButton';
import { InfiniteData, QueryObserverResult } from '@tanstack/react-query';
import BookMarkHandleButton from './BookMarkHandleButton';
import UnBookMarkHandleButtton from './UnBookMarkHandleButtton';
import likeService from '@/services/user/post/like/likeService';
import AvatarComponent from '../cm/Avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface IPostFooterProps{
  postId:string,
  userId:string,
  isLiked:boolean,
  likeCount:number,
  isBookMarked:boolean,
  postData:{
    mediaType:string,
    mediaUrl:string,
    content:string,
  },
  refetchPosts: () => Promise<void>| (() => Promise<QueryObserverResult<InfiniteData<{ posts: any; hasMore: boolean }>, Error>> );
}

interface IUserData {
  fullName:string,
  userName:string,
  profileImage:string
}

interface ILikedUsers{
  postId:string,
  userId:string,
  _id:string,
  userDetails:IUserData
}

export default function PostFooter({postId,postData,isLiked,isBookMarked,likeCount,refetchPosts}:IPostFooterProps) {
    const [ isOpenDrawer , setIsOpenDrawer ] = useState<boolean>(false)
    const [ isOpenModal , setIsOpenModal ] = useState<boolean>(false)
    const [ isOpenLikedUsersDrawer , setIsOpenLikedUsersDrawer] = useState<boolean>(false)
    const [ screen , setScreen ] = useState<'small' | 'greater'>('greater')
    const [ likedUsersData , setLikedUsersData ] = useState<ILikedUsers[] | null>(null)

    useEffect(() => {
      const checkScreenSize = () => {
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
    const likedUsers = async(postId:string) => {
       const response = await likeService.findLikedUsers(postId)
       console.log('response of liked users :',response)
       setLikedUsersData(response?.users)
    }

    const handleLikedUsers = () => {
      setIsOpenLikedUsersDrawer(!isOpenLikedUsersDrawer)
      likedUsers(postId)
    }

    useEffect(() =>{
      console.log("likedUsersData :",likedUsersData)
    },[likedUsersData])

    return (
      <>
        <div className='flex items-start justify-between w-full pt-1 bg-[var(--secondary)]'>
            <div className='flex items-start gap-2 px-1'>
              <div className=''>
              {isLiked ? 
              (
                <UnlikeHandleButton refetchPosts={refetchPosts} postId={postId} />
              ) : 
              (
                <LikeHandleButton refetchPosts={refetchPosts} postId={postId} />
              )}
              <p className='text-xs w-full text-center cursor-pointer' 
                title='show users list'
                onClick={handleLikedUsers}>
                  {likeCount !== 0 ? likeCount : null}
              </p>
              </div>
               
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

        {/* To show liked users list */}
        <Dialog open={isOpenLikedUsersDrawer} onOpenChange={setIsOpenLikedUsersDrawer}>
        <DialogContent className='h-fit p-2'>
            <DialogHeader>
            <DialogTitle className='hidden'></DialogTitle>
            <DialogDescription className='h-full space-y-2'>
                {likedUsersData && likedUsersData?.length >0 ? (
                  likedUsersData.map((user) => (
                    <div className='flex items-center gap-2 border-b hover:bg-[var(--color-bg)] duration-100'>
                    <AvatarComponent imgUrl={user?.userDetails?.profileImage} />
                    <p>{user?.userDetails?.userName}</p>
                    </div>
                  ))
                ) : (<p>no more users</p>)}
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
        </Dialog>

      </>
    )
}

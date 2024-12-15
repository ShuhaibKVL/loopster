'use client'

import React, { useEffect, useState } from 'react'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { IoIosAdd } from "react-icons/io";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from 'next/link';
import StoryCreator from './StoryCreator';
import { useAppDispatch, useAppSelector } from '@/hooks/typedUseDispatch';
import { RootState } from '@/lib/redux/store/store';
import Image from 'next/image';
import { BiSolidUserCircle } from 'react-icons/bi';
import { fetchStories } from '@/lib/redux/features/storySlice';
import TypeWriterComponent from '../Libraries/TypeWriterComponent';
import useSyncReduxFromCookie from '@/hooks/customHooks/useSyncReduxFromCookie';


export default function StoryComponent() {
  useSyncReduxFromCookie(); // Sync Redux with cookie on page load
  
  const [isOpen , setIsOpen] = useState<boolean>(false)
  const userId = useAppSelector((state:RootState) => state?.user?.userId)
  const dispatch = useAppDispatch()

  const { followedUsersStories , loggedUserStories} = useAppSelector((state:RootState) => state?.stories)

  useEffect(() => {
    if(userId){
      dispatch(fetchStories(userId))
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userId])

  return (
  <ScrollArea className="w-full whitespace-nowrap rounded-md bg-[var(--secondary-bg)]">
    <div className="flex w-max space-x-2 p-1 bg-[var(--secondary-bg)]">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
          <div className='flex flex-col items-center justify-center'>
          {loggedUserStories?.length > 0 ? (
            // If there are logged user stories, wrap with Link to navigate the story route
            <Link href={`/story-carasoll/${loggedUserStories[0]?._id}`}>
              <div
                className={`relative w-10 h-10 md:w-14 md:h-14 bg-[var(--color-bg)] 
                  flex items-center justify-center rounded-full overflow-hidden bg-gradient-to-r 
                  from-pink-600 to-blue-400 skeleton`}
              >
                <div className="w-9 h-9 md:w-12 md:h-12 bg-[var(--secondary-bg)] rounded-full absolute z-20 overflow-hidden">
                  {loggedUserStories[0]?.userId?.profileImage ? (
                    <Image
                      width={100}
                      height={100}
                      alt="Profile"
                      className="w-full h-full"
                      src={loggedUserStories[0]?.userId?.profileImage}
                    />
                  ) : (
                    <BiSolidUserCircle className="text-[var(--hover-card)] w-full h-full object-contain" />
                  )}
                </div>
              </div>
            </Link>
          ) : (
            // If no logged user stories, use onClick
            <div
              onClick={() => setIsOpen(true)}
              className={`relative w-10 h-10 md:w-14 md:h-14 bg-[var(--color-bg)] 
                flex items-center justify-center rounded-full overflow-hidden`}
            >
              <div className="w-9 h-9 md:w-12 md:h-12 bg-[var(--secondary-bg)] rounded-full absolute z-20 overflow-hidden">
                <IoIosAdd className="absolute bottom-0 right-0 w-5 h-5" />
              </div>
            </div>
          )}

          <p className='text-[10px] md:text-[12px] font-serif'>Your</p>
          </div>
          </TooltipTrigger>
          <TooltipContent>
            <TypeWriterComponent
              words='Share your notes 🙌😉'
            />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {followedUsersStories?.length > 0 && (
        followedUsersStories.map((story) => (
          <Link key={story?._id} href={`/story-carasoll/${story?._id}`}>
            <div className='flex flex-col items-center justify-center'>
            <div 
              className={`relative w-10 h-10 md:w-14 md:h-14 bg-[var(--color-bg)]
                flex items-center justify-center rounded-full overflow-hidden ${followedUsersStories?.length > 0 &&
                'bg-gradient-to-r from-pink-600 to-blue-400 skeleton'}`}
            >
              <div className='w-9 h-9 md:w-12 md:h-12 bg-[var(--secondary-bg)] rounded-full overflow-hidden '>
                  {story?.userId?.profileImage ? (
                      <Image 
                      width={100}
                      height={100}
                      alt='PR'
                      className='w-full h-full'
                      src={story?.userId?.profileImage} 
                      />
                  ) : (
                    <BiSolidUserCircle className='text-[var(--hover-card)] w-full h-full object-contain'/>
                  )}
              </div>
            </div>
              <p className='text-[10px] md:text-[12px] font-serif'>{story?.userId?.userName}</p>
            </div>
          </Link>
        ))
      )}
  </div>
     <ScrollBar orientation="horizontal"/>
     <StoryCreator isOpen={isOpen} setIsOpen={setIsOpen} />
  </ScrollArea>
  )
}

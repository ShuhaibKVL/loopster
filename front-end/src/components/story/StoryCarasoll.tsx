'use client'

import { useAppSelector } from '@/hooks/typedUseDispatch'
import { RootState } from '@/lib/redux/store/store'
import { IStoryResponse } from '@/lib/utils/interfaces/IStory'
import React from 'react'
import StoryDynamicContent from './StoryDynamicContent'

export default function StoryCarasoll({storyId}:{storyId:string}) {
  const {followedUsersStories , loggedUserStories} = useAppSelector((state:RootState) => state?.stories)
  const filteredDataLoagged : IStoryResponse[] = loggedUserStories.filter((story) => story?._id === storyId)
  const filterdDataFollowed: IStoryResponse[] = followedUsersStories.filter((story) => story?._id === storyId)
  return (
    <div className='w-full h-screen flex items-center justify-center bg-[var(--secondary-bg)]'>
     <div className='relative w-full h-full sm:w-[40vw] sm:h-[80vh] bg-[var(--secondary-bg)]'>
      {filteredDataLoagged.length > 0 ? (
          <StoryDynamicContent story={filteredDataLoagged[0]} />
      ) : (
          <StoryDynamicContent story={filterdDataFollowed[0]} />
      )} 
     </div>
    </div>
  )
}

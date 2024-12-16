'use client'

import { IStoryResponse } from '@/lib/utils/interfaces/IStory'
import React from 'react'
import AvatarComponent from '../cm/Avatar'
import TypeWriterComponent from '../Libraries/TypeWriterComponent'
import { useAppDispatch, useAppSelector } from '@/hooks/typedUseDispatch'
import { RootState } from '@/lib/redux/store/store'
import ReusableDropdown from '../cm/DropDownMenu'
import { confirmAction } from '../cm/ConfirmationModal'
import { useToast } from '@/hooks/use-toast'
import storyService from '@/services/story/storyService'
import { fetchStories } from '@/lib/redux/features/storySlice'
import { useRouter } from 'next/navigation'

interface StoryDynamicContentProps{
    story:IStoryResponse
}
export default function StoryDynamicContent({story}:StoryDynamicContentProps) {
    const userId = useAppSelector((state:RootState) => state?.user?.userId)
    const {toast } = useToast()
    const dispatch = useAppDispatch()
    const router = useRouter()


    // Handel story delete
    const handleDelete = async (storyId:string) => {
        const willProceed = await confirmAction({
            title: `Are you sure to delete ?`,
            text: `Once deleted, you are not able to return..!`,
            icon: 'warning',
        });
        if(willProceed){
            const response = await storyService.delteStory(storyId)
            if(!response?.status){
                toast({
                    title: 'Failed',
                    description: response?.message,
                    className:"toast-failed"
                })
            }
            dispatch(fetchStories(userId))
            router.back()
        }
    }
    

  return (
    <div className={`w-full h-full border rounded-md flex items-center justify-center text-center ${story?.color}`}>
            <div className='absolute left-3 top-3 flex gap-2 items-center justify-between w-full'> 
                <div className='flex items-center gap-2'>
                <a href={`/feed/profile/${story?.userId?._id}`}>
                    {story?.userId?.profileImage ? (
                         <AvatarComponent imgUrl={story?.userId?.profileImage} />
                    ) : (
                        <div className='w-5 h-5 rounded-full skeleton'></div>
                    )}    
                </a>
                <p className={`font-serif font-semibold ${story?.color.toString() === 'bg-black' && 'text-white' }`}>
                    {story?.userId?.userName ? (
                        <TypeWriterComponent
                        words={`${story?.userId?.userName} 🙌😍`}
                        cursorStyle='.'
                        typeSpeed={70}
                       />
                    ) : (
                        <span>---</span>
                    )}
                </p>
                </div>
                {/* // to delete the story if the story logined user's */}
                <div className='absolute z-10 right-2 border-white'>
                    {userId === story?.userId?._id && (
                        <ReusableDropdown
                        options={[
                            { label: 'Delete', action: () => handleDelete(story?._id) },
                        ]}
                        postId={story?._id}
                        theme={`${story?.color.toString() === 'bg-black' && 'text-white' }`}
                    />
                    )}
                </div>
            
            </div>
            <p className={`font-serif font-semibold ${story?.color.toString() === 'bg-black' && 'text-white' }`}>{story?.note}</p>
        </div>
  )
}

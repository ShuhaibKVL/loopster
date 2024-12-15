import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
  } from "@/components/ui/dialog"
import { Button } from '../ui/button';
import { colorTheme, IColorTheme, IStory} from '@/lib/utils/interfaces/IStory';
import storyService from '@/services/story/storyService';
import { useAppDispatch, useAppSelector } from '@/hooks/typedUseDispatch';
import { RootState } from '@/lib/redux/store/store';
import { fetchStories } from '@/lib/redux/features/storySlice';


interface  StoryCreatorProps{
    isOpen:boolean;
    setIsOpen:React.Dispatch<React.SetStateAction<boolean>>
}

export default function StoryCreator({isOpen,setIsOpen}:StoryCreatorProps) {
    const [ colorThemes ] = useState(colorTheme)
    const [note , setNot ] = useState<string | null>(null)
    const [ selecetedColor , setSelectedColor ] = useState<IColorTheme | null | string>(null)
    const [ error ,setError ] = useState<string | null>(null)
    const userId  = useAppSelector((state:RootState) =>  state?.user?.userId)
    const dispatch = useAppDispatch()

    const noteSubmit = async() => {
        if(!note) setError('PLease insert any note.')
        if(!selecetedColor) setError('Please choose a frame')

        try {
            const newStory : IStory = {
                color:selecetedColor as IColorTheme,
                note:note as string,
                userId:userId
            }
            const response = await storyService.create(newStory)
            console.log('response :',response)
            if(!response.status){
                setError(response?.message)
            }
            setIsOpen(false)
            dispatch(fetchStories(userId))
        } catch (error:unknown) {
            console.log(error)
            setError('Try Agian..!',)
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setError('')
        },3000)
    },[error])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
             <DialogHeader>
             <DialogDescription>
                 <div className='w-full p-5 bg-[var(--secondary-bg)] flex flex-col gap-2 items-start'>
                   <h1 className='font-semibold text-md space-y-2'>Create your note</h1>
                   <div className='h-5'>
                        <p className='text-red-500'>{error}</p>
                   </div>
                   <div className='space-y-1'>
                     <input type="text"
                      placeholder='Enter your note' 
                      className='border rounded-sm'
                      onChange={(e) => setNot(e.target.value)}
                      />
                   </div>
                   
                   <p>Select a frame</p>
                   <div className='relative w-full  flex items-center gap-2'>
                     {colorThemes.map((color,index) => (
                       <div key={index}
                       onClick={() => setSelectedColor(color)}
                        className={`w-7 h-7 rounded-lg hover:border border-green-600 ${color}`}></div>
                     ))}
                   </div>
                   <Button onClick={noteSubmit}>Post</Button>
                 </div>
             </DialogDescription>
             </DialogHeader>
         </DialogContent>
     </Dialog>
  )
}

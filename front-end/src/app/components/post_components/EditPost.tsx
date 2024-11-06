import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogOverlay,
} from "@/components/ui/dialog"
import { IPostResponse } from '@/lib/utils/interfaces/IPost'
import Form from '@/app/components/Form'
import TipTap from './TipTap'
import { Button } from '@/components/ui/button'
import { confirmAction } from '../ConfirmationModal'

interface IPostDataDrawerProps{
    isOpen:boolean,
    setIsOpen:(open:boolean) => void
    postData:IPostResponse
}

export default function EditPost({isOpen,setIsOpen,postData}:IPostDataDrawerProps) {

    const [ editedContent , setEditedContent ] = useState('')


    const editUserFields = [
        {name:'content',type:"text",label:"content",placeHolder:`${postData?.content}`, value:`${postData?.content}` },
    ]

    async function handleModalSubmit(){
        // console.log('formData :',formData)

        const willProceed = await confirmAction({
            title: `Are you sure to update ?`,
            text: `Once update, you are not able to return..!`,
            icon: 'warning',
        });
    
        if(willProceed){
            setIsOpen(false)
        }
        

        try {
            // console.log('formData :',formData)
            // await editProfileSchema.validate(formData, {abortEarly:true})
            // const updateProfile = await userAuthService.editProfile(userId,formData)
            // console.log(updateProfile)
            // if(updateProfile.status){
            //     handleEditContainer()
            //     getUserData(userId)
            //     toast({
            //         title: 'Success',
            //         description:`${userData?.fullName} data updated successfully`,
            //         className:"toast-success"
            //     })
            // }else{
            //     toast({
            //         title: 'Failed',
            //         description:`${userData?.fullName} data not updated. Try again`,
            //         className:"toast-failed"
            //     })
            // }
        } catch (error) {
            // if(error instanceof ValidationError) {
            //     const validationErrors = error.inner.map((err:any) => err.message).join(', ')
            //     console.log("validationErrors :",error,"<>",error.message)
            //     setError(error.message)
            //     return
            // }
            console.log(error)
        }
    }

    const handleContentChange = (content:string) => {
        setEditedContent(content)
    }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className='w-[90vw] lg:min-w-[50vw] p-1 sm:p-4  min-h-[50vh] h-fit max-h-[70vh] overflow-y-auto max-w-[50vw]'>
                <DialogHeader>
                    <DialogTitle className='overflow-visible'>
                        Edit Post
                    </DialogTitle>
                    <DialogDescription className='scrollbar-hidden'>
                    <p className='fixed bg-[var(--secondary-bg)] '>Only you can update the content.If you want to update the media,Please repost it.</p>
                    <div className='w-full lg:p-5 lg:flex items-center text-md'>
                        {postData?.mediaType !== 'none' ? (
                            <div className='w-full lg:w-1/2 border'>
                                {postData?.mediaType === 'image' ? 
                                (
                                    postData?.mediaUrl && (
                                        <img 
                                        src={`${postData?.mediaUrl}`} 
                                        alt="Post Image" 
                                        className='w-full h-auto rounded-md mb-4' />
                                    )
                                ) : (postData?.mediaType === 'video' ? 
                                    (
                                        <video
                                             src={`${postData?.mediaUrl}`}
                                             className="w-full h-auto rounded-md"
                                             controls
                                             playsInline
                                        />
                                    ):(null))}
                            </div>
                        ) : 
                        (null)}
                        <div className='w-full lg:w-1/2 border'>
                            <TipTap  onContentChange={handleContentChange} initialContent={postData?.content} />
                            <div className='flex items-center justify-end'>
                                <Button onClick={handleModalSubmit} >Update</Button>
                            </div>
                        </div>
                        
                     </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
            <DialogOverlay />
        </Dialog>
    </div>
  )     
}

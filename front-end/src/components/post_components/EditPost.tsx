import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogOverlay,
    DialogTitle
} from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast'
import { IPostResponse } from '@/lib/utils/interfaces/IPost'
import postService from '@/services/user/post/postServices'
import { useState } from 'react'
import { confirmAction } from '../cm/ConfirmationModal'
import TipTap from './TipTap'

interface IPostDataDrawerProps{
    isOpen:boolean,
    setIsOpen:(open:boolean) => void
    postData:IPostResponse
    getUserData:(userId:string) => void
    userId:string
}

export default function EditPost({isOpen,setIsOpen,postData,userId,getUserData}:IPostDataDrawerProps) {

    const [ editedContent , setEditedContent ] = useState('')
    const { toast } = useToast()
    const [ error , setError ] = useState<string>('')
    const editUserFields = [
        {name:'content',type:"text",label:"content",placeHolder:`${postData?.content}`, value:`${postData?.content}`},
    ]

    async function handleModalSubmit(){
       console.log('edited content :',editedContent)
       if(editedContent.length <= 0){
        setError('Content cannot be empty..!')
        return
       }
        const willProceed = await confirmAction({
            title: `Are you sure to update ?`,
            text: `Once update, you are not able to return..!`,
            icon: 'warning',
        });
    
        if(willProceed){
            console.log(typeof editedContent,editedContent)
            const update = await postService.update(editedContent,postData?._id)
            console.log('update :',update)
            if(update?.status){
                toast({
                    title: 'Success',
                    description:`Post updated successfully`,
                    className:"toast-success"
                })
                getUserData(userId)
            }else{
                toast({
                    title: 'Failed',
                    description:`Post data not updated. Try again`,
                    className:"toast-failed"
                })
                return
            }
            setIsOpen(false)
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
                    <p className='fixed bg-[var(--secondary-bg)] '>
                        Only you can update the content.If you want to update the media,Please repost it.
                    </p>
                    {error && <p className='text-red-600 text-sm'>{error}</p>}
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

'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useAppSelector } from '@/hooks/typedUseDispatch'
import { useToast } from '@/hooks/use-toast'
import { RootState } from '@/lib/redux/store/store'
import postService from '@/services/user/post/postServices'
import { ImageIcon, UploadIcon } from '@radix-ui/react-icons'
import Image from 'next/image'
import React, { useRef, useState } from 'react'
import { FaArrowUp } from "react-icons/fa6"
import { RiAiGenerate } from "react-icons/ri"
import { useSelector } from 'react-redux'
import AvatarComponent from '../cm/Avatar'
import { confirmAction } from '../cm/ConfirmationModal'
import FileRobot from '../Libraries/Filerobot'
import Unsplash from '../Libraries/Unsplash'
import './style.css'
import TipTap from './TipTap'

export default function CreatePostComponent() {
    const userProfileImg = useAppSelector((state:RootState) => state?.user?.userProfile)
    const localFileInput = useRef<HTMLInputElement | null>(null)
    const [ fileType , setFileType ]  = useState<'image' | 'video' | 'none'>('none')
    const [ prevFileUrl , setPrevFileUrl] = useState<string | null>(null)
    const [ fileBuffer , setFileBuffer ] = useState<File | null>(null)
    const [ isDisplayEditorContent , setIsDisplayEditorContent ] = useState('hidden')
    const [ editorContent , SetEditorContent ] = useState('')
    const [isOpen, setIsOpen] = useState(false);
    const [ isHiddenPrevImg ,setIsHiddenPrevImag ] = useState<'hidden' | 'block'>('hidden')
    const fileRobotRef = useRef<{ openImgEditor: () => void }>(null);
    
    const userId = useSelector((state:RootState) => state.user.userId)
    
    const { toast} = useToast()

    const invokeLocalFileInput = () => {    
        console.log('Trigger the file input ')
        if(localFileInput.current){
            localFileInput.current.value = ''
        }
        localFileInput.current?.click()
        setIsOpen(false);
    }

    const openEditorFromParent = () => {
        console.log('openEditorFromParent invoked')
        if (fileRobotRef.current) {
            fileRobotRef.current.openImgEditor()
        }
        setIsHiddenPrevImag('hidden')
    }

    const handleFileChange = async (event:React.ChangeEvent<HTMLInputElement>) => {
        console.log('local file upload handleFileChange function invoked')
        const maxVideoDuration = 120
        const maxFileSize = 20 * 1024 * 1024
        const file = event.target.files?.[0]

        if(file){

            if(file.size > maxFileSize){
                toast({
                    title: 'Over size..!',
                    description:`Please upload a file under ${maxFileSize / (1024 * 1024)}MB `,
                    className:"toast-failed"
                })
                return
            }

            const fileMimeType = file.type
            console.log('file MimeType :',fileMimeType)

            if(fileMimeType.startsWith('image/')){
                console.log('file type set to image')
                setFileType('image')
            }else if(fileMimeType.startsWith('video/')){
                console.log('file type set to video')
                const video = document.createElement('video')
                video.src = URL.createObjectURL(file)
                video.onloadedmetadata = () => {
                    const duration = video.duration
                    if(duration > maxVideoDuration){
                        toast({
                            title: 'Video duration over..!',
                            description:`Please upload a file under 1 minute. `,
                            className:"toast-failed"
                        })
                        return
                    }else{setFileType('video')}
                }
            }else{
                toast({
                    title: 'Unsupported..!',
                    description: 'File upload filed failed.',
                    className:"toast-failed"
                })
                return
            }
            const fileUrl = URL.createObjectURL(file)
            setPrevFileUrl(fileUrl)
            console.log('set display editor to block')
            setIsDisplayEditorContent('block')
            setFileBuffer(file)
            openEditorFromParent()
            setIsHiddenPrevImag('hidden')
        }else{
            toast({
                title: 'File upload Filed !!!',
                description: 'File upload filed.Try once again!',
                className:"toast-failed"
            })
            return
        }
    }

    const handleEditedImage = (editedImageFile:File,editedImageBase64:string) => {
        console.log('edited image got in parent :',editedImageFile,editedImageBase64)
        setPrevFileUrl(editedImageBase64)
        setFileBuffer(editedImageFile)
        setIsHiddenPrevImag('block')
    }

    const handleUnsplashSelectedImage = (unsplashImgFile:File,prevImageUrl:string) => {
        console.log('unsplash selected image reached on parent :',unsplashImgFile,"url",prevImageUrl)
        setFileType('image')
        setIsOpen(false)
        setPrevFileUrl(prevImageUrl)
        setFileBuffer(unsplashImgFile)
        setIsHiddenPrevImag('block')
        openEditorFromParent()
        setIsHiddenPrevImag('hidden')
    }

    const deleteFile = async() => {
        const willProceed = await confirmAction({
            title: `Are you sure to delete ?`,
            text: `Once deleted, you are not able to return..!`,
            icon: 'warning',
        });
    
        if(willProceed){
            setPrevFileUrl(null)
            setFileBuffer(null)
            setFileType('none')
            setIsHiddenPrevImag('hidden')
        }
    }

    const handleContentChange = (content:string) => {
        SetEditorContent(content)
    }
    
    async function onSubmit() {
        
        setIsDisplayEditorContent('hidden')
        if(!userId){
            toast({
                    title: 'Failed',
                    description: 'userId is missing..!',
                    className:"toast-failed"
                })
            return
        }else {
            if(editorContent === '' && fileType === 'none'){
                toast({
                    title: 'Failed',
                    description: 'Please choose any content to post',
                    className:"toast-failed"
                })
            return
            }
            
            const formData = new FormData()

            formData.append('userId',userId)
            formData.append('content',editorContent)
            formData.append('mediaType',fileType)
            formData.append('mediaUrl',fileBuffer ? fileBuffer.type : '')

            if (fileBuffer) {
                formData.append('mediaUrl', fileBuffer);
            }
            const response = await postService.createPost(formData)
            if(response.status){
                toast({
                    title: 'Success',
                    description: 'Post created successfully.',
                    className:"toast-success"
                })
                SetEditorContent('')
                setFileBuffer(null)
                setPrevFileUrl(null)
                setFileType('none')
            }else{
                toast({
                    title: 'Failed',
                    description: 'Post creation failed.',
                    className:"toast-failed"
                })
            }
        }
    }

    return (
        <div className='w-full border-2 rounded-md p-2 flex flex-col gap-2 justify-between min-h-40 h-fit'>
            <div className='w-full flex justify-between md:space-x-3'>
                <div className='hidden md:block min-w-12'>
                    <AvatarComponent 
                    imgUrl={userProfileImg}
                    />
                </div>
                <Textarea onClick={() => setIsDisplayEditorContent(isDisplayEditorContent === 'hidden' ? 'block' : 'hidden')} className={`${isDisplayEditorContent === 'hidden' ? 'block' : 'hidden'}`} />
                <div className={`${isDisplayEditorContent} w-full border-b rounded`}>
                    <TipTap onContentChange={handleContentChange} />
                    <div className={`relative w-full flex items-center justify-end`}>
                        <FileRobot
                            ref={fileRobotRef}
                            mediaUrl={prevFileUrl as string}
                            onSaveImage={handleEditedImage}
                        />
                        <div className={`${isHiddenPrevImg} relative w-full h-fit flex items-start`}>
                        {fileType === 'image' ? (
                            prevFileUrl ? (
                                <Image
                                src={prevFileUrl}
                                height={300}
                                width={500}
                                alt="Preview Image" 
                                 />
                            ) : null
                            ) : fileType === 'video' ? (
                                prevFileUrl ? (
                                    <video src={prevFileUrl} controls />
                                ) : null
                            ) : null}
                            <button
                            className='px-3 py-1 text-orange-500 text-md hover:border hover:border-orange-500 transition-colors duration-100 rounded-sm'
                            onClick={deleteFile}>
                                Discard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className='flex items-center justify-end space-x-2'>
            <FaArrowUp 
            onClick={() => setIsDisplayEditorContent(isDisplayEditorContent === 'hidden' ? 'block' : 'hidden')}
            className={`${isDisplayEditorContent === 'hidden' ? 'hidden' : 'block' } text-gray-300`}  />
            
            <div className='flex items-center gap-1 text-secondary duration-75 cursor-pointer'>
                <RiAiGenerate className=''/>
                <p className='text-sm'>Genarate Caption with AI</p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <ImageIcon className='w-6 h-6' onClick={() => setIsOpen(true)} />
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Select a file uploading method.</DialogTitle>
                    <DialogDescription>
                        <div className='w-full p-5 flex justify-around items-center'>
                            <div className='flex flex-col items-center hover:bg-[var(--color-bg)] duration-2 p-4 rounded-md'>
                            <UploadIcon
                            className='w-[2rem] h-[2rem]'
                            onClick={invokeLocalFileInput} />
                            <p>Local Device</p>
                            </div>
                            <Unsplash onSaveImage={handleUnsplashSelectedImage} />
                        </div>
                    </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            
                <input
                    type='file'
                    ref={
                        localFileInput
                    }
                    accept='image/* , video/*'
                    onChange={
                        handleFileChange
                    }
                    className='hidden'
                    title='Please select a file to upload.'
                />
                <Button disabled={!editorContent.trim() && !fileBuffer} onClick={onSubmit} className='text-white px-8 rounded-md'>Post</Button>
            </div>
        </div>
        )
}

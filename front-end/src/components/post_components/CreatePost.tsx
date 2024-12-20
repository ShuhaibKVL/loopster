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
import { useSelector } from 'react-redux'
import AvatarComponent from '../cm/Avatar'
import { confirmAction } from '../cm/ConfirmationModal'
import FileRobot from '../Libraries/Filerobot'
import Unsplash from '../Libraries/Unsplash'
import './style.css'
import TipTap from './TipTap'
import TypeWriterComponent from '../Libraries/TypeWriterComponent'
import { MdDelete } from "react-icons/md";

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
    const [loading , setLoading ] = useState(false)
    
    const userId = useSelector((state:RootState) => state?.user?.userId)
    
    const { toast} = useToast()

    const invokeLocalFileInput = () => {    
        if(localFileInput.current){
            localFileInput.current.value = ''
        }
        localFileInput.current?.click()
        setIsOpen(false);
    }

    const openEditorFromParent = () => {
        if (fileRobotRef.current) {
            fileRobotRef.current.openImgEditor()
        }
        setIsHiddenPrevImag('hidden')
    }

    const handleFileChange = async (event:React.ChangeEvent<HTMLInputElement>) => {
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

            if(fileMimeType.startsWith('image/')){
                setFileType('image')
            }else if(fileMimeType.startsWith('video/')){
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
                    }else{
                        setFileType('video')
                    }
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
            setFileBuffer(file)
            setIsDisplayEditorContent('block')
            if(fileMimeType.startsWith('image/')){
                openEditorFromParent()
                return
            }else if(fileMimeType.startsWith('video/')){
                setIsHiddenPrevImag('block')
                return
            }
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
        setPrevFileUrl(editedImageBase64)
        setFileBuffer(editedImageFile)
        setIsHiddenPrevImag('block')
    }

    const handleUnsplashSelectedImage = (unsplashImgFile:File,prevImageUrl:string) => {
        setIsOpen(false)
        setFileType('image')
        setPrevFileUrl(prevImageUrl)
        setFileBuffer(unsplashImgFile)
        setIsDisplayEditorContent('block')
        openEditorFromParent()
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
            setLoading(true)
            if(response?.status){
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
            setLoading(false)
        }
    }

    return (
        <div className='w-full border-2 rounded-md p-2 flex flex-col gap-2 justify-between min-h-40 h-fit'>
            {/* for showing loading spinner while uploading post */}
            {loading ? (
                <p className='text-center text-[var(--color-bg)]'>
                <TypeWriterComponent
                  cursorStyle='|' 
                  words='posting your post ...' 
                />haha
                <span className="loading loading-spinner loading-xs"></span>
            </p>
            ) : (null)}
            <div className='w-full flex justify-between md:space-x-3'>
                <div className='hidden md:block min-w-12'>
                    <AvatarComponent 
                    imgUrl={userProfileImg}
                    />
                </div>
                <Textarea 
                    onClick={() => setIsDisplayEditorContent(isDisplayEditorContent === 'hidden' ? 'block' : 'hidden')} 
                    className={`${isDisplayEditorContent === 'hidden' ? 'block' : 'hidden'}`} 
                />
                <div className={`${isDisplayEditorContent} w-full border-b rounded`}>
                    <TipTap 
                        onContentChange={handleContentChange} 
                    />
                    <div className={`relative w-full flex items-center justify-end`}>
                        {/* {fileType === 'image' && ( */}
                            <FileRobot
                            ref={fileRobotRef}
                            mediaUrl={prevFileUrl as string}
                            onSaveImage={handleEditedImage}
                        />
                        {/* // )} */}
                        
                        <div className={`${isHiddenPrevImg} relative w-full h-full flex items-start`}>
                        {fileType === 'image' ? (
                            prevFileUrl ? (
                                <Image
                                src={prevFileUrl}
                                height={300}
                                width={500}
                                alt="Preview Image" 
                                className='w-full h-full'
                                 />
                            ) : null
                            ) : fileType === 'video' ? (
                                prevFileUrl ? (
                                    <video className='w-full h-full object-contain ' src={prevFileUrl} controls />
                                ) : null
                            ) : null}
                            <button
                            className='px-3 py-1 text-orange-500 text-md hover:border hover:border-orange-500 transition-colors duration-100 rounded-sm'
                            onClick={deleteFile}>
                                <MdDelete />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className='flex items-center justify-end space-x-2'>
            <FaArrowUp 
            onClick={() => setIsDisplayEditorContent(isDisplayEditorContent === 'hidden' ? 'block' : 'hidden')}
            className={`${isDisplayEditorContent === 'hidden' ? 'hidden' : 'block' } text-gray-300`}  />
            
            {/* <div className='flex items-center gap-1 text-secondary duration-75 cursor-pointer'>
                <RiAiGenerate className=''/>
                <p className='text-sm'>Genarate Caption with AI</p>
            </div> */}
            {/* <EmojiPickerComponent
            message={editorContent}
            handleMessageChange={setContentByEvent}
            />    */}
            
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

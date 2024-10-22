import React from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button'
import { ImageIcon } from '@radix-ui/react-icons'
import AvatarComponent from '../Avatar'
import { useEditor ,EditorContent} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import './style.css'
import { IPost } from '@/app/utils/interfaces/IPost'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store/store'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import postService, { PostService } from '@/services/user/post/postServices'
import { useRef } from 'react'
import TinyEditor from './TinyEditor'


export default function CreatePostComponent() {
    const localFileInput = useRef<HTMLInputElement | null>(null)
    const [ fileType , setFileType ]  = useState<'image' | 'video' | 'none'>('none')
    const [ prevFileUrl , setPrevFileUrl] = useState<string | null>(null)
    const [ tainyEditorContent , setTainyEditorContent] = useState('')
    const [ isDisplayTainy , setIsDisplayTainy ] = useState('hidden')
    
    const userId = useSelector((state:RootState) => state.user.userId)
    
    const { toast} = useToast()

    const editor = useEditor({
        extensions : [
            StarterKit.configure({
                bold:false,
                italic:false
            }),
            Placeholder.configure({
                placeholder:'Post you thoughts, Reach out the connections...'
            })
        ]
    })

    const postInput = editor?.getText({
        blockSeparator:'\n',
    }) || ''

    async function onSubmit() {
        console.log("Input post :",postInput)
        console.log('userId :',userId)
        console.log("tainyEditor Content >>>",tainyEditorContent)
        if(!userId){
            toast({
                    title: 'Failed',
                    description: 'userId is missing..!',
                    className:"toast-failed"
                })
            return
        }else {
            const data : IPost = {
                userId:userId,
                content: postInput,
                mediaType:'none',
                mediaUrl:''
            }
            console.log('data :',data)
            const response = await postService.createPost(data)
            console.log('response >>>>>>>>>',response)
            if(response.status){
                editor?.commands.clearContent()
                toast({
                    title: 'Success',
                    description: 'Post created successfully.',
                    className:"toast-success"
                })
            }else{
                toast({
                    title: 'Failed',
                    description: 'Post creation failed.',
                    className:"toast-failed"
                })
            }
        }
        
    }

    const invokeLocalFileInput = () => {
        localFileInput.current?.click()
    }

    const handleFileChange = async (event:React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        console.log('local file upload ditected...',file)
        if(file){
            const fileMimeType = file.type
            if(fileMimeType.startsWith('image/')){
                setFileType('image')
            }else if(fileMimeType.startsWith('video/')){
                setFileType('video')
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
        }
    }

    const handleEditorChange = (content:string) => {
        console.log('>>> :',content)
        setTainyEditorContent(content)
    }

    return (
        <div className='w-full min-h-40 h-auto grow border-2 rounded-md p-2 flex flex-col justify-between'>
            <div className='w-full flex justify-between space-x-2 h-auto'>
                <AvatarComponent />
                
                <div className='w-full flex-grow h-auto'>
                    <Textarea onClick={() => setIsDisplayTainy(isDisplayTainy === 'hidden' ? 'block' : 'hidden')} className={`${isDisplayTainy === 'hidden' ? 'block' : 'hidden'}`} />
                    <div  className={`${isDisplayTainy} w-full grow h-auto`}>
                    <TinyEditor initialValue="Start typing here..." onEditorChange={handleEditorChange} />
                    </div>
                    
                    {/* <EditorContent
                        editor={editor}
                        className='border w-full min-h-[60px] max-h-[10rem] overflow-y-auto rounded-md pt-2 pl-2 pb-5'
                    /> */}
                </div>
                
            </div>
            <div className='flex items-center justify-end space-x-2'>
                <ImageIcon onClick={invokeLocalFileInput} className='w-6 h-6' />
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
                />
                <Button disabled={!tainyEditorContent.trim()} onClick={onSubmit} className='text-white px-8'>Post</Button>
            </div>
        </div>
        )
}

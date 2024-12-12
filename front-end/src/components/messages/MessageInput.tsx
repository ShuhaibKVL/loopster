'use client'

import React, { useRef, useState } from 'react'
import { Button } from '../ui/button'
import EmojiPicker , { EmojiClickData} from 'emoji-picker-react'
import { MdAttachFile } from "react-icons/md";
import { useChat } from '@/app/contexts/chatContext'
import Image from 'next/image'

interface IMessageInputProp{
    sendMessage:(e: React.FormEvent<HTMLFormElement>) => void;
    message:string;
    handleMessageChange:React.ChangeEventHandler<HTMLInputElement>
}

export default function MessageInput({sendMessage,message,handleMessageChange}:IMessageInputProp) {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null)

  const {handleFileChange , prevFileUrl} = useChat()

  const handleEmojiClick = (emojiData:EmojiClickData) => {

    //Append the selected emoji to the message input
    handleMessageChange({
      target:{value:message + emojiData?.emoji},} as React.ChangeEvent<HTMLInputElement>)
  }

  const onSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    setIsEmojiPickerOpen(false)
    sendMessage(e)
  }

  const invokeFileInput = () => {
    if(fileRef.current){
      fileRef.current.value = ''
    }
    fileRef.current?.click()
  }

  return (
    <form onSubmit={(e) => onSubmit(e)} className="border-t w-full h-[6%] bg-[var(--secondary)] z-10">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={message}
              onChange={handleMessageChange}
              className="flex-1 border rounded-lg px-4 py-2"
              placeholder="Type a message..."
            />

            {/* Emoji Picker Button */}
            <button
              type="button"
              onClick={() => setIsEmojiPickerOpen((prev) => !prev)}
              className="px-3 py-1"
            >
              😊
            </button>

            <input 
            type="file" 
            ref={fileRef} 
            hidden 
            onChange={handleFileChange}  
            accept='image/* , video/* , audio/* , application/*'
            title='Upload medias' 
            />
            <MdAttachFile onClick={invokeFileInput} 
            className='' />

            {/* Conditional rendering of Emoji Picker */}
            {isEmojiPickerOpen && (
              <div className="absolute bottom-16 right-2 z-50">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          
            <Button type="submit" disabled={!(prevFileUrl || message)}>
              Send
            </Button>
            
          </div>
    </form>
    
  )
}

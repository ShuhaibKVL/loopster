import EmojiPicker from 'emoji-picker-react';
// import { EmojiClickData } from 'emoji-picker-react';
import React, { useState } from 'react'

interface EmojiPickerProps{
    message:string;
    handleMessageChange:React.ChangeEventHandler<HTMLInputElement>
}

interface IEmojiClickData {
  emoji:string;
}

export default function EmojiPickerComponent({message,handleMessageChange}:EmojiPickerProps) {
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

    const handleEmojiClick = (emojiData:IEmojiClickData) => {
      //Append the selected emoji to the message input
      handleMessageChange({
        target:{value:message + emojiData?.emoji},} as React.ChangeEvent<HTMLInputElement>)
    }

  return (
    <>
    {/* Emoji Picker Button */}
    <button
    type="button"
    onClick={() => setIsEmojiPickerOpen((prev) => !prev)}
    className="border rounded-lg px-3 py-1"
  >
    😊
  </button>

  {/* Conditional rendering of Emoji Picker */}
  {isEmojiPickerOpen && (
    <div className="absolute bottom-16 right-2 z-50">
      <EmojiPicker reactionsDefaultOpen={true} onEmojiClick={handleEmojiClick} />
    </div>
  )}
  </>
  )
}

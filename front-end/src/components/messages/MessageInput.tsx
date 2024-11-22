import React from 'react'
import { Button } from '../ui/button'

interface IMessageInputProp{
    sendMessage:(e: React.FormEvent<HTMLFormElement>) => void;
    message:string;
    handleMessageChange:React.ChangeEventHandler<HTMLInputElement>
}

export default function MessageInput({sendMessage,message,handleMessageChange}:IMessageInputProp) {
  return (
    <form onSubmit={(e) => sendMessage(e)} className="border-t w-full h-[6%] bg-[var(--secondary)] z-10">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={handleMessageChange}
              className="flex-1 border rounded-lg px-4 py-2"
              placeholder="Type a message..."
            />
            {message ? (
              <Button type="submit">
                Send
              </Button>

            ) : (
              <Button type="submit" disabled>
                Send
              </Button>
            )}
            
          </div>
        </form>
  )
}

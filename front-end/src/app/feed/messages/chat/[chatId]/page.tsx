'use client'

import { useChat } from "@/app/contexts/chatContext";
import AvatarComponent from "@/components/cm/Avatar";
import MessageContainer from "@/components/messages/MessageContainer";
import MessageInput from "@/components/messages/MessageInput";
import { useAppSelector } from "@/hooks/typedUseDispatch";
import { RootState } from "@/lib/redux/store/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";

export default function ChatPage({ params }: { params: { chatId: string } }) {
    const { chatId } = params; // Access chatId from params
    const { activeChat, setActiveChat,messages,setMessages,sendMessage,chatContainerRef,message,handleMessageChange} = useChat()
    const userId = useAppSelector((state:RootState) => state?.user?.userId)
    const router = useRouter()

    useEffect(() => {
        console.log('chat id :>',chatId)
        if(!chatId){
            router.replace('/feed/messages')
        }
    },[])

    return (
     <div className="chat-container relative w-full h-screen scrollbar-hide p-1">
        <header className="fixed w-full h-[6%] border-b flex items-center gap-2 p-2 bg-[var(--secondary)] z-10">
          <IoIosArrowRoundBack className="text-gray-400" onClick={() => router.push('/feed/messages')} />
          <Link href={`/feed/profile/${activeChat?.chatId}`} >
            <AvatarComponent imgUrl={activeChat?.profileImage} />
            <h1 className='font-semibold'>{activeChat?.userName}</h1>
          </Link>
          {/* <p>{onlineUsers.length}</p> */}
        </header>
          {/* for handling the space of fixed property */}
        <div className="w-full h-[6%]"></div>

        <div className={`chatbox overflow-y-auto scrollbar-hide h-[88%] `} ref={chatContainerRef} >
        {!activeChat?.chatId && !activeChat?.groupId ? (
            <p className='w-full text-center p-2'>Select a chat to see messages</p>
        ) : (
          messages && messages?.length > 0 ? (
            <MessageContainer messages={messages} userId={userId} />
          ) : (
            null
          )
        )}
        </div>
        {/* Message Input */}
        {activeChat && (
          <MessageInput 
          message={message} 
          handleMessageChange={handleMessageChange} 
          sendMessage={sendMessage} 
        />
        )}
    </div>
    );
}
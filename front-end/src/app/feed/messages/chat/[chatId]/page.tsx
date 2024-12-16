'use client'

import { useChat } from "@/app/contexts/chatContext";
import AvatarComponent from "@/components/cm/Avatar";
import MessageContainer from "@/components/messages/MessageContainer";
import MessageInput from "@/components/messages/MessageInput";
import { useAppSelector } from "@/hooks/typedUseDispatch";
import { RootState } from "@/lib/redux/store/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { IoIosArrowRoundBack, IoMdClose } from "react-icons/io";
import withAuth from "@/app/contexts/withAuth";

const ChatPage = ({ params }: { params: { chatId: string } }) => {
    const { chatId } = params; // Access chatId from params
    const { activeChat,messages,sendMessage,chatContainerRef,message,handleMessageChange,typing,prevFileUrl,setPrevFileUrl} = useChat()
    const userId = useAppSelector((state:RootState) => state?.user?.userId)
    const router = useRouter()

    useEffect(() => {
        if(!chatId){
            router.replace('/feed/messages')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[params])

    return (
     <div className="chat-container relative w-full h-screen scrollbar-hide p-1">
        <header className="fixed w-full h-[6%] border-b flex items-center gap-2 p-2 bg-[var(--secondary)] z-10">
          <IoIosArrowRoundBack className="text-gray-400" onClick={() => router.push('/feed/messages')} />
          <Link href={`/feed/profile/${activeChat?.chatId}`} >
            <AvatarComponent imgUrl={activeChat?.profileImage} />
          </Link>
          <h1 className='font-semibold'>{activeChat?.userName}</h1>
        </header>
          {/* for handling the space of fixed property */}
        <div className="w-full h-[6%]"></div>

        <div className={`relative chatbox overflow-y-auto scrollbar-hide h-[88%] `} ref={chatContainerRef} >
          
        {/* ----------- to show the prev image if user select a file ----------  */}
        {prevFileUrl ? (
          <>
          <Image
            src={prevFileUrl}
            className='w-full h-[95%] absolute'
            width={100}
            height={100}
            objectFit='fill'
            alt='prev'
          />
          <IoMdClose 
            onClick={() => setPrevFileUrl(null)}
            className='w-7 h-7 absolute bottom-0 left-2 ' 
            title='remove the selected image'
          />
          </>
        ) : !activeChat?.chatId && !activeChat?.groupId ? (
          <p className='w-full text-center p-2'>Select a chat to see messages</p>
        ) : (
          messages && messages?.length > 0 ? (
            <MessageContainer messages={messages} userId={userId} typing={typing} />
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

export default withAuth(ChatPage,true)
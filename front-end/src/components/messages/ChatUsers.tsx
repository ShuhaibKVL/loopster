'use client'

import React from 'react'
import AvatarComponent from '../cm/Avatar'
import { activeChat } from './ChatLayout';
import { ISearchUsers } from '@/lib/utils/interfaces/ISeacrchUsers';
import { IChatResponse } from '@/lib/utils/interfaces/IChat';
import { useAppSelector } from '@/hooks/typedUseDispatch';
import { RootState } from '@/lib/redux/store/store';
import { useRouter } from 'next/navigation';
import { useChat } from '@/app/contexts/chatContext';

export interface IChatUsersList extends IChatResponse{
    isOnline?:boolean
}

interface ChatUserProps{
    chatList:IChatUsersList[];
    setActiveChat:React.Dispatch<React.SetStateAction<activeChat | null>>
    setPrevFileUrl:React.Dispatch<React.SetStateAction<string | null>>
}
export default function ChatUsers({chatList,setActiveChat,setPrevFileUrl}:ChatUserProps) {
    const currentUserId = useAppSelector((state:RootState) => state?.user?.userId)
    const unReadMsgPerChat = useAppSelector((state:RootState) => state?.user?.unReadMsgPerChat)

    const { onlineUsers} = useChat()

    const router = useRouter()

  const onSelect = (
    chatId:string,
    chatType:'individual' | 'group',
    profileImage:string,
    userName:string,
    groupImage?:string,
    groupName?:string
  ) => {

    if(!chatId) 
      return alert('user id is missing!!!')
    console.log('chatType >>>>>>>',chatType)
    let data :activeChat ;
    if(groupName){
      data  = {
        chatType:chatType,
        chatId:chatId,
        profileImage:groupImage,
        userName:groupName
     }
    }else{
      data  = {
        chatType:chatType,
        chatId:chatId,
        profileImage:profileImage,
        userName:userName
 
     }
    }

    setActiveChat(data)
    setPrevFileUrl(null)
    if(window.innerWidth <= 789){
      router.push(`/feed/messages/chat/${chatId}`)
    }
    
  }
  return (
    <>
      {chatList && chatList.length > 0 ? (
        chatList.map((chat) => {
          const isGroupChat = chat.isGroupChat;
          const otherUser = !isGroupChat
            ? chat.users.find((user) => user._id !== currentUserId)
            : null;

          return (
            <div
              key={chat._id}
              onClick={() => 
                onSelect(
                    chat._id,
                    isGroupChat ? 'group' : 'individual',
                    otherUser?.profileImage as string ,
                    otherUser?.userName as string,
                    chat?.groupImage,
                    chat?.chatName,
                    )
                }
              className='border-b p-2 hover:bg-[var(--hover-card)] duration-100 relative'
            >
              <div className='flex items-center space-x-2'>
                <div className={`${onlineUsers.includes(otherUser?._id as string) && 'border border-green-500'} rounded-full`}>
                  <AvatarComponent imgUrl={isGroupChat ? chat.groupImage : otherUser?.profileImage} />
                </div>
                
                <div>
                  <h1 className='font-semibold'>
                    {isGroupChat ? chat.chatName : otherUser?.userName}
                  </h1>
                  <p className='text-xs'>{chat?.latestMessage?.content.slice(0,15)}</p>
                </div>
              </div>
              
              {unReadMsgPerChat?.map((item) => {
                if(item._id.toString() === chat?._id){
                  return (
                    <div className='p-1 bg-green-500 rounded-full flex items-center justify-center text-white absolute right-2 top-1 size-5'>
                      <p className='text-[8px] text-white'>{item?.unReadMsg}</p>
                    </div>
                  )
                }
              })}
            </div>
          );
        })
      ) : (
        <p className='w-full text-center font-thin text-[var(--color-bg)]'>No chat history</p>
      )}
    </>
  );
}
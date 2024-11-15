import React from 'react'
import AvatarComponent from '../cm/Avatar'
import { activeChat } from './ChatLayout';
import { ISearchUsers } from '@/lib/utils/interfaces/ISeacrchUsers';
import { IChatResponse } from '@/lib/utils/interfaces/IChat';
import { useAppSelector } from '@/hooks/typedUseDispatch';
import { RootState } from '@/lib/redux/store/store';

export interface IChatUsersList extends IChatResponse{
    isOnline?:boolean
}

interface ChatUserProps{
    chatList:IChatUsersList[];
    setActiveChat:React.Dispatch<React.SetStateAction<activeChat | null>>
}
export default function ChatUsers({chatList,setActiveChat}:ChatUserProps) {
    const currentUserId = useAppSelector((state:RootState) => state?.user?.userId)

  const onSelect = (chatId:string,chatType:'individual' | 'group',profileImage:string,userName:string) => {
    
    if(!chatId) 
      return alert('user id is missing!!!')

    const data :activeChat = {
       chatType:'individual',
       chatId:chatId,
       profileImage:profileImage,
       userName:userName

    }

    setActiveChat(data)
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
                    otherUser?.userName as string
                    )
                }
              className='border-b p-2 hover:bg-[var(--hover-card)] duration-100'
            >
              <div className='flex items-center space-x-2'>
                <AvatarComponent imgUrl={isGroupChat ? chat.groupImage : otherUser?.profileImage} />
                <h1 className='font-semibold'>
                  {isGroupChat ? chat.chatName : otherUser?.userName}
                </h1>
              </div>
              <p className='text-green-400 w-full text-center'>
                {chat.isOnline ? 'Online' : ''}
              </p>
            </div>
          );
        })
      ) : (
        <p className='w-full text-center font-thin text-[var(--color-bg)]'>No chat history</p>
      )}
    </>
  );
}
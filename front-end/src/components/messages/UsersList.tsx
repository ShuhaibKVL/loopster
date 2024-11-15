import React from 'react'
import AvatarComponent from '../cm/Avatar'
import { activeChat } from './ChatLayout';
import { ISearchUsers } from '@/lib/utils/interfaces/ISeacrchUsers';

interface IUserList extends ISearchUsers{
    isOnline?:boolean
}

interface ChatUserProps{
    userList:IUserList[];
    setActiveChat:React.Dispatch<React.SetStateAction<activeChat | null>>
    setSearcchInput:React.Dispatch<React.SetStateAction<string>>
    currentUserId:string,
    fetchAllChats:(currentuserId:string) => void
}
export default function UsersList({userList,setActiveChat,setSearcchInput,fetchAllChats,currentUserId}:ChatUserProps) {

  const onClick = (userId:string) => {
    
    if(!userId) 
      return alert('user id is missing!!!')

    const data :activeChat = {
       recipientId:userId,
       chatType:'individual',
    }
    setActiveChat(data)
    setSearcchInput('')
    fetchAllChats(currentUserId)
  }

  return (
      <>
      {userList && userList.length > 0 ? (
          (userList).map((user) => (
            <div key={user?._id} onClick={() => onClick(user?._id)} className='border-b p-2 hover:bg-[var(--hover-card)] duration-100'>
              <div className='flex items-center space-x-2'>
                <AvatarComponent imgUrl={user?.profileImage} />
                <h1 className='font-semibold'>{user?.userName}</h1>
              </div>
              <p className='text-green-400 w-full text-center'>{user?.isOnline ? 'Online' : ''}</p>
            </div>
          ))
      ) : (
        <p className='w-full text-center font-thin text-[var(--color-bg)]'>No chat history</p>
      )}
    </>
  )
}
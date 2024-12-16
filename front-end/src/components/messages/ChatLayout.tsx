'use client'

import React, { useContext, useEffect, useState } from 'react'
import AvatarComponent from '../cm/Avatar'
import UsersList from './UsersList'
import { useAppDispatch, useAppSelector } from '@/hooks/typedUseDispatch'
import { RootState } from '@/lib/redux/store/store'
import SearchInput from '../cm/SearchInput'
import { ISearchUsers } from '@/lib/utils/interfaces/ISeacrchUsers'
import userAuthService from '@/services/user/userAuthService'
import chatService from '@/services/user/chat/chatService'
import { IChat } from '@/lib/utils/interfaces/IChat'
import ChatUsers, { IChatUsersList } from './ChatUsers'
import { useToast } from '@/hooks/use-toast'
import messageService from '@/services/user/messages/messageService'
import MessageContainer from './MessageContainer'
import { MdGroupAdd } from "react-icons/md";
import { SocketContext } from '@/app/contexts/socketContext'
import CreateGroup from './CreateGroup'
import MessageInput from './MessageInput'
import { updateUnReadMsgPerChat } from '@/lib/redux/features/auth/userSlice'
import { useChat } from '@/app/contexts/chatContext'
import Image from 'next/image'
import { IoMdClose } from "react-icons/io";
import { FaFilePdf } from 'react-icons/fa'


export interface activeChat{
    recipientId?:string,
    chatType:'individual' | 'group',
    groupId?:string[]
    chatId?:string,
    profileImage?:string,
    userName?:string,
    chatName?:string
}

export interface ISelectedGroupUser{
  userName:string,
  userId:string
}

export default function ChatLayout() {
    const [userListBySearch , setUserListBySearch] = useState<ISearchUsers[]>([])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [userListByGroupSearch , setUserListByGroupSearch] = useState<ISearchUsers[]>([])
    const [userList , setUserList] = useState<IChatUsersList[]>([])
    const userId = useAppSelector((state:RootState) => state?.user?.userId)
    const [ searchInput , setSearchInput ] = useState<string>('')
    const [ isOpenCreateGroup , setIsOpenCreateGroup] = useState<boolean>(false)
    const { toast} = useToast()
    const dispatch = useAppDispatch()
    
    const { activeChat, setActiveChat,
            messages,setMessages , 
            message , sendMessage,
            handleMessageChange,
            chatContainerRef 
            ,typing,onlineUsers,
            prevFileUrl,
            setPrevFileUrl,
            fileType,
            fileName
          } = useChat()
 
    const socket = useContext(SocketContext);
 
    const SearchUsers =async(qeury:string,type:'group' | 'individual') => {
      const response = await userAuthService.search_followed_users(userId,qeury)
      if(type === 'group'){
        setUserListByGroupSearch(response?.users)
      }else{
        setUserListBySearch(response?.users)
      }
    }

    const fetchAllChats = async (currentUserId:string) => {
        const response = await chatService.fetchALlChats(currentUserId)
        setUserList(response?.chats)
        dispatch(updateUnReadMsgPerChat(response?.unReadMsgPerChat))
    }

    const fetchMessages = async(chatId:string) => {
      const response = await messageService.findMessages(chatId)
      setMessages(response?.chats)
    }

  const creatChat = async() => {
    if(activeChat?.chatType === 'individual' && activeChat?.recipientId){
      const newChat : IChat = {
        isGroupChat:false,
        users:[userId,activeChat?.recipientId as string],
      }
      await chatService.create(newChat)
    }else if(activeChat?.chatType === 'group' && activeChat.chatId === ''){
      if(activeChat?.groupId && activeChat?.groupId?.length < 2 ){
        toast({
          title:'Failed',
          description:'Failed to get group users id',
          className:'toast-failed'
        })
        return
      }
      const newGroupChat : IChat = {
        isGroupChat:true,
        groupAdmin:userId,
        chatName:activeChat?.chatName,
        users:activeChat?.groupId as string[]
      }

      const createNewChat = await chatService.create(newGroupChat)
      if(createNewChat?.status){
        toast({
          title:'Success',
          description:'grop created success',
          className:'toast-success'
        })
      }else{
        toast({
          title:'Failed',
          description:'Failed to get group users id',
          className:'toast-failed'
        })
      }
      setIsOpenCreateGroup(false)
    }
    // if chat is existed, fetch the messages
    if(activeChat?.chatId){
      fetchMessages(activeChat?.chatId as string)
      markMsgAsReaded()
    } 
  }

  
  const markMsgAsReaded = () => {
    const extractMsgIds = messages.map((message) => message?._id)
    socket.emit('markmessagesAsReaded',{
      extractMsgIds,
      userId:userId
    })
  }

  useEffect(() =>{
    fetchAllChats(userId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userId])


  useEffect(() => {
    if(searchInput !== ''){
      SearchUsers(searchInput,'individual')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[searchInput])

  useEffect(() => {
    if(activeChat){
      creatChat()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[activeChat])

  return (
    <div className="relative flex items-start justify-center h-full">
      {/* users / chatList container */}
     <div className="relative w-full md:w-2/4 min-h-full border-r">
        {/* -------------- serch form ------------- */}
        <div className='w-full min-h-14 bg-[var(--secondary-bg)] flex items-center justify-center p-2 gap-1'>
            <SearchInput onInputChange={setSearchInput}/>
            {/* to create group */}
            <div className='w-10 h-10 border flex items-center justify-center rounded-md'>
            <MdGroupAdd  
              onClick={() => setIsOpenCreateGroup(!isOpenCreateGroup)}
              className='text-secondary w-6 h-6'
              title='create a group chat'
            />
            </div>
            
        </div>
        {/* ---- for keep the remain content from fixed search component ------
        <div className='w-full min-h-14'></div> */}
        {searchInput.length > 0 ? (
          <UsersList 
          userList={userListBySearch}  
          setActiveChat={setActiveChat}
          currentUserId={userId}
          fetchAllChats={fetchAllChats}
          setSearcchInput={setSearchInput}
        />
        ):(
          <ChatUsers 
            chatList={userList} 
            setActiveChat={setActiveChat}
            setPrevFileUrl={setPrevFileUrl}
          />
        )}

         {/* create group chat modal */}
         <CreateGroup 
         isOpenCreateGroup={isOpenCreateGroup}
         setActiveChat={setActiveChat}
         setIsOpenCreateGroup={setIsOpenCreateGroup}
         />
        
     </div>
        {/* message display section in big sreeen md > */}
     <div className="chat-container relative w-full h-full scrollbar-hide hidden md:block">
      <header className="fixed w-full h-[6%] border-b bg-[var(--secondary)] z-10">
        <div className=' flex items-center gap-2 p-2'>
        <AvatarComponent imgUrl={activeChat?.profileImage} />
        <h1 className='font-semibold'>{activeChat?.userName}</h1>
        </div>
        <p>{onlineUsers.includes(activeChat?.recipientId as string) && 'online'}</p>
      </header>
        {/* for handling the space of fixed property */}
      <div className="w-full h-[6%]"></div>

      <div className={`relative chatbox overflow-y-auto scrollbar-hide h-[88%] `} ref={chatContainerRef} >
        
        {/* ----------- to show the prev image if user select a file ----------  */}
        {prevFileUrl ? (
          <>
          {fileType === 'image' ? (
              <Image
              src={prevFileUrl}
              className='w-full h-[95%] absolute'
              width={100}
              height={100}
              objectFit='fill'
              alt='prev'
            />
          ) : fileType === 'video' ? (
            <video
              src={`${prevFileUrl}`}
              className="w-full h-[95%] rounded-md"
              controls
              playsInline
            />
          ) : fileType === 'audio' ? (
            <audio controls className='absolute bottom-10 left-5'>  
              <source src={prevFileUrl} type="audio/mp3"/>
            </audio>
          ) : fileType === 'application' ? (
            <div className="min-w-[50%] flex items-center justify-between space-x-2 px-3 h-8 rounded border absolute left-5 bottom-10 bg-[var(--color-bg)]">
               <FaFilePdf />
              <a href={prevFileUrl} >{fileName}</a>
            </div>
          ) : null}
          
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
    </div>
  )
}

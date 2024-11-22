'use client'

import React, { act, useContext, useEffect, useRef, useState } from 'react'
import AvatarComponent from '../cm/Avatar'
import UsersList from './UsersList'
import { useAppDispatch, useAppSelector } from '@/hooks/typedUseDispatch'
import { RootState } from '@/lib/redux/store/store'
import SearchInput from '../cm/SearchInput'
import { Button } from '../ui/button'
import { ISearchUsers } from '@/lib/utils/interfaces/ISeacrchUsers'
import userAuthService from '@/services/user/userAuthService'
import chatService from '@/services/user/chat/chatService'
import { IChat } from '@/lib/utils/interfaces/IChat'
import ChatUsers, { IChatUsersList } from './ChatUsers'
import { useToast } from '@/hooks/use-toast'
import messageService from '@/services/user/messages/messageService'
import { IMessageResponse } from '@/lib/utils/interfaces/iMessages'
import MessageContainer from './MessageContainer'
import { MdGroupAdd } from "react-icons/md";
import { SocketContext } from '@/app/contexts/SocketContext'
import CreateGroup from './CreateGroup'
import MessageInput from './MessageInput'
import { updateTotalUnReadMsg, updateUnReadMsgPerChat } from '@/lib/redux/features/auth/userSlice'
import { useChat } from '@/app/contexts/chatContext'

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
    const [userListByGroupSearch , setUserListByGroupSearch] = useState<ISearchUsers[]>([])
    const [userList , setUserList] = useState<IChatUsersList[]>([])
    const userId = useAppSelector((state:RootState) => state?.user?.userId)
    const [ searchInput , setSearchInput ] = useState<string>('')
    const [ isOpenCreateGroup , setIsOpenCreateGroup] = useState<boolean>(false)
    const { toast} = useToast()
    const dispatch = useAppDispatch()

    const { activeChat, setActiveChat,messages,setMessages , message , sendMessage,handleMessageChange,chatContainerRef} = useChat()
 
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
        console.log('alll chats :',response)
        dispatch(updateUnReadMsgPerChat(response?.unReadMsgPerChat))
    }

    const fetchMessages = async(chatId:string) => {
      const response = await messageService.findMessages(chatId)
      console.log('messages :',response)
      setMessages(response?.chats)
    }

  const creatChat = async() => {
    console.log('create chat invoked :>',activeChat)
    if(activeChat?.chatType === 'individual' && activeChat?.recipientId){
      console.log('it is a individual chat')
      const newChat : IChat = {
        isGroupChat:false,
        users:[userId,activeChat?.recipientId as string],
      }
      const createNewChat = await chatService.create(newChat)
      console.log('created new individual Chat :',createNewChat)
    }else if(activeChat?.chatType === 'group' && activeChat.chatId === ''){
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",activeChat)
      if(activeChat?.groupId?.length < 2 ){
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
      console.log('created new groupChat Chat :',createNewChat)
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
      console.log('fetch messages :',activeChat?.chatId)
      fetchMessages(activeChat?.chatId as string)
      markMsgAsReaded()
    } 
  }

  const markMsgAsReaded = () => {
    const extractMsgIds = messages.map((message) => message?._id)
    console.log('message id s :',extractMsgIds)
    socket.emit('markmessagesAsReaded',{
      extractMsgIds,
      userId:userId
    })
  }

  useEffect(() =>{
    fetchAllChats(userId)
  },[userId])


  useEffect(() => {
    if(searchInput !== ''){
      SearchUsers(searchInput,'individual')
    }
  },[searchInput])

  useEffect(() => {
    console.log('active chat :',activeChat)
    if(activeChat){
      creatChat()
    }
  },[activeChat])

  return (
    <div className="relative flex items-start justify-center h-full">
      {/* users / chatList container */}
     <div className="relative w-full md:w-2/4 min-h-full border-r">
        {/* -------------- serch form ------------- */}
        <div className='w-full min-h-14 bg-[var(--secondary-bg)] flex items-center justify-center p-2'>
            <SearchInput onInputChange={setSearchInput}/>
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
          <ChatUsers chatList={userList} setActiveChat={setActiveChat}/>
        )}

        <MdGroupAdd  
        onClick={() => setIsOpenCreateGroup(!isOpenCreateGroup)}
        className='text-secondary absolute bottom-2 right-2 w-6 h-6 rounded-lg shadow-md'
        title='create a group chat'
        />
         {/* create group chat modal */}
         <CreateGroup 
         isOpenCreateGroup={isOpenCreateGroup}
         setActiveChat={setActiveChat}
         setIsOpenCreateGroup={setIsOpenCreateGroup}
         />
        
     </div>
        {/* message display section in big sreeen md > */}
     <div className="chat-container relative w-full h-full scrollbar-hide hidden md:block">
      <header className="fixed w-full h-[6%] border-b flex items-center gap-2 p-2 bg-[var(--secondary)] z-10">
        <AvatarComponent imgUrl={activeChat?.profileImage} />
        <h1 className='font-semibold'>{activeChat?.userName}</h1>
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
    </div>
  )
}

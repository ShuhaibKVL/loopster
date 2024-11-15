'use client'

import React, { useEffect, useRef, useState } from 'react'
import AvatarComponent from '../cm/Avatar'
import UsersList from './UsersList'
import io from 'socket.io-client'
import { useAppSelector } from '@/hooks/typedUseDispatch'
import { RootState } from '@/lib/redux/store/store'
import { IUserData } from '../post_components/Post'
import SearchInput from '../cm/SearchInput'
import { Button } from '../ui/button'
import useSearchUsers from '@/hooks/customHooks/useSearchUsers'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CiCircleRemove } from "react-icons/ci";

const socket = io('http://localhost:5000')

export interface activeChat{
    recipientId?:string,
    chatType:'individual' | 'grounp',
    groupId?:string
    chatId?:string,
    profileImage?:string,
    userName?:string
}

export interface ISelectedGroupUser{
  userName:string,
  userId:string
}

export default function ChatLayout() {
    const chatContainerRef = useRef<HTMLDivElement>(null)
    const [ activeChat , setActiveChat ] = useState<activeChat | null >(null)
    const [userListBySearch , setUserListBySearch] = useState<ISearchUsers[]>([])
    const [userListByGroupSearch , setUserListByGroupSearch] = useState<ISearchUsers[]>([])
    const [userList , setUserList] = useState<IChatUsersList[]>([])
    const [ message , setMessage ] = useState('')
    const [ messages , setMessages] = useState<IMessageResponse[] | null>(null)
    const userId = useAppSelector((state:RootState) => state?.user?.userId)
    const userName = useAppSelector((state:RootState) => state?.user?.user)
    const [ searchInput , setSearchInput ] = useState<string>('')
    const [ groupSearchInput , setGroupSearchInput ] = useState<string>('')
    const [ isOpenCreateGroup , setIsOpenCreateGroup] = useState<boolean>(false)
    const [ groupUsers , setGroupUsers] = useState<ISelectedGroupUser[] | [] >([])
    const { toast} = useToast()
    
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
    }

    const fetchMessages = async(chatId:string) => {
      const response = await messageService.findMessages(chatId)
      setMessages(response?.chats)
    }

    const handleMessageChange = (e) => {
      setMessage(e.target.value);
    };

    // Function to handle receiving a new message in real-time
    useEffect(() => {
      socket.emit('joinIndividualChat', userId);
      // Listen for receiveMessage event
      socket.on('receiveMessage', (data) => {
          // Only update if the message belongs to the active chat
          console.log('>>>>>>>>>>>>>>>>>>>>>>>>')
          console.log('Message received:', data);
          console.log('Expected chatId:', activeChat,activeChat?.chatId);
          // if (data.chatId === activeChat?.chatId) {
            console.log('<<<<<<<<<<<<<<<<<<<<')
              setMessages((prevMessages) => [...prevMessages, data.message]);
          // }
      });

      // Cleanup listener on component unmount
      return () => {
          socket.off('receiveMessage');
      };
  },[setMessages]);

  const creatChat = async() => {
    const newChat : IChat = {
      isGroupChat:false,
      users:[userId,activeChat?.recipientId as string],
    }
    if(!activeChat?.chatId && !activeChat?.groupId){
      const createNewChat = await chatService.create(newChat)
      console.log('created new Chat :',createNewChat)
    }
    fetchMessages(activeChat?.chatId as string)     
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
    if(groupSearchInput !== ''){
      SearchUsers(groupSearchInput,'group')
    }
  },[groupSearchInput])

  useEffect(() => {
    console.log('active chat :',activeChat)
    if(activeChat){
      creatChat()
    }
  },[activeChat])

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      // chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;  // for intantly scroll and scroll is not visible
      chatContainerRef.current.scrollTo({ // for scroll animationally and user can see the scroll while open it
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
    });      
    }
  };
  useEffect(() => {
    // Scroll to bottom when component mounts or new message is added
    scrollToBottom();
  }, [messages]);


    // const joinChat = (userId:string) => {
    //   console.log('join chat invoked..')
    //     socket.emit('joinIndividualChat', userId);
    
    //     socket.on('receiveMessage', (data) => {
    //       setMessages(prev => [...prev, data.message]);
    //     });

    //     return () => {
    //       socket.off('receiveMessage');
    //     };
    // }

  const sendMessage = (e) => {
      e.preventDefault()
      console.log('sendMessage invoked :',message,"<>",activeChat,"<>",message.trim())
      if (!message.trim() || !activeChat){
          toast({
            title: 'caution',
            description:`Your message is empty.`,
            className:"toast-failed"
        })
          return;
      } 

      if(activeChat.chatType === 'individual'){
          socket.emit('sendIndividualMessage',{
              senderId:userId,
              senderName:userName,
              chatId:activeChat?.chatId,
              content:message
          })
      }else{
          socket.emit('sendGroupMessage',{
              senderId:userId,
              senderName:userName,
              receiverId:activeChat?.groupId,
              content:message
            })
        }
        setMessage('')
  }

  // const joinGroup = (groupId : string) => {
  //     socket.emit('joinGroupChat',groupId)
  //     setActiveChat({chatType:'grounp',groupId})
  // }

  const createGroup = () => {
      if(groupUsers.length >= 2){
        toast({
          title: 'Failed',
          description:`Please choode at least two users`,
          className:"toast-failed"
      })
      return
      }
  }

  const addUser = (userId:string,userName:string) => {
    const newuser:ISelectedGroupUser = {
      userId:userId,
      userName:userName
    }
    // Check if the user already exists in the groupUsers state
    setGroupUsers((prevUsers) => {
      const userExists = prevUsers.some((user) => user.userId === userId);
      if (!userExists) {
        return [...prevUsers, newuser]; // Add newUser if it doesn't exist
      }
      return prevUsers; // Return the previous state if user already exists
    });
  }

  const removeGroupUser = (userId:string) => {
    const filter = groupUsers.filter((user) => user?.userId !== userId)
    setGroupUsers(filter)
  }

  return (
    <div className="relative flex items-start justify-center h-full">
     <div className="relative w-2/4 min-h-full border-r">
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
        <Dialog open={isOpenCreateGroup} onOpenChange={setIsOpenCreateGroup}>
        <DialogContent className='min-h-64 p-2 w-[40vw]'>
            <DialogHeader>
            <DialogTitle className='hidden'>Create Group</DialogTitle>
            <DialogDescription className='h-full space-y-2'>
                <h1 className='w-full text-center font-semibold'>Create Group</h1>
                <p className='w-full text-center font-thin'>Select the users you want to create group</p>
                <div className='w-full min-h-14 bg-[var(--secondary-bg)] flex items-center justify-center p-2'>
                  <SearchInput onInputChange={setGroupSearchInput}/>
                </div>

                <div className='w-full p-2 flex flex-wrap gap-2'>
                  {groupUsers && groupUsers.length > 0 && groupUsers.map((user) => (
                    <div className='relative flex gap-0 items-center justify-center p-3 bg-green-100 rounded-md'>
                      <p>{user?.userName}</p>
                      <CiCircleRemove
                      onClick={() => removeGroupUser(user?.userId)}
                       className='absolute top-0 right-0 text-red-500 w-4 h-4' />
                    </div>
                  ))}
                </div>

                <div className='w-full h-auto overflow-y-auto scrollbar-hide'>
                {userListByGroupSearch.length > 0 ? (
                  userListByGroupSearch.map((user) => (
                    <div key={user?._id} onClick={() => addUser(user?._id,user?.userName)} 
                    className='border-b p-2 hover:bg-[var(--hover-card)] duration-100'>
                      <div className='flex items-center space-x-2'>
                        <AvatarComponent imgUrl={user?.profileImage} />
                        <h1 className='font-semibold'>{user?.userName}</h1>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className='w-full text-center p-2'></p>
                )} 
                </div>
                <div className='w-full flex items-center justify-end'>
                  <Button className={`${groupUsers.length == 0 ? 'disabled' : ''} disabled`} onSubmit={createGroup}>Create</Button>
                </div>
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
        </Dialog>

     </div>

     <div className="chat-container relative w-full h-full scrollbar-hide">
      <header className="fixed w-full h-14 border-b flex items-center gap-2 p-2 bg-[var(--secondary)] z-10">
        <AvatarComponent imgUrl={activeChat?.profileImage} />
        <h1 className='font-semibold'>{activeChat?.userName}</h1>
        {/* <p>{onlineUsers.length}</p> */}
      </header>

      <div className="w-full h-14"></div>

      <div className={`chatbox overflow-y-auto scrollbar-hide ${message ? 'h-5/6' : 'h-full'}`} ref={chatContainerRef} >
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
      {messages && (
        <form onSubmit={sendMessage} className="border-t h-14 w-full bg-[var(--secondary)] z-10">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={handleMessageChange}
              className="flex-1 border rounded-lg px-4 py-2"
              placeholder="Type a message..."
            />
            <Button  
              type="submit"
            >
              Send
            </Button>
          </div>
        </form>
      )}
     </div>
    </div>
  )
}

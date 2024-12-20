'use client'

import { useAppDispatch, useAppSelector } from "@/hooks/typedUseDispatch";
import { useToast } from '@/hooks/use-toast';
import { updateTotalUnReadMsg, updateUnReadMsgPerChat } from "@/lib/redux/features/auth/userSlice";
import { RootState } from "@/lib/redux/store/store";
import { IMessageResponse } from "@/lib/utils/interfaces/iMessages";
import messageService from "@/services/user/messages/messageService";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "./socketContext";

export interface ActiveChat{
    recipientId?:string,
    chatType:'individual' | 'group',
    groupId?:string[]
    chatId?:string,
    profileImage?:string,
    userName?:string,
    chatName?:string
}

export interface IReceiveMessageResponse{
  message:IMessageResponse[] | [],
  activeMessage:string,
  chatType:'individual' | 'group'
}

interface ChatContextType {
    activeChat:ActiveChat | null;
    setActiveChat:React.Dispatch<React.SetStateAction<ActiveChat | null>>;
    messages:IMessageResponse[] | [];
    setMessages:React.Dispatch<React.SetStateAction<IMessageResponse[] | []>>;
    message:string;
    sendMessage:(e:React.FormEvent<HTMLFormElement>) => void;
    handleMessageChange:(e:React.ChangeEvent<HTMLInputElement>) => void;
    chatContainerRef:React.RefObject<HTMLDivElement>;
    onType:() => void;
    onTypeEnd:() => void;
    typing:boolean;
    scrollToBottom:() => void;
    onlineUsers:string[];
    handleFileChange:(event:React.ChangeEvent<HTMLInputElement>) => void;
    prevFileUrl:string | null;
    setPrevFileUrl:React.Dispatch<React.SetStateAction<string | null>>;
    delte_from_me:(messageId:string) => void;
    delete_from_everyOne:(messageId:string) => void;
    fileType:'image' |'video' | 'none' | 'audio'|'application';
    fileName:null | string
}

interface ChatProviderProps {
    children: React.ReactNode;
  }

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const useChat =() => {
    const context = useContext(ChatContext)
    if(!context){
        throw new Error('useChat must be used within a ChatProvider')
    }
    return context
}

export const ChatProvider : React.FC<ChatProviderProps> = ({children}) => {
    const [ activeChat , setActiveChat ] = useState<ActiveChat | null >(null);// for tracking current selected chat
    const [ messages , setMessages] = useState<IMessageResponse[] | []>([]); // to store the messages locally and push the socket.io response
    const [message, setMessage] = useState<string>('');// To store the current inputing message value
    const chatContainerRef = useRef<HTMLDivElement>(null)// For scrolling the msg container div to stable in view port
    const { toast} = useToast()
    const userId = useAppSelector((state:RootState) => state?.user?.userId)
    const userName = useAppSelector((state:RootState) => state?.user?.user)
    const [typing , setTyping ] = useState<boolean>(false) // To track user is it typing...
    const dispatch = useAppDispatch()
    const debouncingTimeOut = useRef<null | number >(null)
    const [onlineUsers , setOnlineUsers ] = useState<string[] | []>([])// To store the online users id
    const [ fileType , setFileType ]  = useState<'image' | 'video' | 'audio'|'application'| 'none'>('none')
    const [ prevFileUrl , setPrevFileUrl] = useState<string | null>(null)
    const [ fileBuffer , setFileBuffer ] = useState<File | null>(null)
    const [fileName , setFileName] = useState<null | string>(null)

    const socket = useContext(SocketContext);

    const handleMessageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        onType()
        setMessage(e.target.value);

        if(debouncingTimeOut.current){
          clearTimeout(debouncingTimeOut.current)
        }

        debouncingTimeOut.current = window.setTimeout(() => {
          onTypeEnd()
        },2000)
    };

    const handleFileChange = async (event:React.ChangeEvent<HTMLInputElement>) => {
      const maxVideoDuration = 120
      const maxFileSize = 20 * 1024 * 1024
      const file = event.target.files?.[0]

      if(file){
        if(file.size > maxFileSize){
          toast({
              title: 'Over size..!',
              description:`Please upload a file under ${maxFileSize / (1024 * 1024)}MB `,
              className:"toast-failed"
          })
          return
        }
        // for extrating file type
        const fileMimeType = file?.type
        
        if(fileMimeType?.startsWith('image/')){
          setFileType('image')
        }else if(fileMimeType?.startsWith('video/')){
          const video = document.createElement('video')
          video.src = URL.createObjectURL(file as Blob)
            video.onloadedmetadata = () => {
                const duration = video.duration
                if(duration > maxVideoDuration){
                    toast({
                        title: 'Video duration over..!',
                        description:`Please upload a file under 1 minute. `,
                        className:"toast-failed"
                    })
                    return
                }else{setFileType('video')}
            }
        }else if(fileMimeType?.startsWith('audio/')){
          setFileType('audio')
        }else if(fileMimeType?.startsWith('application/')){
          setFileType('application')
        }
        else{
          toast({
              title: 'Unsupported..!',
              description: 'File upload filed failed.',
              className:"toast-failed"
          })
          return
        }

        const fileUrl = URL.createObjectURL(file as Blob)
        setPrevFileUrl(fileUrl)
        setFileBuffer(file)
        setFileName(file?.name)
      }else{
        toast({
            title: 'File upload Filed !!!',
            description: 'File upload filed.Try once again!',
            className:"toast-failed"
        })
        return
      }
    }

    const delte_from_me = async(messageId:string) => {
      if(!messageId && !userId){
        toast({
          title: 'Filed !!!',
          description: 'MessageId is missing !!!',
          className:"toast-failed"
      })
      return
      }
      const response = await messageService.delteFromMe(messageId, userId)
      if(response?.status){
        // remove the message from messages to quick remove
        const updatedMessages = messages.map((message) => 
          message?._id?.toString() === response?.deletedMsg?._id.toString() ?
          {...message,...response?.deletedMsg} :
          message
        )
        
        setMessages(updatedMessages)
      }
    }

    const delete_from_everyOne = async(messageId:string) => {
      if(!messageId && !userId){
        toast({
          title: 'Filed !!!',
          description: 'MessageId is missing !!!',
          className:"toast-failed"
      })
      return
      }
      const response = await messageService.deleteFromEveryone(messageId)

      if(response?.status){
        // remove the message from messages to quick remove
        const updatedMessages = messages.filter((message) => message?._id?.toString() !== response?.messageId)
        setMessages(updatedMessages)
      }
      
    }

    // const markMsgAsReaded = () => {
    //     const extractMsgIds = messages.map((message) => message?._id)
    //     console.log('message id s :',extractMsgIds)
    //     socket.emit('markmessagesAsReaded',{
    //       extractMsgIds,
    //       userId:userId
    //     })
    // }

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
          if(messages.length > 15) {
              chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;// for intantly scroll and scroll is not visible
          }else{
            chatContainerRef.current.scrollTo({ // for scroll animationally and user can see the scroll while open it
              top: chatContainerRef.current.scrollHeight,
              behavior: 'smooth'
            }); 
          }     
        }
      };
    
    useEffect(() => {
      // Scroll to bottom when component mounts or new message is added
      scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages,typing]);

    // Function to handle receiving a new message in real-time
    useEffect(() => {
        socket.emit('joinIndividualChat', userId);
        socket.emit('joinGroupChat', activeChat?.chatId);

        //Emit event when user goes online
        socket.emit('user-online',{
          socketId:socket?.id,
          userId:userId
        })

        socket.on('updated-online-users',(users:string[]) => {
          setOnlineUsers(users)
        })


        // Listen for receiveMessage event
        socket.on('receiveMessage', (data) => {
            // Only update if the message belongs to the active chat
            if (data.activeMessage === activeChat?.chatId) {
                setMessages((prevMessages) => [...prevMessages, data.message]);
            }
        });
  
        socket.on('updatedUnReadMessage',(data) => {
          dispatch(updateUnReadMsgPerChat(data?.unReadMessagesPerChat))
          const payload = {
            totalUnreadMessage:data?.totalUnreadMessage
          }
          dispatch(updateTotalUnReadMsg(payload))
        })

        socket.on('typing...',(data) => {
          const { senderId } = data
          if(senderId !== userId){
            setTyping(true)
          }
        })

        socket.on('type-ended',() => {
          setTyping(false)
        })
  
        // Cleanup listener on component unmount
        return () => {
            socket.off('receiveMessage');
        };
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[setMessages,activeChat]);

    // For sending message of chat
    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if ((!message.trim() || !fileBuffer )&& !activeChat){
            toast({
              title: 'caution',
              description:`Please select a chat`,
              className:"toast-failed"
          })
            return;
        } 
        if(fileType !== 'none' && !fileBuffer){
          toast({
            title: 'caution',
            description:`File buffer is missing..!`,
            className:"toast-failed"
          })
          return;
        }
    
        if(activeChat?.chatType === 'individual'){
            socket.emit('sendIndividualMessage',{
                senderId:userId,
                senderName:userName,
                chatId:activeChat?.chatId,
                content:message,
                mediaType:fileType,
                fileBuffer:fileBuffer,
                filename:fileName
            })
        }else{
            socket.emit('sendGroupMessage',{
                senderId:userId,
                chatId:activeChat?.chatId,
                content:message,
                mediaType:fileType,
                fileBuffer:fileBuffer,
                filename:fileName
            })
        }
          setMessage('')
          setFileType('none')
          setFileBuffer(null)
          setPrevFileUrl(null)
          // markMsgAsReaded() // for handling the unreaded messages
    }

    const onType = () => {
      if (!activeChat){
        toast({
          title: 'caution',
          description:`Please select a chat`,
          className:"toast-failed"
      })
        return;
      } 
        socket.emit('onTyping...',{
            senderId:userId,
            chatId:activeChat?.chatId,
        })
    }

    const onTypeEnd = () => {
      socket.emit('on-type-end',{
        senderId:userId,
        chatId:activeChat?.chatId,
      })
    }

    return (
        <ChatContext.Provider value={{
          activeChat,
          setActiveChat,
          messages,
          setMessages,
          message,
          handleMessageChange,
          chatContainerRef,
          sendMessage,
          onType,
          onTypeEnd,
          typing,
          scrollToBottom,
          onlineUsers,
          handleFileChange,
          prevFileUrl,
          setPrevFileUrl,
          delte_from_me,
          delete_from_everyOne,
          fileType,
          fileName
          }}>
            {children}
        </ChatContext.Provider>
    )
}
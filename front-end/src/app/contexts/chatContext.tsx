'use client'

import { IMessageResponse } from "@/lib/utils/interfaces/iMessages";
import React , { createContext , useContext, useEffect, useRef, useState} from "react";
import { SocketContext } from "./socketContext";
import { useToast } from '@/hooks/use-toast'
import { useAppDispatch, useAppSelector } from "@/hooks/typedUseDispatch";
import { RootState } from "@/lib/redux/store/store";
import { updateTotalUnReadMsg, updateUnReadMsgPerChat } from "@/lib/redux/features/auth/userSlice";

export interface ActiveChat{
    recipientId?:string,
    chatType:'individual' | 'group',
    groupId?:string[]
    chatId?:string,
    profileImage?:string,
    userName?:string,
    chatName?:string
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
    const [ activeChat , setActiveChat ] = useState<ActiveChat | null >(null);
    const [ messages , setMessages] = useState<IMessageResponse[] | []>([]);
    const [message, setMessage] = useState<string>('');
    const chatContainerRef = useRef<HTMLDivElement>(null)
    const { toast} = useToast()
    const userId = useAppSelector((state:RootState) => state?.user?.userId)
    const userName = useAppSelector((state:RootState) => state?.user?.user)
    const dispatch = useAppDispatch()

    const socket = useContext(SocketContext);

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const markMsgAsReaded = () => {
        const extractMsgIds = messages.map((message) => message?._id)
        console.log('message id s :',extractMsgIds)
        socket.emit('markmessagesAsReaded',{
          extractMsgIds,
          userId:userId
        })
    }

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
          // chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; for intantly scroll and scroll is not visible
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

    // Function to handle receiving a new message in real-time
    useEffect(() => {
        socket.emit('joinIndividualChat', userId);
        socket.emit('joinGroupChat', activeChat?.chatId);
        // Listen for receiveMessage event
        socket.on('receiveMessage', (data) => {
            // Only update if the message belongs to the active chat
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>')
            console.log('Message received:', data);
            console.log('Expected messageId:',data?.activeMessage ,"chatId :",activeChat?.chatId);
            if (data.activeMessage === activeChat?.chatId) {
              console.log('<<<<<<<<<<<<<<<<<<<< message adding',data.message)
                setMessages((prevMessages) => [...prevMessages, data.message]);
            }
        });
  
        socket.on('updatedUnReadMessage',(data) => {
          console.log('the updated data reached here :>>>>>>>>>>  >>>>>>>>>  >>>>>>>>>>>  >>>>>>> >>>>>>',data)
          dispatch(updateUnReadMsgPerChat(data?.unReadMessagesPerChat))
          const payload = {
            totalUnreadMessage:data?.totalUnreadMessage
          }
          dispatch(updateTotalUnReadMsg(payload))
        })
  
        // Cleanup listener on component unmount
        return () => {
            socket.off('receiveMessage');
        };
      },[setMessages,activeChat]);

    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('sendMessage invoked :',message,"<>",activeChat,"<>",message.trim())
        if (!message.trim() || !activeChat){
            toast({
              title: 'caution',
              description:`Please select a chat`,
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
          console.log('sendGroupMessage :',activeChat)
            socket.emit('sendGroupMessage',{
                senderId:userId,
                chatId:activeChat?.chatId,
                content:message,
            })
        }
          setMessage('')
          markMsgAsReaded()
    }

    return (
        <ChatContext.Provider value={{activeChat,setActiveChat,messages,setMessages,message,handleMessageChange,chatContainerRef,sendMessage}}>
            {children}
        </ChatContext.Provider>
    )
}
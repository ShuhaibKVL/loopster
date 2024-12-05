'use client'

import chatBotService, { ChatBotService } from '@/services/gemini/chatBotService'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { useAppSelector } from '@/hooks/typedUseDispatch'
import { RootState } from '@/lib/redux/store/store'
import { AiOutlineSend } from "react-icons/ai";
import DefaultHeader from './DefaultHeader'
import { FaRegCircleStop } from "react-icons/fa6";
import TypingMarkdown from './TypingMarkDown'
import HistorySection from './HistorySection'
import { GoSidebarExpand } from "react-icons/go";
import { IChatBotHistory } from '@/lib/utils/interfaces/IChatBotHistory'
import ReactMarkdown from "react-markdown";
import { ObjectId } from 'mongoose'
import { SiGooglegemini } from 'react-icons/si'

export default function ChatBotPage() {
  const [ prompt , setPrompt ] = useState('')
  const [ loading , setLoading ] = useState(false)
  const [ qustions , setQuestions ] = useState('')
  const [ messages, setMessages] = useState<string[]>([]);
  const [ activeHistoryChat , setActiveHistoryChat ] = useState<IChatBotHistory | null>(null)
  const [chatHistory , setChatHistory ] = useState<IChatBotHistory[] | []>([])
  

  const { accessToken  , userId}  = useAppSelector((state:RootState) => state?.user)
  const [ sidBar , setSideBar ] = useState<boolean>(false)
  
  const abortControllerRef = useRef<AbortController | null>(null)

  const getHistroy = async() => {
    const response = await chatBotService.getHistory(userId)
    if(response.data){
      setChatHistory(response?.data)
    }
  }

  useEffect(() => {
    getHistroy()
  },[userId])


  const HandleSendPropmt = async() => {
    if(abortControllerRef.current){
      abortControllerRef.current.abort()
    }
      setActiveHistoryChat(null)
      setLoading(true)
      setMessages([])
      setQuestions(prompt)
      setPrompt('')
      let accumulatedText = ''

      try {
        const controller = await chatBotService.sendPrompt(
          prompt,
          accessToken,
          userId,
          (chunk) => {
            accumulatedText += chunk
            setMessages([accumulatedText])
          },
          () => {
            setLoading(false)
          },
          (error) => {
            console.error(error)
            setLoading(false)
          }
        )
        abortControllerRef.current = controller as AbortController
        getHistroy()
      } catch (error) {
        console.error(error)
      }
  }

  const handleStop = () => {
    if(abortControllerRef.current){
      abortControllerRef.current.abort()
      setLoading(false)
      setMessages((prev) => [...prev,'[Stream Aborted]'])
    }
  }

  const handleSideBar = () => {
    console.log('handel side bar function invoked')
    setSideBar(true)
  }

  return (
    <div className='text-center w-full h-full flex '>
      <div className='h-full w-full md:w-[70%] p-2 flex flex-col justify-between relative'>
        <div className='w-full h-full overflow-y-auto scrollbar-hide'>
        <div className='w-full h-full overflow-y-auto scrollbar-hide'>
          <div className='w-full flex items-center justify-center gap-2 p-2'>
            <SiGooglegemini className='skeleton text-blue-600' />
            Virtual Assistant

          </div>

          {/* Show DefaultHeader only if no activeHistoryChat, questions, or messages */}
          {!activeHistoryChat && messages.length === 0 && !qustions && <DefaultHeader />}

          {activeHistoryChat ? (
            <>
              <div className="chat chat-end relative">
                <div className="chat-bubble bg-[var(--hover-card)] text-[var(----color-foreign)]">
                  {activeHistoryChat?.question}
                </div>
              </div>    
          
              <div className="chat chat-start">
                <div className="chat-bubble bg-[var(--hover-card)] text-[var(----color-foreign)] text-start font-serif">
                  <ReactMarkdown>{activeHistoryChat?.content}</ReactMarkdown>
                </div>
              </div>
            </>
          ) : (
          qustions && (
            <>
              <div className="chat chat-end relative">
                <div className="chat-bubble bg-[var(--hover-card)] text-[var(----color-foreign)]">
                  {qustions}
                </div>
              </div>    
          
              {messages.length > 0 && (
                <div className="chat chat-start">
                  <div className="chat-bubble bg-[var(--hover-card)] text-[var(----color-foreign)] text-start font-serif">
                    {messages.map((msg, idx) => (
                      <TypingMarkdown key={idx} text={msg} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )
        )}
      </div>
      {/* prompt input section */}
        </div>
          <div className='w-full h-7 md:h-10 flex items-center gap-2 '>
            <input 
              className='border w-full h-full rounded-md' 
              value={prompt} type="text" 
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='Enter you prompt here ....'
            />
            {loading ? (
              <Button className='min-w-10' onClick={handleStop}>
                <FaRegCircleStop className='w-5 h-5 text-white'/>
              </Button>
            ) : (
              !prompt ? (
                <Button disabled className='min-w-7'>
                  <AiOutlineSend className='w-5 h-5 text-white'/>
                </Button>
              ) : (
                <Button onClick={HandleSendPropmt} 
                  className='min-w-7'>
                    <AiOutlineSend className='w-5 h-5 text-white'/>
                </Button>
              )
            )}
          </div>  
            <GoSidebarExpand
            onClick={handleSideBar}
            className='w-5 h-5 absolute right-0 text-[var(--color-bg)] md:hidden'/>
      </div>
      {/* history section */}
      <HistorySection
      sidBar={sidBar}
      chatHistory={chatHistory}
      activeChatHistoryId={activeHistoryChat?._id as string}
      setSideBar={setSideBar}
      setActiveChatHistory={setActiveHistoryChat}
       />
    </div>
  )
}

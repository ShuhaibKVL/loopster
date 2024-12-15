import { IChatBotHistory } from '@/lib/utils/interfaces/IChatBotHistory'
import React from 'react'
import { GoSidebarCollapse } from 'react-icons/go'
import { IoMdArrowForward } from "react-icons/io";


interface HistorySectionProps{
  sidBar:boolean,
  chatHistory:IChatBotHistory[],
  activeChatHistoryId:string
  setActiveChatHistory:React.Dispatch<React.SetStateAction<IChatBotHistory | null>>
  setSideBar:React.Dispatch<React.SetStateAction<boolean>>
}
export default function HistorySection({sidBar ,chatHistory,activeChatHistoryId, setSideBar,setActiveChatHistory}:HistorySectionProps) {
  const handleSelect = (chat:IChatBotHistory) => {
      setActiveChatHistory(chat)
      setSideBar(false)
  }
  return (  
    <div
      className={`h-full bg-[var(--secondary-bg)] border-l w-full md:w-[30%] fixed md:relative transform duration-300 ${
        sidBar ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
      }`}
      >
      <GoSidebarCollapse 
      onClick={() => setSideBar(false)}
      className='absolute top-4 right-4 md:hidden'
       />

       <div className='w-full h-auto overflow-y-auto scrollbar-hide sm:p-2 space-y-1'>
          {chatHistory?.length > 0 ? (
            chatHistory?.map((chat,index) => (
                <div 
                key={index}
                onClick={() => handleSelect(chat)}
                className={`sm:p-2 border-b shadow-sm text-start rounded-md flex justify-between cursor-pointer hover:bg-[var(--hover-card)] ${activeChatHistoryId === chat?._id && 'bg-[var(--hover-card)]'}`}>
                  <p className='font-semibold'>{chat?.question}</p>
                  <div className='flex flex-col justify-end items-end'>
                    <IoMdArrowForward />
                    <p className='text-xs text-[var(--color-bg)]'>{new Date(chat?.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
            ))
          ) : (
            <p className='w-full text-center'>your history is empty</p>
          )}
       </div>
    </div>
  )
}

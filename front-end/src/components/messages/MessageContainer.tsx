'use client'

import { dateToDays, dateToHours, dateToMinutes } from '@/lib/utils/convertDateDifference'
import { IMessageResponse } from '@/lib/utils/interfaces/iMessages'
import { TiTick } from "react-icons/ti";
import React, { useRef, useState } from 'react'
import Image from 'next/image';
import PostIMageSkelton from '../skeltons/PostIMageSkelton';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import DeleteFromMe from './DeleteFromMe';
import DeleteFromEveryOne from './DeleteFromEveryOne';
import { IoIosDownload } from "react-icons/io";
import { FaFilePdf } from 'react-icons/fa';

export default function MessageContainer({messages,userId,typing=false}:{messages:IMessageResponse[],userId:string,typing:boolean}) { 
  const [isLongPress , setIsLongPress] = useState<boolean>(false)
  const longPressTimeout = useRef<null | number>(null) 

  const handleTouchStart = () => {
    longPressTimeout.current = window.setTimeout(() => {
      setIsLongPress(true)
    },500)
  }

  const handleToushEnd = (messageId:string) => {
    if(longPressTimeout.current){
      clearTimeout(longPressTimeout.current)
    }
    
    if(isLongPress){
      // here, simulating the right click on context menu
      const contextMenuTrigger = document.getElementById(`message${messageId}`)
      if(contextMenuTrigger){
        const event = new MouseEvent('contextMenu',{
          bubbles: true,
          cancelable: true,
          view: window,
        })
        contextMenuTrigger.dispatchEvent(event)
      }
      setIsLongPress(false)
    }
  }

  return (
    <>
          {messages?.map((message) => (
            message?.sender?._id?.toString() === userId ? (
              !message?.deleteFromMe?.includes(userId) && (
              // user message section
              <ContextMenu key={message?._id} >
              <ContextMenuTrigger>
              <div
              id={`message-${message?._id}`} 
              onTouchStart={handleTouchStart}
              onTouchEnd={() => handleToushEnd(message?._id)}
              className="chat chat-end relative">
                <div className="chat-bubble bg-[var(--color-bg)] text-[var(----color-foreign)]">
                  {/* -------- if message contain media ----------- */}
                    {message?.mediaType === 'image' ? (
                      message?.mediaUrl ? (
                        <Image
                          src={`${message?.mediaUrl}`}
                          alt="Postcard Image"
                          className="w-full h-auto object-cover rounded-lg max-h-80 max-w-80"
                          width={400}
                          height={300}
                          layout="responsive"
                        />
                      ) : (
                        <PostIMageSkelton />
                      )
                    ) : message?.mediaType === 'video' ? (
                      message?.mediaUrl ? (
                        <video
                          src={`${message?.mediaUrl}`}
                          className="w-full h-auto rounded-md max-h-80 max-w-80"
                          controls
                          // controlsList="nodownload"
                          playsInline
                        />
                      ) : (
                        <PostIMageSkelton />
                      )
                    ) : message?.mediaType === 'audio' ? (
                      <audio controls>
                        <source src={message?.mediaUrl} type="audio/mp3"/>
                      </audio>
                    ) : message?.mediaType === 'application' ? (
                      <div className="min-w-36 h-14 rounded border flex items-center justify-between">
                        <FaFilePdf />
                        <p>{message?.fileName || 'Document'}</p>
                        <a href={message?.mediaUrl} download>
                         <IoIosDownload className='text-blue-500 w-5 h-5' />
                        </a>
                      </div>
                    ):(
                      ''
                    )}

                    {message?.content}
                <time className="text-xs opacity-50 absolute bottom-0 right-1">
                  {dateToDays(message?.createdAt as Date) > 0 ? 
                  `${dateToDays(message?.createdAt as Date)} d`:
                  (dateToHours(message?.createdAt as Date) > 0 ?
                  `${(dateToHours(message?.createdAt as Date))} h` :
                  (dateToMinutes(message?.createdAt as Date) > 0 ? 
                  `${(dateToMinutes(message?.createdAt as Date))} m`:
                  ('just now')))}
                </time>
                </div>
                <div className="chat-footer opacity-50">
                
                </div>
                <TiTick className={`absolute right-0 ${message?.isRead.includes(userId) ? 'text-blue-400' : 'text-gray-600'}`} size={10} />
              </div>

              </ContextMenuTrigger>
              {/* to show the menu for delete action */}
              <ContextMenuContent className='bg-[var(--secondary-bg)]'>
                <ContextMenuItem>
                  <DeleteFromMe messageId={message?._id} />
                </ContextMenuItem>
                <ContextMenuItem>
                  <DeleteFromEveryOne messageId={message?._id} />
                </ContextMenuItem>
              </ContextMenuContent>
              </ContextMenu>
              )
            ) : (
              // receiver message section
              <div className="chat chat-start" key={message?._id}>
                <div className="chat-header text-secondary">
                  {message?.chatType === 'group' ? message?.sender.userName : ''}
                {/* Obi-Wan Kenobi */}
                
                </div>
                <div className="chat-bubble bg-[var(--color-bg)] text-[var(----color-foreign)]">
                  {/* -------- if message contain media ----------- */}
                  {message?.mediaType === 'image' ? (
                      message?.mediaUrl ? (
                        <Image
                          src={`${message?.mediaUrl}`}
                          alt="Postcard Image"
                          className="w-full h-auto object-cover rounded-lg max-h-80 max-w-80"
                          width={400}
                          height={300}
                          layout="responsive"
                        />
                      ) : (
                        <PostIMageSkelton />
                      )
                    ) : message?.mediaType === 'video' ? (
                      message?.mediaUrl ? (
                        <video
                          src={`${message?.mediaUrl}`}
                          className="w-full h-auto rounded-md max-h-80 max-w-80"
                          // controlsList="nodownload"
                          controls
                          playsInline
                        />
                      ) : (
                        <PostIMageSkelton />
                      )
                    ) : message?.mediaType === 'audio' ? (
                      <audio controls>
                        <source src={message?.mediaUrl} type="audio/mp3"/>
                      </audio>
                    ) : message?.mediaType === 'application' ? (
                      <div className="min-w-36  h-14 rounded border flex items-center justify-between">
                         <FaFilePdf />
                         <p>{message?.fileName || 'Document'}</p>
                        <a title='click to download' href={message?.mediaUrl} download>
                         <IoIosDownload  className='text-blue-500 w-5 h-5'/>
                        </a>
                      </div>
                    ):(
                      ''
                    )}

                    {message?.content}
                  <time className="text-xs opacity-50 absolute bottom-0 right-1">
                    {dateToDays(message?.createdAt as Date) > 0 ? 
                    `${dateToDays(message?.createdAt as Date)} d`:
                    (dateToHours(message?.createdAt as Date) > 0 ?
                    `${(dateToHours(message?.createdAt as Date))} h` :
                    (dateToMinutes(message?.createdAt as Date) > 0 ? 
                    `${(dateToMinutes(message?.createdAt as Date))} m`:
                    ('just now')))}
                  </time>
                </div>
              </div>
            )
          ))}
          {typing && (
              <div className="chat chat-start">
                <div className="chat-bubble bg-[var(--color-bg)] text-[var(----color-foreign)]">
                  <span className="loading loading-dots loading-xs"></span>
                </div>
              </div>
          )}  
        </>
  )
}

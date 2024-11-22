import { dateToDays, dateToHours, dateToMinutes } from '@/lib/utils/convertDateDifference'
import { IMessageResponse } from '@/lib/utils/interfaces/iMessages'
import { FaBullseye } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import React from 'react'

export default function MessageContainer({messages,userId}:{messages:IMessageResponse[],userId:string}) {
  return (
    <>
          {messages.map((message) => (
            message?.sender?._id?.toString() === userId ? (
              <div className="chat chat-end relative">
                <div className="chat-bubble bg-[var(--color-bg)] text-[var(----color-foreign)]">{message?.content}
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
            ) : (
              <div className="chat chat-start">
                <div className="chat-header text-secondary">
                  {message?.chatType === 'group' ? message?.sender.userName : ''}
                {/* Obi-Wan Kenobi */}
                
                </div>
                <div className="chat-bubble bg-[var(--color-bg)] text-[var(----color-foreign)]">{message?.content}
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
        </>
  )
}

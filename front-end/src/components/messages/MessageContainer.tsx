import { dateToDays, dateToHours, dateToMinutes } from '@/lib/utils/convertDateDifference'
import { IMessageResponse } from '@/lib/utils/interfaces/iMessages'
import React from 'react'

export default function MessageContainer({messages,userId}:{messages:IMessageResponse[],userId:string}) {
  return (
    <>
          {messages.map((message) => (
            message?.sender === userId ? (
              <div className="chat chat-end">
                <div className="chat-bubble bg-[var(--color-bg)] text-[var(----color-foreign)]">{message?.content}</div>
                {/* <div className="chat-footer opacity-50">seen</div> */}
              </div>
            ) : (
              <div className="chat chat-start">
                <div className="chat-header">
                {/* Obi-Wan Kenobi */}
                <time className="text-xs opacity-50">
                  {dateToDays(message?.createdAt as Date) > 0 ? 
                  `${dateToDays(message?.createdAt as Date)} day ago`:
                  (dateToHours(message?.createdAt as Date) > 0 ?
                  `${(dateToHours(message?.createdAt as Date))} hour ago` :
                  (dateToMinutes(message?.createdAt as Date) > 0 ? 
                  `${(dateToMinutes(message?.createdAt as Date))} minutes ago`:
                  ('just now')))}
                </time>
                </div>
                <div className="chat-bubble bg-[var(--color-bg)] text-[var(----color-foreign)]">{message?.content}</div>
              </div>
            )
          ))}
        </>
  )
}

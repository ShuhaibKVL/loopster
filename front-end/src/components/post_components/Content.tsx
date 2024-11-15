import React, { useState } from 'react'

export default function Content({content,fonts = 100}:{content:HTMLVideoElement | string,fonts?:number}) {
    const [ isExpanded , setIsExpanded ] = useState<boolean>(false)
  return (
    <div>
            <p
                className="text-base"
                dangerouslySetInnerHTML={{
                    __html: isExpanded
                        ? content?.toString()
                        : content?.toString()?.slice(0, fonts) + '...',
                }}
            />
            {content.toString().length > fonts &&
            (
                <span
                onClick={() => setIsExpanded(!isExpanded)}
                className="cursor-pointer text-md inline-flex"
            >
                {isExpanded ? 'Read Less' : 'Read More'}
            </span> 
            )} 
        </div>
  )
}

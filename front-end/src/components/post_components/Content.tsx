import React, { useState } from 'react'

export default function Content({content,fonts = 100,size='text-base'}:{content:HTMLVideoElement | string,fonts?:number,size?:string}) {
    const [ isExpanded , setIsExpanded ] = useState<boolean>(false)
  return (
    <div>
            <p
                className={`${size}`}
                dangerouslySetInnerHTML={{
                    __html: isExpanded
                        ? content?.toString()
                        : content?.toString()?.slice(0, fonts) + '...',
                }}
            />
            {content?.toString().length > fonts &&
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

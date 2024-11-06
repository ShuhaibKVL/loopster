import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'
import AvatarSkelton from './skeltons/AvatarSkelton'
import { BiSolidUserCircle } from 'react-icons/bi'

interface IAvatarProps{
    imgUrl?:string
}
export default function AvatarComponent({imgUrl}:IAvatarProps) {
    return (
        <div className="h-10 w-10 overflow-hidden shrink-0 rounded-full border">
        <Avatar >
        {imgUrl !== '' ? 
        (<>
            <AvatarImage
                src= {imgUrl}
                alt="PR"
                className=''
            />
        </>
        ) : ( 
            <BiSolidUserCircle className='text-[var(--color-bg)] w-full h-full object-contain' />
        )}
        </Avatar>
        </div>
    )
}

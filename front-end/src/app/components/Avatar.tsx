import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'
import AvatarSkelton from './skeltons/AvatarSkelton'

export default function AvatarComponent() {
    return (
        <div className="h-10 w-10 overflow-hidden shrink-0 rounded-full border">
        <Avatar >
        <AvatarImage
            src=''// Image URL for the user profile
            alt="PR" // Accessible alt text
            className=''
        />
        <AvatarFallback>{<AvatarSkelton />}</AvatarFallback>
        </Avatar>
        </div>
    )
}

import React from 'react'
import { ImageIcon } from 'lucide-react'

export default function PostIMageSkelton() {
    return (
    <div className='skeleton w-full h-80 border flex items-center justify-center'>
        <ImageIcon className='text-[var(--color-bg)]' />
    </div>
    )
}

import React from 'react'
import { ImageIcon } from 'lucide-react'

export default function PostIMageSkelton() {
    return (
    <div className='skeleton bg-[var(--color-bg)] w-full h-full border flex items-center justify-center'>
        <ImageIcon className='text-[var(--color-bg)]' />
    </div>
    )
}

import Image from 'next/image';
import React from 'react'

export default function Page({ params }: { params: { chatId: string }}) {
    const { chatId } = params; 
    return (
      <div className='w-full h-full'>
           <div className="relative w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] m-auto group overflow-hidden rounded-full">
              <Image
              src=''
              width={250}
              height={250}
              className="border rounded-full shadow-sm hover:opacity-80"
              objectFit='contain'
              alt="Profile Image"
              />
          </div>
      </div>
    )
}

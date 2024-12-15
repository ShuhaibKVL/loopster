'use client'

import React, { useState } from 'react'
import { IoSearchOutline } from "react-icons/io5";

interface ISearchInputProps{
    onInputChange:(value:string) => void
    placeholder?: string;
}

export default function SearchInput({ onInputChange, placeholder = "Search..." }: ISearchInputProps) {
    const [ typingTimout , setTypingTimout ] = useState<NodeJS.Timeout | null>(null)

    const handleOnChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        if(typingTimout) clearTimeout(typingTimout)

        const timout = setTimeout(() => {
            onInputChange(e.target.value)
        },500)
        
        setTypingTimout(timout)
    }

    return (
      <div className='w-full h-10 rounded-md border flex items-center px-3'>
        <input 
          type="text" 
          onChange={handleOnChange} 
          placeholder={placeholder}
          className="w-full h-full outline-none border-none text-gray-700 bg-[var(--secondary-bg)] "
        />
        <IoSearchOutline 
        className='w-6 h-6 text-gray-500'
        />
      </div>
    );
  }

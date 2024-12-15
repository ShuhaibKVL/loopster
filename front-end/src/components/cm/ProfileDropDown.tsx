'use client'

import React, { useEffect, useState } from 'react'
import { DropdownOption } from './DropDownMenu'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { BsThreeDotsVertical } from 'react-icons/bs';

export default function ProfileDropDown() {
  
  const [theme, setTheme] = useState(() =>
    document.documentElement.getAttribute('data-theme') || 'light'
  );

  useEffect(() => {
      console.log('>>>>>> Theme useEffect invoked',)
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.style.transition = 'background-color 0.3s'
  }, [theme]);

  const toggleTheme = () => {
      console.log('theme setting invoked',theme ,"set to opposite ")
      setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const options :  DropdownOption[] = [
    {label:theme === 'light' ? 'Dark' : 'Light',action:() => toggleTheme()}
  ]


  return (
    <div className='relative w-full h-7 overflow-hidden'>
        <div className='absolute right-0 '>
        <DropdownMenu>
            <DropdownMenuTrigger asChild className='text-[var(--color-foreign)]'>
                <button className="p-2" title='click to post actions'>
                    <BsThreeDotsVertical className={`w-3 h-4 sm:w-4 sm:h-4 -z-10 ${theme}`} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-[var(--secondary-bg)]">
                {options.map((option, index) => (
                    <DropdownMenuItem 
                      className={`hover:bg-[var(--hover-card)] border-none ${theme === option?.label && 'bg-[var(--hover-card)]'} text-[0.8rem]`}
                      key={index} onClick={() => option.action()}
                    >
                    {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>  
      </div>
    </div>
  )
}

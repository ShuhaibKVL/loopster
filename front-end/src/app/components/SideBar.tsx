'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { logout } from '@/lib/redux/features/auth/userSlice';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { ExitIcon } from '@radix-ui/react-icons';
import { LuMessagesSquare } from "react-icons/lu";

export interface INavItems {
    name: string,
    icon: ReactNode,
    path: string
}

interface SideBarProps {
    navItems: INavItems[];
}

export default function SideBar({ navItems }: SideBarProps) {
    const router = useRouter();
    const currentPath = usePathname()
    console.log('currentPath :',currentPath)
    const dispatch = useDispatch()

    function handleLogout(){
        dispatch(logout())
    }

    return (
        <div className='w-full h-full flex flex-col gap-2 p-2'>
            <div className="flex-grow">
            {navItems.map((item: INavItems) => {
                const isActive = currentPath === item.path; // Check if the current path is active
                return (
                    <div
                        key={item.name}
                        className={`h-14 flex p-2 border-b items-center justify-center lg:justify-start rounded-md cursor-pointer 
                        ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-200'} transition-colors duration-200`}
                        onClick={() => router.push(item.path)}
                    >
                        {/* Render the icon as a React component */}
                        <div className='mr-2'>
                            {item.icon}
                        </div>
                        <h2 className='hidden md:block'>{item.name}</h2>
                    </div>
                )
            })}
            </div>
              {/* Logout */}
            <div className="mt-auto w-full">
            <Button  onClick={handleLogout} variant={'default'} className='align-bottom text-white w-full'>
                Logout
                <ExitIcon className='text-white ml-2'/>
            </Button>
            </div>
        </div>
    )
}

'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

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

    return (
        <div className='w-full h-full flex flex-col gap-2 p-2'>
            {navItems.map((item: INavItems) => {
                const isActive = currentPath === item.path; // Check if the current path is active
                return (
                    <div
                        key={item.name}
                        className={`h-14 flex p-2 border items-center justify-center lg:justify-start rounded-md cursor-pointer 
                        ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-200'} transition-colors duration-200`} // Apply styles for hover and active states
                        onClick={() => router.push(item.path)}
                    >
                        {/* Render the icon as a React component */}
                        <div className='md:hidden'>
                            {item.icon}
                        </div>
                        <h2 className='hidden md:block'>{item.name}</h2>
                    </div>
                )
            })}
        </div>
    )
}

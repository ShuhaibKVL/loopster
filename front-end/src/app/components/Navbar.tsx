'use client'

import React, { useState } from 'react'
import logo from '../../../public/Images/Loopster.png'
import defaultProfile from '../../../public/Images/xxl-r-petal-pink-stoneberg-original-imageum8qmynhwnz.png'
import Image from 'next/image'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import ThemeToggle from './ThemeToggle'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store/store'
import { logout } from '@/lib/redux/features/auth/userSlice'


export default function Navbar() {
    const  isAuthenticated = useSelector((state:RootState) => state.user.isAuthenticated);
    console.log("isAuthenticated in Navbar:",isAuthenticated)
    const [ userData , setUserData] = useState({image:'/jkdh'})

    return (
    <div className='z-auto w-full h-full flex items-center px-24 justify-between overflow-hidden'>
        <Image
        src={logo}
        width={120}
        alt='Logo'
        />

        <div className='w-[15vw] flex items-center justify-between'>
        {isAuthenticated ? (
            <HoverCard>
            <HoverCardTrigger>
            <div className='w-10 h-10 rounded-full border mr-3 overflow-hidden'>
                <Image
                src={defaultProfile}
                alt={`${userData.image}`}
                width={60}
                height={60}
                />
            </div>
            </HoverCardTrigger>
            <HoverCardContent>
            <Link href={'/feed/profile'} ><button className='border w-full rounded-sm'>Profile</button></Link>
            </HoverCardContent>
            </HoverCard>
        ):(
            <HoverCard>
            <HoverCardTrigger>Sign In</HoverCardTrigger>
            <HoverCardContent>
                <p >Please sign in or create a account to join our community.</p>
                <button className='border w-full rounded-sm'>Sign in</button>
            </HoverCardContent>
            </HoverCard>
        )}
        <ThemeToggle />
        </div>
    </div>
    )
}

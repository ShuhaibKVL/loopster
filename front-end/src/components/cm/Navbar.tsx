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
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store/store'


export default function Navbar() {
    const  isAuthenticated = useSelector((state:RootState) => state?.user?.isAuthenticated);
    console.log("isAuthenticated in Navbar:",isAuthenticated)
    const user = useSelector((state:RootState) => state?.user?.user)

    return (
    <div className='z-auto w-full h-full flex items-center px-14 sm:px-24 justify-between overflow-hidden'>
        <Image
        src={logo}
        width={120}
        alt='Logo'
        />

        <div className='w-[15vw] flex items-center justify-between'>
        {isAuthenticated ? (
            <HoverCard>
            <HoverCardTrigger>
                <Link href={'/feed/profile'} ><p>{user}</p></Link>
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
        <div className='hidden md:block'>
            <ThemeToggle />
        </div>
        </div>
    </div>
    )
}

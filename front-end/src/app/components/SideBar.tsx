'use client'
import React from 'react'

import homeIcon from '../../../public/Images/fluent--home-20-regular.png'
import messageIcon from '../../../public/Images/uil--message.png'
import bellIcon from '../../../public/Images/bitcoin-icons--bell-outline (1).png'
import bookMarkIcon from '../../../public/Images/material-symbols-light--bookmark-outline (1).png'

import Image from 'next/image'
import Font from 'next/font'
import {useRouter} from 'next/navigation'

export default function SideBar() {
    const router = useRouter()
    const navItems = [
        {name:'Home',icon:homeIcon , path:'/feed'},
        {name:'Messages',icon:messageIcon , path:'/messages'},
        {name:'Notification',icon:bellIcon , path:'/notifications'},
        {name:'Book Mark',icon:bookMarkIcon , path:'/bookmarks'},
        // {name:'Gemini',icon:starIcon , path:'/gemini'},
    ]
    return (
    <div className='w-full h-full flex flex-col gap-2 p-2'>
        {navItems.map((item) => (
        <div key={item.name} className='flex p-2 border items-center justify-center lg:justify-start rounded-full lg:rounded-md '
            onClick={() =>  router.push(item.path)}>
            <Image src={item.icon} width={30} alt={`${item.name}`} className='lg:hidden' />
            <h2 className='hidden lg:block' >{item.name}</h2>
        </div>
        ))}
    </div>
    )
}

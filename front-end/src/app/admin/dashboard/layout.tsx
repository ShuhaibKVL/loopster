'use client'

import SideBar,{ INavItems} from '@/components/cm/SideBar'; 
import React from 'react'
import { DashboardIcon } from '@radix-ui/react-icons'
import { MdOutlineManageAccounts } from "react-icons/md";
import { MdOutlineOndemandVideo } from "react-icons/md";

const navItems:INavItems[] = [
    {name:'Dashboard',icon:<DashboardIcon/> , path:'/admin/dashboard'},
    {name:'User Management',icon:<MdOutlineManageAccounts />, path:'/admin/dashboard/userManagement'},
    {name:'Post Management',icon:<MdOutlineOndemandVideo />,path:'/admin/dashboard/postManagement'},
]

export default function Layout({
    children
}:Readonly<{
    children:React.ReactNode
}>) {

    return (
        <div className='w-full h-screen bg-[var(--color-bg)]'>
            {/* Navbar section */}
            <nav className='w-full  h-[7.5vh] fixed z-50 top-0 bg-[var(--secondary-bg)] flex items-center justify-end px-5 border-b'> 
            </nav>
            {/* To Down the Header space due to fixed property */}
            <div className="w-full h-[7.5vh]"></div>
            <div className='flex items-top justify-between gap-1 px-1 w-full h-[91vh] my-1'>
                <div className='lg:w-[20vw] h-full bg-[var(--secondary-bg)] hidden sm:block rounded-md sticky'>
                    <SideBar navItems={navItems} type='admin' />
                    
                </div>
                <div className='w-full min-h-[30vh] bg-[var(--secondary-bg)] sm:block rounded-md scrollable'>
                    {children}
                </div>
            </div>
        </div>
    )
}

'use client'

import SideBar, { INavItems } from '@/app/components/SideBar'
import React from 'react'
import { DashboardIcon } from '@radix-ui/react-icons'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store/store'
import { logout } from '@/lib/redux/features/auth/adminSlice'
import { confirmAction } from '@/app/components/ConfirmationModal';


export default function Layout({
    children
}:Readonly<{
    children:React.ReactNode
}>) {

    const navItems:INavItems[] = [
        {name:'Dashboard',icon:<DashboardIcon/> , path:'/admin/dashboard'},
        {name:'User Management',icon:<DashboardIcon/> , path:'/admin/dashboard/userManagement'},
        {name:'Post Management',icon:<DashboardIcon/>,path:'/admin/dashboard/postManagement'},
        {name:'Book Mark',icon:<DashboardIcon/>,path:'/bookmarks'},
    ]

    const dispatch = useDispatch()

    const isAuthenticated = useSelector((state:RootState) => state.admin.isAuthenticated)
    console.log('admin is authenticated :',isAuthenticated)

    async function handleLogout(){
        console.log('admin logout fn invoked')
        const willProceed = await confirmAction({
            title: `Confirm your action`,
            text: `Are you sure you want to logout ?`,
            icon: 'warning',
        });
    
        if(willProceed){
            dispatch(logout())
        }
    }

    return (
        <div className='w-full min-h-screen bg-[var(--color-bg)]'>
            <nav className='w-full h-12 bg-[var(--secondary-bg)] flex items-center justify-end px-5'>
                {isAuthenticated ? (
                    <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                        <p onClick={handleLogout} className=''>Logout</p>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Logout the session</p>
                        </TooltipContent>
                    </Tooltip>
                    </TooltipProvider>
                ) : ('')}
                
            </nav>
            <div className='flex items-top justify-between gap-1 px-1 w-full min-h-screen my-1'>
                <div className='lg:w-[20vw] min-h-screen bg-[var(--secondary-bg)] hidden sm:block rounded-md'>
                    <SideBar navItems={navItems} />
                    
                </div>
                <div className='w-full min-h-[30vh] bg-[var(--secondary-bg)] sm:block rounded-md'>
                    {children}
                </div>
            </div>
        </div>
    )
}

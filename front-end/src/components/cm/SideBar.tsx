'use client'

import React, { ReactNode,} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { logout } from '@/lib/redux/features/auth/userSlice';
import { logout as adminLogout } from '@/lib/redux/features/auth/adminSlice';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { ExitIcon } from '@radix-ui/react-icons';
import { confirmAction } from './ConfirmationModal';
import axios from 'axios';

export interface INavItems {
    name: string,
    icon: ReactNode,
    path: string
}

interface SideBarProps {
    navItems: INavItems[];
    type?:'user' | 'admin'
}

export default function SideBar({ navItems ,type}: SideBarProps) {
    const router = useRouter();
    const currentPath = usePathname()

    const dispatch = useDispatch()

    async function handleLogout(){

        const willProceed = await confirmAction({
            title: `Confirm your action`,
            text: `Are you sure you want to logout ?`,
            icon: 'warning',
        });
        console.log('logout function invoked')
    
        if(willProceed){
            if(type === 'user'){
                console.log('logout function invoked  1111')
                dispatch(logout())

                // console.log('logout function invoked   llllllll')
                // const logou = await axios.get('/api/logout')
                // console.log('sfldfldsfj :',logou)

                return
            }else if(type === 'admin'){
                dispatch(adminLogout())
                return
            }
            
        }
       alert('logout causing some errors..!')
    }

    return (
        <div className='w-full h-full flex sm:flex-col gap-2 p-2 bg-[var(--secondary-bg)]'>
            <div className="flex-row flex sm:flex-none sm:flex-col sm:flex-grow justify-evenly sm:justify-normal w-full">
            {navItems.map((item: INavItems) => {
                const isActive = currentPath === item.path;
                return (
                    <div
                        key={item.name}
                        className={`h-14 w-14 sm:w-full flex p-2 border-b items-center justify-center lg:justify-start rounded-xl sm:rounded-md cursor-pointer 
                        ${isActive ? 'bg-secondary text-white' : 'hover:bg-secondary'} transition-colors duration-200 z-50`}
                        onClick={() => router.push(item.path)}
                    >
                        {/* Render the icon as a React component */}
                        <div className='sm:mr-2'>
                            {item.icon}
                        </div>
                        <h2 className='hidden md:block text-[0.8rem]'>{item.name}</h2>
                    </div>
                )
            })}
            </div>
              {/* Logout */}
              {type ? 
              (
                <div className="mt-auto w-full hidden sm:block">
                    
                    <Button  onClick={handleLogout} variant={'default'} className='align-bottom text-white w-full'>
                        <span className='hidden md:block'> Logout</span>
                        <ExitIcon className='text-white ml-2'/>
                    </Button>
                </div>
              ) : (null)}
        </div>
    )
}

'use client'

import { useNotifications } from '@/app/contexts/notificationContext';
import { SocketContext } from '@/app/contexts/SocketContext';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/hooks/typedUseDispatch';
import { logout as adminLogout } from '@/lib/redux/features/auth/adminSlice';
import { logout } from '@/lib/redux/features/auth/userSlice';
import { RootState } from '@/lib/redux/store/store';
import { ExitIcon } from '@radix-ui/react-icons';
import { deleteCookie } from 'cookies-next';
import { signOut } from 'next-auth/react';
import { redirect, usePathname, useRouter } from 'next/navigation';
import { ReactNode, useContext, useEffect, useState, } from 'react';
import { useDispatch } from 'react-redux';
import { confirmAction } from './ConfirmationModal';

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
    const totalUnReadMessages = useAppSelector((state:RootState) => state?.user?.totalUnReadMessages)
    const [width , setWidth ] = useState(window?.innerWidth)
    const {unReadedNotifications} = useNotifications()
    const socket = useContext(SocketContext);
 
    
    const dispatch = useDispatch()

    async function handleLogout(){
        const willProceed = await confirmAction({
            title: `Confirm your action`,
            text: `Are you sure you want to logout ?`,
            icon: 'warning',
        });    
        if(willProceed){
            if(type === 'user'){
                socket.disconnect()

                dispatch(logout())
                 // Remove session cookies
                deleteCookie ('session');

                // Sign out from next-auth
                await signOut({ redirect: true ,callbackUrl: '/signIn'});
                return
            }else if(type === 'admin'){
                dispatch(adminLogout())
                redirect('/admin/signIn')

            }  
        }
       alert('logout causing some errors..!')
    }

    useEffect(() => {
        if(window){
            const handlResize = () => setWidth(window.innerWidth)
            window.addEventListener('resize',handlResize)

            return () => window.removeEventListener('resize',handlResize)
        }
    },[])

    useEffect(() => {
        console.log('inner width :',width)
    },[width])

    return (
        <div className='w-full h-full flex sm:flex-col gap-2 p-2 bg-[var(--secondary-bg)]'>
            <div className="flex-row flex sm:flex-none sm:flex-col sm:flex-grow justify-evenly sm:justify-normal w-full">
            {navItems.map((item: INavItems) => {
                const isActive = currentPath === item.path;
                return (
                    <div
                        key={item.name}
                        className={`h-14 w-14 sm:w-full flex p-2 border-b items-center justify-center lg:justify-start rounded-xl sm:rounded-md cursor-pointer 
                        ${isActive ? 'bg-secondary text-white' : 'hover:bg-secondary'} transition-colors duration-200 z-50 
                        ${(width < 640 && item.name === 'Virtual Assistant') ? 'hidden' :'relative'}`}
                        onClick={() => router.push(item.path)}
                    >
                        {/* Render the icon as a React component */}
                        <div className='sm:mr-2'>
                            {item.icon}
                        </div>
                        <h2 className='hidden md:block text-[0.8rem]'>{item.name}</h2>
                        {item.path === '/feed/messages' && totalUnReadMessages && (
                            <div className='p-1 bg-green-500 rounded-full flex items-center justify-center text-white absolute right-0 top-1 min-size-5'>
                                <p className='text-[8px] text-white'>{totalUnReadMessages}</p>
                            </div>
                        )}
                        {item.path === '/feed/notifications' && unReadedNotifications > 0 && (
                            <div className='p-1 bg-green-500 rounded-full flex items-center justify-center text-white absolute right-0 top-1 min-size-5'>
                                <p className='text-[8px] text-white'>{unReadedNotifications}</p>
                            </div>
                        )}
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

'use client'

import "../globals.css";
import React from "react";
import SideBar , { INavItems} from "@/components/cm/SideBar";
import Navbar from "@/components/cm/Navbar";
import { SiGooglegemini } from "react-icons/si";
import { HomeIcon } from "@radix-ui/react-icons";
import { BellIcon } from "@radix-ui/react-icons";
import {BookmarkIcon} from "@radix-ui/react-icons";
import {AvatarIcon} from "@radix-ui/react-icons";
import { LuMessagesSquare } from "react-icons/lu";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/hooks/typedUseDispatch";
import { RootState } from "@/lib/redux/store/store";
import Link from "next/link";
import Suggestion from "@/components/post_components/Suggestion";
import { MdAddPhotoAlternate } from "react-icons/md";
import { ChatProvider } from "../contexts/chatContext";

export default function FeedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const path = usePathname()
    console.log('path >',path,path.includes('messages'))
    const isMessagePage = path.includes('messages') || path.includes('profile')
    const isGeminiChat = path.includes('gemini_bot')
    const isChatPage = path.includes('chat')
    const userId = useAppSelector((state:RootState) => state?.user?.userId)

    console.log("isMessagePage :",isMessagePage)
    console.log("isGeminiChat :",isGeminiChat)
    console.log("isChatPage :",isChatPage)

    const navItems :INavItems[] = [
        {name:'feed',icon:<HomeIcon /> , path:'/feed'},
        {name:'Messages',icon:<LuMessagesSquare /> , path:'/feed/messages'},
        {name:'Notification',icon:<BellIcon /> , path:'/feed/notifications'},
        {name:'Book Mark',icon:<BookmarkIcon /> , path:'/feed/book_mark'},
        {name:'Profile',icon:<AvatarIcon /> , path:`/feed/profile/${userId}`},
        {name:'Virtual Assistant',icon:<SiGooglegemini /> , path:'/feed/gemini_bot'},
    ]

    return (
        <div className="w-full h-screen">
            {/* Header Section */}
            <div className="w-full h-[7.5vh] fixed top-0 z-50 bg-[var(--secondary-bg)] hidden md:block">
                <Navbar />
            </div>
            {/* To Down the Header space due to fixed property */}
            <div className="w-full h-[7.5vh] hidden md:block"></div>
            <div className={`flex items-center justify-center w-full ${isChatPage ? 'h-screen' : 'h-[92vh] p-2'}`}>
                <div className="sm:flex items-center justify-between w-full md:w-[78vw] h-full gap-1">
                    {/* Side bar */}
                    {!isChatPage && (
                        <div className="w-full sm:w-[15vw] h-fit sm:h-full bg-[var(--hover-card)] shadow-sm sm:shadow-none flex fixed sm:relative bottom-0 z-30 sm:z-0 rounded-md sm:bg-[var(--secondary-bg)]">
                            <SideBar navItems={navItems} type="user" />
                        </div>
                    )}
                    
                    {/* Main Feed */}
                    <div className={`${isMessagePage || isGeminiChat ? 'p-0':'p-2'} bg-[var(--secondary-bg)] rounded-md ${isChatPage ? 'h-full': 'h-[90vh]'}  overflow-y-scroll scrollbar-hide ${isMessagePage || isGeminiChat ? 'w-full':'md:w-[40vw] lg:w-[40vw] w-full'}`}>
                        {path === '/feed' && (
                            <Link href={'/feed/gemini_bot'}>
                                <div 
                                title="Virtual Assistant"
                                className="p-2 border border-secondary sm:hidden bg-[var(--hover-card)] skeleton absolute right-3 bottom-32 z-20">
                                    <SiGooglegemini
                                        className=" w-6 h-6 text-blue-400"
                                    /> 
                                </div>
                            </Link>
                        )}
                        {path === '/feed' && (
                            <Link href={'/feed/create_post'}>
                                <div 
                                title="Create Post"
                                className="p-2 border sm:hidden bg-secondary absolute right-3 bottom-20 z-20 rounded-md">
                                    <MdAddPhotoAlternate
                                        className=" w-6 h-6 text-white"
                                    /> 
                                </div>
                            </Link>
                        )}
                        <ChatProvider>
                        {children}
                        </ChatProvider>
                    </div>
                    {/* 3rd Layer */}
                    {isMessagePage || isGeminiChat ? (null) : (
                        <div className='sticky w-[22vw] bg-[var(--secondary-bg)] h-full hidden md:block rounded-md'>
                            <Suggestion />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

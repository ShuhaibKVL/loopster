'use client'

import "../globals.css";
import React from "react";
import SideBar, { INavItems } from "../components/SideBar";
import Navbar from "../components/Navbar";

import homeIcon from '../../../public/Images/fluent--home-20-regular.png'
import messageIcon from '../../../public/Images/uil--message.png'
import bellIcon from '../../../public/Images/bitcoin-icons--bell-outline (1).png'
import bookMarkIcon from '../../../public/Images/material-symbols-light--bookmark-outline (1).png'

import { HomeIcon } from "@radix-ui/react-icons";
import { BellIcon } from "@radix-ui/react-icons";
import {BookmarkIcon} from "@radix-ui/react-icons";
import {AvatarIcon} from "@radix-ui/react-icons";

const navItems :INavItems[] = [
    {name:'feed',icon:<HomeIcon /> , path:'/feed'},
    {name:'Messages',icon:<AvatarIcon /> , path:'/messages'},
    {name:'Notification',icon:<BellIcon /> , path:'/notifications'},
    {name:'Book Mark',icon:<BookmarkIcon /> , path:'/bookmarks'},
    // {name:'Gemini',icon:starIcon , path:'/gemini'},
]

export default function feedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div className="w-full h-screen">
            {/* Header Section */}
            <div className="w-full h-[7.5vh] fixed top-0 z-50 bg-[var(--secondary-bg)]">
                <Navbar />
            </div>
            {/* To Down the Header space due to fixed property */}
            <div className="w-full h-[7.5vh]"></div>
            <div className="flex items-center justify-between w-full h-[92vh] p-2">
                {/* Side bar */}
                <div className="lg:w-[20vw] h-full bg-[var(--secondary-bg)] hidden sm:block rounded-md">
                    <SideBar navItems={navItems} />
                    
                </div>
                {/* Main Feed */}
                <div className="scrollable overflow-x-hidden flex flex-col gap-2 sm:w-[60vw] lg:w-[48vw] p-2 bg-[var(--secondary-bg)] h-full w-full rounded-md"
                >
                    {children}
                </div>
                {/* 3rd Layer */}
                <div className="sticky w-[29vw] bg-[var(--secondary-bg)]  h-full hidden sm:block rounded-md">
                    {/* <span className="loading loading-ring loading-xs"></span>
                    <span className="loading loading-ring loading-sm"></span>
                    <span className="loading loading-ring loading-md"></span>
                    <span className="loading loading-ring loading-lg"></span> */}
                </div>
            </div>
        </div>
    );
}

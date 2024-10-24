'use client'

import "../globals.css";
import React from "react";
import SideBar, { INavItems } from "../components/SideBar";
import Navbar from "../components/Navbar";

import { HomeIcon } from "@radix-ui/react-icons";
import { BellIcon } from "@radix-ui/react-icons";
import {BookmarkIcon} from "@radix-ui/react-icons";
import {AvatarIcon} from "@radix-ui/react-icons";
import { LuMessagesSquare } from "react-icons/lu";

const navItems :INavItems[] = [
    {name:'feed',icon:<HomeIcon /> , path:'/feed'},
    {name:'Messages',icon:<LuMessagesSquare /> , path:'/messages'},
    {name:'Notification',icon:<BellIcon /> , path:'/notifications'},
    {name:'Book Mark',icon:<BookmarkIcon /> , path:'/bookmarks'},
    {name:'Profile',icon:<AvatarIcon /> , path:'/feed/profile'},
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
            <div className="flex items-center justify-center w-full h-[92vh] p-2">
                <div className="flex items-center justify-between w-full md:w-[78vw] h-full">
                    {/* Side bar */}
                    <div className="lg:w-[15vw] h-full bg-[var(--secondary-bg)] hidden sm:block rounded-md">
                        <SideBar navItems={navItems} />

                    </div>
                    {/* Main Feed */}
                    <div className="md:w-[40vw] lg:w-[40vw] p-2 bg-[var(--secondary-bg)] rounded-md w-full h-[90vh] overflow-y-scroll scrollbar-hide"
                    >
                        {children}
                    </div>
                    {/* 3rd Layer */}
                    <div className="sticky w-[22vw] bg-[var(--secondary-bg)]  h-full hidden md:block rounded-md">
                        {/* <span className="loading loading-ring loading-xs"></span>
                        */}
                    </div>
                </div>
            </div>
        </div>
    );
}

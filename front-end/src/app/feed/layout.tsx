import "../globals.css";

import React from "react";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";


export default function feedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="w-full h-screen">
            {/* Header Section */}
            <div className="w-full h-[62px] fixed top-0 z-50 bg-white">
                <Navbar />
            </div>
            {/* To Down the Header space due to fixed property */}
            <div className="w-full h-[68px]"></div>
            <div className="flex items-center justify-between w-full h-full p-2">
                {/* Side bar */}
                <div className="lg:w-[20vw] h-full bg-white hidden sm:block rounded-md">
                    <SideBar />
                </div>
                {/* Main Feed */}
                <div className="scrollable sm:w-[60vw] lg:w-[48vw] p-2 bg-white h-full w-full rounded-md"
                >
                    {children}
                </div>
                {/* 3rd Layer */}
                <div className="sticky w-[29vw] bg-white  h-full hidden sm:block rounded-md"></div>
            </div>
        </div>
    );
}

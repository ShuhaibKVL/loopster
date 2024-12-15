'use client'

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function CsFallBack({children}:{children:React.ReactNode}){
    const [isLoading, setIsLoading] = useState(false)
    // const router = useRouter()
    const router = typeof window !== 'undefined' ? useRouter() : null;

    if(router)
    useEffect(() => {
        const handleNavigation = () => {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 500); // Mock a delay for demonstration
        };

        router.prefetch('/feed'); 
        return () => {}
    },[router])

    return (
        <>
        {isLoading && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <span className="loading loading-ring loading-lg text-white"></span>
          </div>  
        )}
        {children}  
        </>
    )
}
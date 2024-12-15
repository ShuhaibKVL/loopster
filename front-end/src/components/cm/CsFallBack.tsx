'use client'

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function CsFallBack({ children }: { children: React.ReactNode }) {
    const router = useRouter(); // Always call the hook
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && router) { // Check conditionally here
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 500); // Mock a delay for demonstration

            router.prefetch('/feed');
        }
    }, [router]);

    return (
        <>
            {isLoading && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <span className="loading loading-ring loading-lg text-white"></span>
                    <p>cs_fall_back</p>
                </div>
            )}
            {children}
        </>
    );
}

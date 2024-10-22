import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster"
import { Inter } from 'next/font/google'


export const metadata: Metadata = {
    title: "loopster",
    description: "A social media network to connect each other.",
};

const inter = Inter({
    subsets:['latin'],
    weight:['400','700']
})

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div>
        {children}
        <Toaster />
        </div>
    );
}
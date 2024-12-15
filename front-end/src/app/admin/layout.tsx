import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
    title: "loopster",
    description: "A social media network to connect each other.",
};

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
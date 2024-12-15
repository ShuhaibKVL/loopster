import type { Metadata } from "next";
import "./globals.css";
import {ThemeProvider} from './contexts/ThemeContext'
import { Toaster } from "@/components/ui/toaster"
import { ToastContainer } from 'react-toastify'
import { Inter } from 'next/font/google'
import ReduxProvider from "./contexts/ReduxProvider";
import TanStackQueryClientProvider from "./contexts/TanStackQueryClientProvider";
import { SocketProvider } from "./contexts/socketContext";
import CsFallBack from "@/components/cm/CsFallBack";
import { ChatProvider } from "./contexts/chatContext";
import { NotificationProvider } from "./contexts/notificationContext";

export const metadata: Metadata = {
  title: "loopster",
  description: "A social media network to connect/chat/share with each other.",
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
    <html lang="en">
      <head>
        <link rel="icon" href="/Images/LoopsterLogoicon.png" />
        <title>Loopster</title>
      </head>
      <body className={`${inter.className} rounded-sm`}>
      <Toaster />
      <SocketProvider>
        <TanStackQueryClientProvider>
          <ReduxProvider>
            <ThemeProvider>
              <NotificationProvider>
                <CsFallBack>
                  {children}
                </CsFallBack>
              </NotificationProvider>
              </ThemeProvider>
            </ReduxProvider>
          </TanStackQueryClientProvider>
        </SocketProvider>
      <ToastContainer position="top-right" autoClose={3000} />  
      </body>
    </html>
  );
}

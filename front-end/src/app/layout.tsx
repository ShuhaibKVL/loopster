import CsFallBack from "@/components/cm/CsFallBack";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import { NotificationProvider } from "./contexts/notificationContext";
import ReduxProvider from "./contexts/ReduxProvider";
import { SocketProvider } from "./contexts/SocketContext";
import TanStackQueryClientProvider from "./contexts/TanStackQueryClientProvider";
import { ThemeProvider } from './contexts/ThemeContext';
import "./globals.css";

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
        {/* <SessionProvider> */}
        <ThemeProvider>
        <ReduxProvider>
        <Toaster />
        <SocketProvider>
          <TanStackQueryClientProvider>
              <NotificationProvider>
                <CsFallBack>
                  {children}
                </CsFallBack>
              </NotificationProvider>
          </TanStackQueryClientProvider>
        </SocketProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        </ReduxProvider>
        </ThemeProvider>
      {/* </SessionProvider>   */}
      </body>
    </html>
  );
}

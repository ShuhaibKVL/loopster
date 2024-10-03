import type { Metadata } from "next";
import "./globals.css";
import {ThemeProvider} from './contexts/ThemeContext'
import { Toaster } from "@/components/ui/toaster"
import { Inter } from 'next/font/google'
import ReduxProvider from "./contexts/ReduxProvider";


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
    <html lang="en">
      <body className={`${inter.className} rounded-sm`}>
        <ReduxProvider>
          <ThemeProvider>
          {children}
        </ThemeProvider>
        </ReduxProvider>
        <Toaster />
      </body>
    </html>
  );
}

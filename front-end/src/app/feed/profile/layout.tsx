import React from 'react'

export default function ProfileLayout({
    children
}:Readonly<{
    children:React.ReactNode;
}>) {
    return (
        <>
            {children}
        </>
    )
}

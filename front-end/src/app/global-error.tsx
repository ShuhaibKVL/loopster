'use client'

import React from 'react'

export default function GlobalError({
    error,
    reset,
}:{
    error:Error & {digest?:string}
    reset: () => void
}) {
    return (
    <html>
        <body className='bg-[var(--background)]'>
            <div className='flex items-center justify-center'>
                <p>Global Error</p>
                <h2>Something went wrong!</h2>
                <button onClick={() => reset()}>Try again</button>
            </div>
        </body>
    </html>
    )
}

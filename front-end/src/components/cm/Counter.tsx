'use client'

import React, { useEffect, useState } from 'react'

interface CounterProps {
    initialMinutes:number,
    resetTrigger:boolean,
}

export default function Counter({initialMinutes , resetTrigger}:CounterProps) {
    const [seconds ,setSeconds ] = useState(59)
    const [minutes ,setMinutes ] = useState(initialMinutes)

    useEffect(() => {
        const timer = setInterval(() => {
            if (minutes > 0 || seconds > 0) {
            // Decrease seconds
            if (seconds > 0) {
                setSeconds((prev) => prev - 1);
            } else if (minutes > 0) {
                setMinutes((prev) => prev - 1);
                setSeconds(59);
            }
            }
        }, 1000);
    
        return () => clearInterval(timer);
      }, [seconds, minutes]); 
    
    useEffect(() => {
        setMinutes(initialMinutes);
        setSeconds(59)
    },[initialMinutes , resetTrigger])

    return (
        minutes === 0 && seconds === 0 ?(
            <span className='font-mono text-2xl overflow-hidden text-red-600'>OTP Expired !</span>
        ):(
            <span className={`countdown font-mono text-2xl overflow-hidden ${minutes === 0 ?'text-red-500':''} `}>
            <span style={{"--value":minutes} as React.CSSProperties}></span> :
            <span style={{'--value':seconds} as React.CSSProperties}></span>
            </span>
        )
    )
}

'use client'

import React, { createContext, useEffect, useLayoutEffect, useState } from 'react'

export const ThemeContext = createContext()

export const ThemeProvider = ({children}) => {
    const [ theme, setTheme] = useState('light');

    useLayoutEffect(() => {
        const savedTheme = localStorage.getItem('theme')
        if(savedTheme){
            setTheme(savedTheme)
        }else if( window?.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches) {
            setTheme('dark')
        }
    },[])

    useEffect(() => {
        document.documentElement.setAttribute('data-theme',theme)
        localStorage.setItem('theme',theme)
    })
    return (
    <ThemeContext.Provider value={{theme,setTheme}}>
        {children}
    </ThemeContext.Provider>
    )
}

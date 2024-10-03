'use client'

import React, { createContext, useEffect, useState } from 'react'

export const ThemeContext = createContext()

export const ThemeProvider = ({children}) => {
    const [ theme, setTheme] = useState('light');
    console.log("theme :",theme,"localStorage.g :")

    useEffect(() => {
        console.log(">>>",localStorage.getItem('theme'))
        const savedTheme = localStorage.getItem('theme')
        if(savedTheme){
            setTheme(savedTheme)
            console.log("if")
        }else if( window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches) {
            console.log("else")
            setTheme('dark')
        }
    },[])

    useEffect(() => {
        document.documentElement.setAttribute('data-theme',theme)
        localStorage.setItem('theme',theme)
        console.log("second useEffect")
    })
    return (
    <ThemeContext.Provider value={{theme,setTheme}}>
        {children}
    </ThemeContext.Provider>
    )
}

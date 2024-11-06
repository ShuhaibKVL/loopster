import React from 'react'

interface IBadgeProps {
    value:string | number,
    right?:string,
    top?:string ,
    theme:string
}
export default function Badge({value,right='-right-2',top='-top-4',theme}:IBadgeProps) {
  return (
    <p className={`absolute ${right} ${top} z-50 p-1 rounded-badge  shadow-inner ${theme}
         text-white flex items-center justify-center text-sm md:text-md overflow-hidden aspect-square font-sans`}>{value}</p>
  )
}   

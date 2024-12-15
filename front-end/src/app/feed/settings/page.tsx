'use client'

import ThemeToggle from '@/components/cm/ThemeToggle';
import PrivateAccountHandler from '@/components/settings/PrivateAccountHandler';
import React, { useState } from 'react'

export default function Page() {
    const [theme] = useState(() =>
        document.documentElement.getAttribute('data-theme') || 'light'
    );

  return (
    <div className='w-full h-full bg-[var(--secondary-bg)]'>
      <h1 className='text-start border-b p-2 w-full'>Settings</h1>
      <div className='flex flex-col gap-3 mt-5'>
        <label className='font-mono border-b hover:bg-[var(--hover-card)]'>Appearance</label>
        <div className='flex items-center justify-between p-3'>
            <p className='pl-3'>{theme}</p>
            <ThemeToggle /> 
        </div>
            
        <label className='font-mono border-b hover:bg-[var(--hover-card)]'>Account Privacy</label>
            <PrivateAccountHandler />
      </div>
    </div>
  )
}

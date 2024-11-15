'use client'

import ReportPosts from '@/components/post_components/ReportPosts'
import adminWithAuth from '@/app/contexts/adminWithAuth'
import React from 'react'

const Page = () => {
  return (
    <div className='w-full h-full overflow-y-auto flex flex-col items-start justify-start gap-4 p-5'>
        <h1 className='font-sans font-bold text-[1.2rem]'>Report Request</h1> 
        <ReportPosts />
    </div>
  )
}

export default adminWithAuth(Page,true)

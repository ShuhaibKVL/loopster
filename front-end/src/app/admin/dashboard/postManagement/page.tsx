'use client'

import adminWithAuth from '@/app/contexts/adminWithAuth'
import PostTable from '@/app/components/post_components/PostTable'
import { Suspense } from 'react'
import PostTableSkeleton from '@/app/components/skeltons/PostTableSkeleton'

const Page = () => {

  return (
    <div className='w-full h-auto overflow-y-auto flex flex-col items-start justify-start gap-4 p-5'>
        <h1 className='font-sans font-bold text-[1.2rem]'>Post Management</h1> 
        <Suspense fallback={<PostTableSkeleton />} >
          <PostTable />
        </Suspense> 
    </div>
  )
}

export default adminWithAuth(Page , true)

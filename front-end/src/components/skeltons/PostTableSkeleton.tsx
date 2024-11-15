import React from 'react'
import PostIMageSkelton from './PostIMageSkelton'

export default function PostTableSkeleton() {
  return (
    <div className='relative w-full border p-5 grid gap-2 rounded-md overflow-hidden md:grid-cols-2 lg:grid-cols-3'>
         {/* Media section */}
         <div className='max-w-52 max-h-52'>
             <div className='w-full aspect-square overflow-hidden'>
                <PostIMageSkelton />
             </div>
         </div>
         {/* Content section */}
         <div className='w-full'>
         <div className='w-full h-3 skeleton'></div>
         <div className='w-full h-3 skeleton'></div>
         </div>
         
         {/* Info section */}
         <div className='skeleton w-full space-y-2'>
           <div className='w-full h-3 skeleton'></div>
           <div className='w-full h-3 skeleton'></div>
           <div className='w-full h-3 skeleton'></div>
         </div>
         {/* Arrow button section */}
         <div className='skeleton absolute right-2 bottom-2 p-2 rounded-sm border w-5 h-5' ></div>
       </div>
  )
}

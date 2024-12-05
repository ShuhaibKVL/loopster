import CreatePostComponent from '@/components/post_components/CreatePost'
import React from 'react'

export default function page() {
  return (
    <div className='w-full h-full'>
        <h1 className='p-2 '>Create your post</h1>
      <CreatePostComponent />
    </div>
  )
}

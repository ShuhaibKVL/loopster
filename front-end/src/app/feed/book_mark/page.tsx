'use client'

import BookMarkPosts from '@/app/components/post_components/BookMarkPosts'
import withAuth from '@/app/contexts/withAuth'
import React from 'react'

const Page =() => {
  return (
    <>
      <BookMarkPosts />
    </>
  )
}

export default withAuth(Page,true)

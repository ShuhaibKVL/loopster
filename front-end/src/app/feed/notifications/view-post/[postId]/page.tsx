'use client'

import withAuth from '@/app/contexts/withAuth'
import ViewPost from '@/components/notification/ViewPost'
import React from 'react'
const Page = ({params}:{params:{postId:string}}) => {
  return (
      <ViewPost  postId={params?.postId}/>
  )
}

export default withAuth(Page,true)

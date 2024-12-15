'use client'

import withAuth from '@/app/contexts/withAuth'
import Notifications from '@/components/notification/Notifications'
import React from 'react'

const Page = () => {
  return (
    <Notifications />
  )
}

export default withAuth(Page,true)
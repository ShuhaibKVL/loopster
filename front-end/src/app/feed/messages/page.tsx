'use client'

import withAuth from "@/app/contexts/withAuth"
import ChatLayout from "@/components/messages/ChatLayout"

const Page = () => {
  return (<ChatLayout />)
}

export default withAuth(Page,true)

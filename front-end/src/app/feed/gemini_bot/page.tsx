'use client'

import withAuth from '@/app/contexts/withAuth'
import ChatBotPage from '@/components/chatBot/ChatBotPage'
import React from 'react'

const Page = () => { 
  return (<ChatBotPage /> )
}

export default withAuth(Page,true)

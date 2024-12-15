'use client'

import adminWithAuth from '@/app/contexts/adminWithAuth'
import AdminDashBoard from '@/components/DashBoard/AdminDashBoard'
import React from 'react'

const Page = () => {
    return (<AdminDashBoard />)
}

export default adminWithAuth(Page , true)

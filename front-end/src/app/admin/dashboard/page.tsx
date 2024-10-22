'use client'

import adminWithAuth from '@/app/contexts/adminWithAuth'
import React from 'react'

const Page = () => {
    return (
    <div>
        Admin Dashboard
    </div>
    )
}

export default adminWithAuth(Page , true)

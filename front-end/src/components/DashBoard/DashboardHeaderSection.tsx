'use client'

import React, { useEffect, useState } from 'react'
import Boxes from '../cm/Boxes'
import userManagementService from '@/services/admin/userManagementService';
import usePosts from '@/hooks/customHooks/usePosts';

export default function DashboardHeaderSection() {
    const [ getTotalAccountsCount , setTotalAccountsCounts ] = useState<number>(0)
    const currentPage = 1
    const { newReports, totalPosts, fetchPosts } = usePosts({currentPage})

    const itemsData = [
        { title: "Accounts", value: getTotalAccountsCount},
        { title: "Posts", value: totalPosts,link:'/admin/dashboard/postManagement'},
        { title: "New Reports", value: newReports,
        badge:newReports,link:'/admin/dashboard/postManagement/reportes' }
    ];
    const getTotalAccounts = async() => {
        const getTotalAccounts = await userManagementService.getTotalAccounts()
        if(getTotalAccounts?.status){
            setTotalAccountsCounts(getTotalAccounts?.totalUsers)
        }
    }
    
    useEffect(() => {
        getTotalAccounts()
        fetchPosts(currentPage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

  return (
    <section about='Box data showing area'>
        <Boxes items={itemsData} ratio='w-1/3'/>
    </section>
  )
}

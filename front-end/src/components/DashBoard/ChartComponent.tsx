'use client'

import React, { useEffect, useState } from 'react'
import LineChartComponent from './charts/LineChart'
import PieChartComponent from './charts/PieChart'
import dashBoardService, {IChartDataPosts, IChartDataUsers } from '@/services/admin/dashboardService'
import aggregateData from '@/lib/utils/aggregateData'

export default function ChartComponent() {
    // to store to pass for filtering
    const [users, setUsers ] = useState<IChartDataUsers[] | []>()
    const [posts , setPosts ] = useState<IChartDataPosts[] | []>()
    // to store the filterdara and pass
    const [filteredUsers, setFilteredUsers ] = useState<IChartDataUsers[] | []>()
    const [filteredPosts , setFilteredPosts ] = useState<IChartDataPosts[] | []>()
    const [seletctedData , setSelectedData] = useState<'users' | 'posts'>('users')
    const [byPeriod , setByPeriod ] = useState<'Day' | 'Month' |'Year'>('Day')

    const getChartData =async () => {
        const response = await dashBoardService.getChartData()
        console.log('response of chat data :',response)
        if(response.status){
            setUsers(response?.data?.users)
            setPosts(response?.data?.posts)
            setFilteredPosts(response?.data?.posts)
            setFilteredUsers(response?.data?.users)
        }
    }

    useEffect(() => {
        getChartData()
    },[])

     function filterUsers() {
        const data = aggregateData({data:users as IChartDataUsers[],groupBy:byPeriod,dataType:seletctedData})
        console.log('filterd data users :',data)
        setFilteredUsers(data)
    }

    function filterPosts() {
        const data = aggregateData({data:posts as IChartDataPosts[],groupBy:byPeriod,dataType:seletctedData})
        console.log('filterd data posts :',data)
        setFilteredPosts(data)
    }

    useEffect(() => {
        filterPosts()
        filterUsers()
    },[byPeriod])
    // do a wat to pass the post , users data to chart
  return (
    <section about='chart area'>
            <div className='relative flex flex-wrap sm:flex-nowrap items-center justify-between w-full h-auto gap-3 '>
                <div className='w-full sm:w-4/6 h-96 border rounded-md scrollbar-hide'>
             {/* ----------------   filter sections --------------- */}
                <div className='flex w-full items-center justify-start gap-3 pl-4'>
                    {/* filter posts / accounts */}
                    <div className="form-control">
                        <label className="label cursor-pointer gap-2">
                          <span className="label-text">Accounts</span>
                          <input type="checkbox" onChange={() => setSelectedData('users')} checked={'users' === seletctedData   } className="checkbox checkbox-success " />
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer gap-2">
                          <span className="label-text">Posts</span>
                          <input type="checkbox" onChange={() => setSelectedData('posts')} checked={'posts' === seletctedData} className="checkbox checkbox-success" />
                        </label>
                    </div>
                    {/* filter Day / Month / Year */}
                    <div className="form-control">
                        <label className="label cursor-pointer gap-2">
                          <span className="label-text">Daily</span>
                          <input type="checkbox" checked={byPeriod === 'Day'} onChange={() => setByPeriod('Day')} className="checkbox checkbox-success" />
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer gap-2">
                          <span className="label-text">Monthly</span>
                          <input type="checkbox" checked={byPeriod === 'Month'} onChange={() => setByPeriod('Month')} className="checkbox checkbox-success" />
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer gap-2">
                          <span className="label-text">Yearly</span>
                          <input type="checkbox" checked={byPeriod === 'Year'} onChange={() => setByPeriod('Year')} className="checkbox checkbox-success" />
                        </label>
                    </div>
                </div>
                    {seletctedData === 'users' ? (
                        <LineChartComponent data={filteredUsers as IChartDataUsers[]} dataType='users'/>
                    ) : (
                        <LineChartComponent data={filteredPosts as IChartDataPosts[]} dataType='posts' />
                    )}
                    
                </div>
                <div className='w-full sm:w-2/6 h-96 border rounded-md'>
                    <PieChartComponent/>
                </div>
            </div>
    </section>
  )
}

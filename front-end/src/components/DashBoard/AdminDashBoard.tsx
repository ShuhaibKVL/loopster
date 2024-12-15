import React from 'react'
import TopLikedPosts from './TopLikedPosts';
import MostFollowedAccounts from './MostFollowedAccounts';
import { Suspense } from 'react';
import DashboardHeaderSection from './DashboardHeaderSection';
import ChartComponent from './ChartComponent';

export default function AdminDashBoard() {

  return (
    <div className='w-full min-h-screen p-2 flex flex-col gap-2'>
        <h1 className='font-semibold' >Dashboard</h1>
        <Suspense fallback={'loading'}>
            <DashboardHeaderSection />
        </Suspense>
        <Suspense fallback={'loading'}>
            <ChartComponent />
        </Suspense>
        <section about='Top posts / Top Accounts'>
            <div className='relative w-full h-auto flex flex-wrap sm:flex-nowrap gap-3 items-center justify-between'>
                {/* Top followers accoiunt */}
                <Suspense fallback={<div className='w-full sm:w-1/2 h-96 border rounded-md skeleton'></div>}>
                    <MostFollowedAccounts />
                </Suspense>
                {/* Most liked posts */}
                <Suspense fallback={<div className='w-full sm:w-1/2 h-96 border rounded-md skeleton'></div>}>
                    <TopLikedPosts />
                </Suspense>
                
            </div>
        </section>
        
    </div>
  )
}

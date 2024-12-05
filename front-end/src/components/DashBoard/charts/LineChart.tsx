'use client'

import { IChartDataPosts, IChartDataUsers } from '@/services/admin/dashboardService';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function LineChartComponent({data,dataType}:{data:IChartDataPosts[] | IChartDataUsers[],dataType:'users' | 'posts'}) {
  console.log('chart data inside the LinearCharComponent :',data,"dataType :",dataType)
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={dataType === 'posts' ? 'posts' :'users'} stroke="#8884d8" strokeDasharray="5 5" />
          {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" strokeDasharray="3 4 5 2" /> */}
        </LineChart>
      </ResponsiveContainer>
    );
}

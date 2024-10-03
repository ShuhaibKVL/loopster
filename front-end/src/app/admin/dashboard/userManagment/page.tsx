'use client'

import React, { useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getUsers } from '@/services/authServices/adminAuthService'


export default function page() {
    // const [ user , setUsers ] = useEffect([])
    let users ;

    const fetchUsers = async() => {
        users = await getUsers()
        console.log("response inside component :",users)
        // if(users){
        //     setUsers(users)
        // }
        
    }

    useEffect(() => {
        fetchUsers()
    },[])
    
    return (
    <div className='w-full p-5'>
        <h1 className='w-full text-center p-2'>User Managment</h1>
        <Table>
    <TableCaption>...</TableCaption>
    <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]"></TableHead>
      <TableHead>User</TableHead>
      <TableHead>email</TableHead>
      <TableHead>status</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium"><div className='w-10 h-10 rounded-full border bg-white'></div></TableCell>
      <TableCell>Adburahamn</TableCell>
      <TableCell>abdurahman@gmail.com</TableCell>
      <TableCell>active</TableCell>
      <TableCell className="text-right">
        <button className='bg-red-400 '>block</button>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>

    </div>
    )
}

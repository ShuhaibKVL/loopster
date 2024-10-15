'use client'

import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import userManagementService from '@/services/admin/userManagementService';
import Link from 'next/link';
import { IsignupUserInterface } from '@/app/utils/interfaces/IsignupUserInterface';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import adminWithAuth from '@/app/contexts/adminWithAuth';
import { confirmAction } from '@/app/components/ConfirmationModal';

const Page = () => {
    const [ users , setUsers] = useState<IsignupUserInterface[]>([])

    useEffect(() => {
      findUsers()
    },[])
  
    async function findUsers(){
      try {
        console.log('fin users function')
        const data = await userManagementService.getAllUsers();
        console.log('data:', data.userData);
        setUsers(data.userData); // Set userData correctly
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    
        

    async function handleBlock(userId:string,actionVerb :string ,fullName:string) {

      const willProceed = await confirmAction({
        title: `Confirm your action`,
        text: `Are you sure you want to ${actionVerb} ${fullName}?`,
        icon: 'warning',
      });

      if(willProceed){
        await userManagementService.handleBlockUnBlock(userId)
        findUsers()
      }
    }

    async function handleUnList(userId:string,actionVerb :string ,fullName:string) {

      const willProceed = await confirmAction({
        title: `Confirm your action`,
        text: `Are you sure you want to ${actionVerb} ${fullName}?`,
        icon: 'warning',
      });

      if(willProceed){
        await userManagementService.handleListUnList(userId)
        findUsers()
      }
    }

    console.log('users :',users)
    
    return (
    <div className='w-full p-5'>
        <h1 className='w-full text-center p-2'>User Management</h1>
        {users.length > 0 ? (
          <Table>
          <TableCaption>...</TableCaption>
          <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right mr-3 flex items-center justify-around ">Actions</TableHead>
          </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user:IsignupUserInterface) => (
              <TableRow key={user._id}>
              <TableCell className="font-medium"><div className='w-10 h-10 rounded-full border bg-white'></div></TableCell>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="text-right mr-3 flex justify-around items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <p onClick={() => handleBlock(user._id,user.isBlocked ?'unblock':'block',user.fullName)} className={`font-medium ${user.isBlocked ? 'text-red-600':'text-green-500' } transform transition-transform hover:scale-105 cursor-pointer`}>{user.isBlocked ? 'UnBlock': 'Block'}</p>
                  </TooltipTrigger>
                  <TooltipContent>
                    {user.isBlocked ? (
                      <p >Click to <span className='text-red-500'>unBlock</span> user</p>
                    ) : (
                      <p >Click to <span className='text-green-500'>Block</span> user</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <p onClick={() => handleUnList(user._id,user.isBlocked ?'List':'UnList',user.fullName)} className={`font-medium ${user.isList ? 'text-orange-500' : 'text-blue-600'} transform transition-transform hover:scale-105 cursor-pointer`}>{user.isList ? 'UnList' : 'List'}</p>
                  </TooltipTrigger>
                  <TooltipContent>
                  {user.isList ? (
                      <p >Click to <span className='text-green-500'>UnList</span> user</p>
                    ) : (
                      <p >Click to <span className='text-red-500'>List</span> user</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              </TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
        ) : (
          <p className='w-full text-center p-2'>No users found</p> // Display a message when no users
        )}
        <h1>PENDING TASK</h1>
        <h1>-----------------</h1>
        <h1>USER PROFILE UPDATE IMAGE UPDATE </h1>
        <h1>FOLLOW UNFOLLOW</h1>
        <h1>FOLLOWED / RECOMMENTED USERS</h1>  
    </div>
    )
}

export default adminWithAuth(Page , true)

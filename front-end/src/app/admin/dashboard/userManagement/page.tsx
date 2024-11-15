'use client'

import { confirmAction } from '@/components/cm/ConfirmationModal';
import Pagination from '@/components/cm/Pagination';
import AvatarSkelton from '@/components/skeltons/AvatarSkelton';
import adminWithAuth from '@/app/contexts/adminWithAuth';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { IsignupUserInterface } from '@/lib/utils/interfaces/IsignupUserInterface';
import userManagementService from '@/services/admin/userManagementService';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { useEffect, useState } from 'react';

const Page = () => {
    const [ users , setUsers] = useState<IsignupUserInterface[]>([])
    const [ totalPages , setTotalPages ]= useState(1)
    const [ currentPage , setCurrentPage ] =useState(1)

    useEffect(() => {
      findUsers()
    },[])
  
    async function findUsers(page=1){
      try {
        const data = await userManagementService.getAllUsers(page);
        setUsers(data?.userData?.users);
        setTotalPages(data?.userData?.totalPages)
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
        findUsers(currentPage)
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
        findUsers(currentPage)
      }
    }

    function onSelectPage(page:number){
        findUsers(page)
        setCurrentPage(page)
    }

    console.log('users :',users)
    
    return (
    <div className='w-full p-5 min-h-[90vh] flex flex-col justify-between'>
      <div>
        <h1 className='w-full text-center p-2'>User Management</h1>
        {users.length > 0 ? (
          <Table>
          <TableCaption></TableCaption>
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
              <TableCell className="font-medium">
                    <div className='w-10 h-10 rounded-full overflow-hidden'>
                      {user.profileImage ? 
                      (<Avatar>
                        <AvatarImage
                          src= {user?.profileImage}
                          alt="PR"
                        />
                        </Avatar>) :
                         (<AvatarSkelton />)
                         }
                    </div>
              </TableCell>
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
          <p className='w-full text-center p-2'>No users found</p>
        )}
        </div>
        <div className=''>
          <Pagination
          pages={totalPages}
          onSelect={onSelectPage}
          />
        </div>
    </div>
    )
}

export default adminWithAuth(Page , true)

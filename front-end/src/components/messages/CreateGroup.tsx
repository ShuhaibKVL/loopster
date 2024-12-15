'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { activeChat, ISelectedGroupUser } from './ChatLayout'
import SearchInput from '../cm/SearchInput'
import { CiCircleRemove } from 'react-icons/ci'
import AvatarComponent from '../cm/Avatar'
import { Button } from '../ui/button'
import { ISearchUsers } from '@/lib/utils/interfaces/ISeacrchUsers'
import { useToast } from '@/hooks/use-toast'
import userAuthService from '@/services/user/userAuthService'
import { useAppSelector } from '@/hooks/typedUseDispatch'
import { RootState } from '@/lib/redux/store/store'

interface CreateGroupProps{
  isOpenCreateGroup:boolean;
  setIsOpenCreateGroup:React.Dispatch<React.SetStateAction<boolean>>;
  setActiveChat:React.Dispatch<React.SetStateAction<activeChat | null>>
}

export default function CreateGroup({isOpenCreateGroup,setIsOpenCreateGroup,setActiveChat}:CreateGroupProps) {
  const [ groupUsers , setGroupUsers] = useState<ISelectedGroupUser[] | [] >([])
  const [ groupName , setGroupName  ] = useState('')
  const [ groupSearchInput , setGroupSearchInput ] = useState<string>('')
  const [userListByGroupSearch , setUserListByGroupSearch] = useState<ISearchUsers[]>([])
  const { toast} = useToast()
  const userId = useAppSelector((state:RootState) => state?.user?.userId)

  const SearchUsers =async(qeury:string,type:'group' | 'individual') => {
    const response = await userAuthService.search_followed_users(userId,qeury)
    if(type === 'group'){
      setUserListByGroupSearch(response?.users)
    }
  }

  useEffect(() => {
    if(groupSearchInput !== ''){
      SearchUsers(groupSearchInput,'group')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[groupSearchInput])

  const addUser = (userId:string,userName:string) => {
    const newuser:ISelectedGroupUser = {
      userId:userId,
      userName:userName
    }
    // Check if the user already exists in the groupUsers state
    setGroupUsers((prevUsers) => {
      const userExists = prevUsers.some((user) => user.userId === userId);
      if (!userExists) {
        return [...prevUsers, newuser]; // Add newUser if it doesn't exist
      }
      return prevUsers; // Return the previous state if user already exists
    });
  }

  const removeGroupUser = (userId:string) => {
    const filter = groupUsers.filter((user) => user?.userId !== userId)
    setGroupUsers(filter)
  }

  const createGroup = () => {
    console.log('groupUsers :',groupUsers,groupUsers.length)
      if(groupUsers.length < 2){
        toast({
          title: 'Failed',
          description:`Please choode at least two users to create a group.`,
          className:"toast-failed"
        })
      return
      }
      if(groupName === ''){
        toast({
          title: 'Failed',
          description:`Please create a group name`,
          className:"toast-failed"
        })
      return
      }

        const usersId = groupUsers.map((user) => user.userId); 
        console.log('the usersId :',usersId)
        usersId.push(userId)
        console.log('after added the logged id :',usersId)

        const data :activeChat = {
          chatType:'group',
          groupId:usersId,
          chatName:groupName
        }
        setActiveChat(data)

  }

  return (
    <Dialog open={isOpenCreateGroup} onOpenChange={setIsOpenCreateGroup}>
        <DialogContent className='min-h-64 p-2 w-[90vw] sm:w-[40vw]'>
            <DialogHeader>
            <DialogTitle className='hidden'>Create Group</DialogTitle>
            <DialogDescription className='h-full space-y-2 p-2'>
                <h1 className='w-full text-center font-semibold'>Create Group</h1>
                <p className='w-full text-center font-thin'>Select the users you want to create group</p>
                <div className='w-full min-h-14 bg-[var(--secondary-bg)] flex items-center justify-center'>
                  <SearchInput onInputChange={setGroupSearchInput}/>
                </div>

                <div className='w-full flex flex-wrap gap-2'>
                  {groupUsers && groupUsers.length > 0 && groupUsers.map((user,index) => (
                    <div key={index} className='relative flex gap-0 items-center justify-center p-3 bg-green-100 rounded-md'>
                      <p>{user?.userName}</p>
                      <CiCircleRemove
                      onClick={() => removeGroupUser(user?.userId)}
                       className='absolute top-0 right-0 text-red-500 w-4 h-4' />
                    </div>
                  ))}
                </div>

                <div className='w-full h-auto overflow-y-auto scrollbar-hide'>
                {userListByGroupSearch.length > 0 ? (
                  userListByGroupSearch.map((user) => (
                    <div key={user?._id} onClick={() => addUser(user?._id,user?.userName)} 
                    className='border-b p-2 hover:bg-[var(--hover-card)] duration-100'>
                      <div className='flex items-center space-x-2'>
                        <AvatarComponent imgUrl={user?.profileImage} />
                        <h1 className='font-semibold'>{user?.userName}</h1>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className='w-full text-center p-2'></p>
                )} 
                </div>
                <div className='w-full flex items-center justify-between space-x-2'>
                  <input type="text" 
                    className={`w-full border rounded-sm h-7 
                    ${groupName.length < 1 ? 'border-red-500' :''}`} 
                    placeholder='group name' value={groupName} 
                    onChange={(e) => setGroupName(e.target.value)} />
                  {groupUsers.length == 0  && groupName === '' ? (
                    <Button onClick={createGroup}>Create</Button>
                  ) : (
                    <Button onClick={createGroup}>Create</Button>
                  )}
                </div>
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
        </Dialog>
  )
}

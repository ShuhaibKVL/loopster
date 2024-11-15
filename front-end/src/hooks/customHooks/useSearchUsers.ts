import React, { useEffect, useState } from 'react'
import { RootState } from '@/lib/redux/store/store'
import userAuthService from '@/services/user/userAuthService'
import { ISearchUsers } from '@/lib/utils/interfaces/ISeacrchUsers'
import { useSelector } from 'react-redux'

const useSearchUsers = (query:string) => {
    // const userId = useSelector((state:RootState) => state?.user?.userId)
    const [users, setUsers ] = useState<null | ISearchUsers[]>(null)
    // const users = 100

    async function searchUsers(query:string) {
        // if(!userId || !query){
        //     return alert(`userId : ${userId} / query : ${query} one of is missing..!`)
        // }
        // const res = await userAuthService.search_followed_users(userId,query)
        // console.log('res in >>',res)
        // setUsers(res?.users)
    }

    // useEffect(() => {
    //     searchUsers(query)
    // },[query])np
    
  return { users , searchUsers }
}

export default useSearchUsers

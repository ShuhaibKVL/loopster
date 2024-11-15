import { IUserData } from '@/components/post_components/Post'
import { RootState } from '@/lib/redux/store/store'
import userAuthService from '@/services/user/userAuthService'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const useUserData =() => {
    const [ users , setUser ] = useState<IUserData[]>([])
    const userId = useSelector((state:RootState) => state.user.userId)

    async function fetchUsers() {
        const res = await userAuthService.getLatestUsers(userId)
        setUser(res.data)
    }
    
    useEffect(() => {
        fetchUsers()
    },[])

    return { users , fetchUsers }
}
export default useUserData;

//  i want to supporate the comment fetching function to custome hook  or centralize
import { IUserData } from '@/app/components/post_components/Post'
import { RootState } from '@/lib/redux/store/store'
import userAuthService from '@/services/user/userAuthService'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const useUserData =() => {
    const [ users , setUser ] = useState<IUserData[]>([])
    const userId = useSelector((state:RootState) => state.user.userId)

    async function fetchUsers() {
        console.log('fetch user custom hook invoked :',userId)
        const res = await userAuthService.getLatestUsers(userId)
        console.log('res :',res)
        setUser(res.data)
        console.log('users state updated inside the useUserData hook...',users)
    }
    

    useEffect(() => {
        fetchUsers()
    },[])

    useEffect(() => {
        console.log('users state updated useEffect :>>>',users)
    },[users])

    return { users , fetchUsers }
}
export default useUserData;


import { IPost } from '@/lib/utils/interfaces/IPost'
import postManagementService from '@/services/admin/postManagmentService'
import React, { useEffect, useState } from 'react'

export interface IPostTable extends IPost{
    _id:string
}
interface UsePostsProps{
    currentPage:number
}

export default function usePosts({currentPage}:UsePostsProps) {
    const [ posts , setPosts ] = useState<IPostTable[] | [] >([])
    const [ totalPosts , setTotalPosts ] = useState(0)
    const [ newReports , setNewReports ] = useState(0)
    const [ unListed , setUnListed ] = useState(0)
    const [ reported , setReported ] = useState(0)
    const [ totalPages , setTotalPages ]= useState<number>(2)
    
    async function fetchPosts(page:number) {
        const res = await postManagementService.fetchAllPosts(page)
        console.log('res in fetchPosts :',res)
        setPosts(res?.data?.posts?.posts)
        setTotalPosts(res?.data?.posts?.totalPosts)
        setNewReports(res?.data?.posts?.newReported)
        setUnListed(res?.data?.posts?.unListed)
        setReported(res?.data?.posts?.reported)
        setTotalPages(res?.data?.posts?.totalPages)
    }

    useEffect(() => {
        fetchPosts(currentPage)
    },[currentPage])

  return  { posts , totalPosts, newReports, unListed, reported, totalPages, fetchPosts}
}

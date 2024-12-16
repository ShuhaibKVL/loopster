
import { IPost } from '@/lib/utils/interfaces/IPost'
import postManagementService from '@/services/admin/postManagmentService'
import { useEffect, useState } from 'react'

export interface IPostTable extends IPost{
    _id:string
}
interface UsePostsProps{
    currentPage:number
}

export default function usePosts({currentPage}:UsePostsProps) {
    const [ posts , setPosts ] = useState<IPostTable[] | [] >([])
    const [ totalPosts , setTotalPosts ] = useState<number>(0)
    const [ newReports , setNewReports ] = useState<number>(0)
    const [ unListed , setUnListed ] = useState<number>(0)
    const [ reported , setReported ] = useState<number>(0)
    const [ totalPages , setTotalPages ]= useState<number>(2)
    
    async function fetchPosts(page:number) {
        const res = await postManagementService.fetchAllPosts(page)
        setPosts(res?.posts?.posts)
        setTotalPosts(res?.posts?.totalPosts)
        setNewReports(res?.posts?.newReported)
        setUnListed(res?.posts?.unListed)
        setReported(res?.posts?.reported)
        setTotalPages(res?.posts?.totalPages)
    }

    useEffect(() => {
        fetchPosts(currentPage)
    },[currentPage])

  return  { posts , totalPosts, newReports, unListed, reported, totalPages, fetchPosts}
}

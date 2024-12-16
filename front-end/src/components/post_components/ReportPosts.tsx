'use client'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from '@/components/ui/button'
import { IPostResponse } from '@/lib/utils/interfaces/IPost'
import { IReportResponse } from '@/lib/utils/interfaces/IReport'
import postManagementService from '@/services/admin/postManagmentService'
import reprtedManagementService from '@/services/admin/reportManagementService'
import { Terminal } from 'lucide-react'
import { useEffect, useState } from 'react'
import { IoIosWarning } from "react-icons/io"
import { confirmAction } from '../cm/ConfirmationModal'
import Pagination from '../cm/Pagination'
import SearchInput from '../cm/SearchInput'
import PostDataDrawer from './PostDataDrawer'


export default function ReportPosts() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ currentPage , setCurrentPage ] = useState(1)
    const [ repotes , setReports ] = useState<IReportResponse[] >([])
    const [ searchInput , setSearchInput ] = useState('')
    const [ isDrawerOpen , setIsDrawerOpen ] = useState<boolean>(false)
    const [ selectedReportes , setSelectedReportes ] = useState<IPostResponse | null>(null)
  
    const handleSearchInput = (value:string) => {
        setSearchInput(value)
    }
    console.log(searchInput)
    async function fetchReports() {
        const res = await reprtedManagementService.fetchReports()
        setReports(res?.data)
    }

    useEffect(() => {
        fetchReports()
    },[])

    function onSelectPage(page:number){
        setCurrentPage(page)
    }

    function handleAlertClick(report:IPostResponse){
        setSelectedReportes(report)
        setIsDrawerOpen(true)
    }

    async function handleActions(postId:string,reportId:string,type:string){
        const willProceed = await confirmAction({
            title: `Confirm your action`,
            text: `Are you sure you want to list / Unlist this posts?`,
            icon: 'warning',
          });
    
          if(willProceed){
            if(type === 'report'){
                await postManagementService.reportPost(postId,reportId)
            }else if(type === 'Later'){
                await reprtedManagementService.markAsReaded(reportId)
            }
            fetchReports()
          }
    }
  
  return (
    <div className='min-h-full w-full flex flex-col justify-between'>
    <div className='space-y-3'>
        <section className='flex items-center justify-center w-full gap-3'>
        <div className='w-2/4'>
            <SearchInput
            onInputChange={handleSearchInput}
            placeholder='Type to search...'
            />
        </div>
        </section>
        <div className='w-full space-y-2'>
        {repotes?.length > 0 ? 
        (
            repotes.map((report,index) => (
                <Alert
                key={index}
                className={`w-full ${report?.isRead ? 'bg-[var(--color-bg)]' : 
                    (index % 2 === 0 ? 'bg-yellow-100 hover:bg-yellow-200' :
                    'bg-orange-100 hover:bg-orange-200')}
                    cursor-pointer duration-75 overflow-hidden`}>
                <Terminal className="h-4 w-4" />
                <AlertTitle className='font-bold text-md'>{report?.reportType}</AlertTitle>
                <AlertDescription className='text-md'>
                    <div onClick={() => handleAlertClick(report?.post[0])} className='w-full'>
                        <p className='absolute right-2 top-0 font-mono'>
                            {new Date(report?.createdAt).toLocaleString()}
                        </p>
                        <IoIosWarning className='text-orange-600' />
                        <p ><span className='font-thin'>Post Id :</span>{report?.post[0]?._id}</p>
                        <p ><span className='font-thin'>User Id :</span>{report?.post[0]?.userId}</p>
                    </div>
                    
                    <Button 
                    onClick={() => handleActions(report?.postId,report?._id,'report')}
                    variant={'outline'} className='bg-orange-400 mr-2'>
                        {report?.post[0]?.isReported ? 'UnReport' : 'Report'}
                    </Button>
                    {!report?.isRead ? (
                        <Button
                        onClick={() => handleActions(report?.postId,report?._id,'Later')}
                        variant={'outline'} >
                            Later
                        </Button>
                    ):(null)}
                </AlertDescription>
            </Alert>
            ))
        ) : 
        (<p className='w-full text-center'>No new reports exceed</p>)}
        <div className='w-full'>
        <PostDataDrawer
                isOpen={isDrawerOpen}
                setIsOpen={setIsDrawerOpen}
                postData={selectedReportes as IPostResponse}
            />
        </div>
        
        </div>

    </div>
    
    <Pagination
    pages={1}
    onSelect={onSelectPage}
    />
    </div>
  )
}

'use client'

import usePosts from '@/hooks/customHooks/usePosts'
import postManagementService from '@/services/admin/postManagmentService'
import { ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { IoIosArrowRoundForward } from 'react-icons/io'
import Boxes from '../cm/Boxes'
import { confirmAction } from '../cm/ConfirmationModal'
import Pagination from '../cm/Pagination'
import SearchInput from '../cm/SearchInput'
import SelectComponent from '../cm/Select'
import Content from './Content'

const filterItems = ['Latest','Reported','Must Liked','views']

export default function PostTable() {
    const [ currentPage , setCurrentPage ] = useState(1)
    const { posts, newReports, totalPosts, reported, unListed, totalPages, fetchPosts } = usePosts({currentPage})
    const [ searchInput , setSearchInput ] = useState('')
    const [ selectedFilter , setSelectedFilter ] = useState('')
    

    const handleSearchInput = (value:string) => {
        setSearchInput(value)
    }

    const onSelectChange = (value:string) => {
        setSelectedFilter(value)
    }

    const itemsData = [
        { title: "Total Posts", value: totalPosts},
        { title: "Reported Posts", value: reported},
        { title: "UnListed Posts", value: unListed },
        { title: "Reports Request", value: newReports,
        badge:newReports,link:'/admin/dashboard/postManagement/reportes' }
    ];

    const handleListUnList = async (postId:string) => {
        const willProceed = await confirmAction({
            title: `Confirm your action`,
            text: `Are you sure you want to list / Unlist this posts?`,
            icon: 'warning',
          });
    
          if(willProceed){
            await postManagementService.listUnList(postId)
            fetchPosts(currentPage)
          }
    }

    function onSelectPage(page:number){
        console.log('page inside the parent is :',page)
        setCurrentPage(page)
    }
  
  return (
    <>
    <Boxes
    items={itemsData}
    />
    {/* <section className='flex items-center justify-center w-full gap-3'>
        <SelectComponent 
            items={filterItems}
            label='Selct to filter.'
            onSelect={onSelectChange}
        />
        <div className='w-2/4'>
            <SearchInput
            onInputChange={handleSearchInput}
            placeholder='Type to search...'
            />
        </div>
    </section> */}
    
    {posts.length > 0 ?
        (
         posts.map((post) => (
           <div className='relative w-full border p-5 grid gap-2 rounded-md overflow-hidden md:grid-cols-2 lg:grid-cols-3 hover:bg-[var(--hover-card)] duration-100 cursor-pointer'>
         {/* Media section */}
         <div className='min-h-40 max-w-52 max-h-52'>
           {post?.mediaType === 'image' ? (
             <div className='w-full aspect-square overflow-hidden'>
               <Image
                 src={`${post?.mediaUrl}`}
                 alt={`${post?._id}`}
                 className="w-full h-full rounded-md object-cover"
                 width={200}
                 height={200}
                 layout='responsive'
                 priority
               />
             </div>
           ) : post?.mediaType === 'video' ? (
             <video
               src={`${post?.mediaUrl}`}
               className="w-full rounded-md aspect-video"
               loop
               muted
               controls
               playsInline
             />
           ) : (
             <div className='w-full aspect-square flex items-center justify-center border rounded-md'>
               <ImageIcon className='text-[var(--color-bg)]' />
             </div>
           )}
         </div>
         {/* Content section */}
         <div className='w-full'>
           {/* <p dangerouslySetInnerHTML={{ __html: post?.content }}></p> */}
           <Content content={post?.content} fonts={250} />
         </div>
         {/* Info section */}
         <div className='relative w-full space-y-2 felx flex-col items-start '>
           <p className='absolute right-0'>{new Date(post?.createdAt as string).toLocaleDateString()}</p>
           <p>likes : 0</p>
           <p className={`${post?.isList ? 'text-green-500 border-green-600 cursor-pointer' :
            'text-red-600 border-red-500'}
             px-3 hover:border w-fit rounded-sm shadow-sm`}
             onClick={() => handleListUnList(post?._id)}
             >{post?.isList ? 'UnList' : 'List'}</p>
         </div>
         {/* Arrow button section */}
         <div className='absolute right-2 bottom-2 p-2 rounded-sm border hover:bg-[var(--color-bg)] duration-75' >
            <Link href={`/admin/dashboard/postManagement/postDetails?postId=${post?._id}`}>
              <IoIosArrowRoundForward className='w-5 h-5' />
            </Link>
         </div>
       </div>
         ))
        ) : 
        (<p>Loading...</p>)
    }
    <Pagination
    pages={totalPages}
    onSelect={onSelectPage}
    />
    </>
  )
}

'use cleint'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from '@/hooks/typedUseDispatch';
import { useToast } from '@/hooks/use-toast';
import { RootState } from '@/lib/redux/store/store';
import { IReport, reportTypes } from '@/lib/utils/interfaces/IReport';
import { IPostProps } from '@/lib/utils/interfaces/PostProps';
import postService from '@/services/user/post/postServices';
import { QueryObserverResult } from '@tanstack/react-query';
import { useState } from 'react';
import DropdownMenu from '../cm/DropDownMenu';
import UserHeader from "../user_components/UserHeader";
import PostContentContainer from './PostContentContainer';


export interface IUserData {
    _id:string,
    fullName:string,
    userName:string,
    profileImage:string,
    follow:number,
    followers:number,
    isFollowed:boolean,
    followedCount:number,
    followersCount:number
}

import { InfiniteData } from '@tanstack/react-query';
import EditPost from "./EditPost";
import { IPostResponse } from "@/lib/utils/interfaces/IPost";
import { confirmAction } from "../cm/ConfirmationModal";

export interface PostProps {
    postData: IPostProps;
    refetchPosts: () => Promise<void> | (() => Promise<QueryObserverResult<InfiniteData<{ posts: any; hasMore: boolean }>, Error>> );
}

export default function Post({postData ,refetchPosts}:PostProps){
    
    const { toast } = useToast()
    const dispatch = useAppDispatch()
    const userId = useAppSelector((state:RootState) => state?.user?.userId)
    const [ isOpen , setIsOpen ] = useState<boolean>(false)
    const [ currentPost , setCurrentPost ] = useState<IPostResponse | null>(null)

    const handleReport = () => {
        setIsOpen(true)
    }

    const onSetSelectReport = async (item:string,postId:string) => {
        
        if(!item || !postId || !userId){
            toast({
                title: 'Failed',
                description:`Credentials are missing..!`,
                className:"toast-failed"
            })
            return
        }
        else if(item){
            setIsOpen(false)
            try {
                const newReport:IReport = {
                    postId:postId,
                    userId:userId,
                    reportType:item
                }

                const response = await postService.report(newReport)
                console.log('response :',response)
                if(response){
                    toast({
                        title: 'Sussessfull',
                        description:`Image reported successfully.`,
                        className:"toast-success"
                    })
                    await refetchPosts()
                    return
                }
                if(!response){
                    toast({
                        title: 'Failed',
                        description:`Failed to report image. Please try again`,
                        className:"toast-failed"
                    })
                    return
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

     // Handel post delete
     const handleDelete = async (postId:string) => {

        const willProceed = await confirmAction({
            title: `Are you sure to delete ?`,
            text: `Once deleted, you are not able to return..!`,
            icon: 'warning',
        });
        if(willProceed){
            const response = await postService.deletePost(postId)
            console.log('post delete response :',response)
            if(response?.status){
                toast({
                    title: 'Failed',
                    description: response?.message,
                    className:"toast-failed"
                })
            }
            await refetchPosts()
        }
    }

    // Handel post delete
    const handleEdit = async (post:IPostResponse) => {
        setCurrentPost(post)
         setIsOpen(true)
    }
    return (
        <div className='relative w-full min-h-48 border-b rounded-sm p-2'>
            <div className='absolute right-0'>
            <DropdownMenu
                options={
                    userId === postData?.userId ? (
                        [
                            { label: 'Delete', action: () => handleDelete(postData?._id) },
                            { label: 'Edit', action: () => handleEdit(postData) }
                        ]
                    ) : (
                        [{ label: 'Report', action: handleReport }]
                    )
                    }
                    postId={postData?._id}
            />
            </div>
            <UserHeader imgUrl={postData?.user?.profileImage} fullName={postData?.user?.fullName}
            userName={postData?.user?.userName} follow={postData?.followedCount} followers={postData?.followersCount}
            _id={postData?.userId} isFollowed={postData?.isFollowed} followedCount={postData?.followedCount}
            followersCount={postData?.followersCount}
            refetchPosts={refetchPosts}
            />
            
            <PostContentContainer
            key={postData?._id}
            content={postData?.content}
            mediaUrl={postData?.mediaUrl}
            time={postData?.createdAt}
            mediaType={postData?.mediaType}
            postId={postData?._id}
            userId={postData?.userId}
            isLiked={postData?.isLiked}
            isBookMarked={postData?.isBookMarked}
            likeCount={postData?.likeCount as number}
            refetchPosts={refetchPosts}

            />

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild> 
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle className='text-center text-red-500'>Report</DialogTitle>
                    <DialogDescription>
                        <div className='w-full p-5 flex flex-col justify-around gap-1'>
                            <h1 className='font-medium text-sm p-2 rounded-sm text-gray-500'>Your report is anonymous.Your reported post would be hide and review by admin.</h1>
                            {reportTypes.length > 0 ? (
                                reportTypes.map((item,index) => (
                                    <p key={index} onClick={() => onSetSelectReport(item,postData?._id)}
                                    className='hover:bg-[var(--color-bg)] duration-75 text-md cursor-pointer'
                                    >{item}</p>
                                ))
                            ) : (null)}
                        </div>
                    </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            <EditPost
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                postData={currentPost as IPostResponse}
                userId={userId}
                getUserData={refetchPosts}
            />
        </div>
    )
}

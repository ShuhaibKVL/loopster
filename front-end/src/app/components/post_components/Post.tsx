import React from 'react'
import UserHeader from '../user_components/UserHeader'
import PostContentContainer from './PostContentContainer';
import { IPostProps } from '@/app/utils/interfaces/PostProps';
import postService from '@/services/user/post/postServices';
import DropdownMenu from '../DropDownMenu';
import { confirmAction } from '../ConfirmationModal';
import { useToast } from '@/hooks/use-toast'
import { useAppDispatch, useAppSelector } from '@/hooks/typedUseDispatch';
import { fetchLatestPosts } from '@/lib/redux/features/postSlice';
import { RootState } from '@/lib/redux/store/store';

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

export interface PostProps {
    postData:IPostProps ;
    onUserUpdate : () => void
}

export default async function Post({postData , onUserUpdate}:PostProps){
    
    const { toast } = useToast()
    const dispatch = useAppDispatch()
    const userId = useAppSelector((state:RootState) => state?.user?.userId)

    const handleDelete = async () => {
        const postId = postData?._id
        const willProceed = await confirmAction({
            title: `Are you sure to delete ?`,
            text: `Once deleted, you are not able to return..!`,
            icon: 'warning',
        });
        if(willProceed){
            const response = await postService.deletePost(postId)
            console.log('post delete response :',response)
            if(response?.status === false){
                toast({
                    title: 'Failed',
                    description: response?.message,
                    className:"toast-failed"
                })
            }else if (response){
                toast({
                    title: 'Success',
                    description: response?.message,
                    className:"toast-success"
                })
                dispatch(fetchLatestPosts(userId))
            }
        } 
    }

    const handleReport = () => {
        console.log('report post')
    }

    return (
        <div className='relative w-full min-h-48 border-2 rounded-md p-2'>
            <div className='absolute right-0'>
            <DropdownMenu
                    options={[
                        { label: 'Delete', action: handleDelete },
                        { label: 'Report', action: handleReport },
                    ]}
            />
            </div>
            <UserHeader imgUrl={postData?.user?.profileImage} fullName={postData?.user?.fullName}
            userName={postData?.user?.userName} follow={postData?.followedCount} followers={postData?.followersCount}
            _id={postData?.userId} isFollowed={postData?.isFollowed} followedCount={postData?.followedCount}
            followersCount={postData?.followersCount}
            onUserUpdate={onUserUpdate} 
            />
            
            <PostContentContainer
            key={postData?._id}
            content={postData?.content}
            mediaUrl={postData?.mediaUrl}
            time={postData?.createdAt}
            mediaType={postData?.mediaType}
            />

        </div>
    )
}

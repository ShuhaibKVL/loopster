'use client'

import React, { Suspense, useEffect } from 'react'
import Image from 'next/image'
import defaultProfile from '../../../../public/Images/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg'
import { Button } from '@/components/ui/button'
import {Pencil2Icon  } from '@radix-ui/react-icons'
import {UploadIcon} from '@radix-ui/react-icons'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store/store'
import withAuth from '@/app/contexts/withAuth'
import { useState } from 'react'
import { useRef } from 'react'
import userAuthService from '@/services/user/userAuthService'
import { ISignUp_user } from '@/app/(auth)/signUp/page'
import Form from '@/app/components/Form'
import { editProfileSchema } from '../../../lib/utils/validationSchemas'
import { ValidationError } from 'yup'
import { useToast } from '@/hooks/use-toast'
import { confirmAction } from '@/app/components/ConfirmationModal'
import { IUserWithCounts } from '../../../lib/utils/interfaces/IUserWIthCounts'
import PostContentContainer from '@/app/components/post_components/PostContentContainer'
import ReusableDropdown from '@/app/components/DropDownMenu'
import postService from '@/services/user/post/postServices'
import FollowUnFollow from '@/app/components/user_components/FollowUnFollow'
import PostContentSkeleton from '@/app/components/skeltons/PostContentSkeleton'
import EditPost from '@/app/components/post_components/EditPost'
import { IPostResponse } from '@/lib/utils/interfaces/IPost'


const Page = () => {
    const dispatch = useDispatch()
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const userId = useSelector((state:RootState) => state.user.userId)

    const [userData, setUserData] = useState<IUserWithCounts | null>(null);
    const [ profileImage , setProfileImage ] = useState(userData?.profileImage || defaultProfile)
    const [ editProfileModal ,setEditProfileModal] = useState('hidden')
    const [ error , setError ] = useState('')
    const  { toast } = useToast()
    const [ isOpen , setIsOpen ] = useState(false)
    const [ currentPost , setCurrentPost ] = useState<IPostResponse | null>(null)

    const editUserFields = [
        {name:'fullName',type:"text",label:"Full Name",placeHolder:`${userData?.fullName}`, value:`${userData?.fullName}` },
        {name:'userName',type:"text",label:"User Name",placeHolder:`${userData?.userName}`, value:`${userData?.userName}` },
        {name:'email',type:"email",label:"Email",placeHolder:`${userData?.email}` ,value:`${userData?.email}`}
    ]

    const editPostFields = [
        {name:'fullName',type:"text",label:"Full Name",placeHolder:`${userData?.fullName}`, value:`${userData?.fullName}` },
        {name:'userName',type:"text",label:"User Name",placeHolder:`${userData?.userName}`, value:`${userData?.userName}` },
        {name:'email',type:"email",label:"Email",placeHolder:`${userData?.email}` ,value:`${userData?.email}`}
    ]

    async function getUserData(userId :string){
        const user = await userAuthService.user(userId)
        setUserData(user?.userData[0])
    }

    useEffect(() => {
        if(userId){
            getUserData(userId)
        }
    },[userId])

    useEffect(() => {
        if (userData?.profileImage) {
            setProfileImage(userData.profileImage)
        }
    }, [userData])

    useEffect(() => {
        setTimeout(() => {
            setError('')
        },3000)
    },[error])


    const handleUploadClick = () => {
        fileInputRef.current?.click() // Trigger the file input click
    }

    const handleFileChange = async (event:React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if(file){
            const formData = new FormData()
            formData.append('profileImage',file)
            try {
                const willProceed = await confirmAction({
                    title: `Confirm your action`,
                    text: `Are you sure you to update profile image ?`,
                    icon: 'warning',
                });
            
                if(willProceed){
                    const update = await userAuthService.uploadProfileImg(userId,formData)
                    console.log('update :',update)
                if(update.status){
                    getUserData(userId)
                    toast({
                        title: 'Success',
                        description:`${userData?.fullName} data updated successfully`,
                        className:"toast-success"
                    })
                }else{
                    toast({
                        title: 'Failed',
                        description:`${userData?.fullName} data not updated. Try again`,
                        className:"toast-failed"
                    })
                }
                }

            } catch (error) {
                console.log(error)
            }
        }
    }

    //trigger the edit form container
    async function handleEditContainer(){
            setEditProfileModal(editProfileModal === 'hidden' ? 'block' : 'hidden')
    }

    async function handleModalSubmit(formData:any){
        try {
            console.log('formData :',formData)
            await editProfileSchema.validate(formData, {abortEarly:true})
            const updateProfile = await userAuthService.editProfile(userId,formData)
            console.log(updateProfile)
            if(updateProfile.status){
                handleEditContainer()
                getUserData(userId)
                toast({
                    title: 'Success',
                    description:`${userData?.fullName} data updated successfully`,
                    className:"toast-success"
                })
            }else{
                toast({
                    title: 'Failed',
                    description:`${userData?.fullName} data not updated. Try again`,
                    className:"toast-failed"
                })
            }
        } catch (error) {
            if(error instanceof ValidationError) {
                const validationErrors = error.inner.map((err:any) => err.message).join(', ')
                console.log("validationErrors :",error,"<>",error.message)
                setError(error.message)
                return
            }
            console.log(error)
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
            getUserData(userId)
        }
    }

    // Handel post delete
    const handleEdit = async (post:IPostResponse) => {
        setCurrentPost(post)
         setIsOpen(true)
    }
    
    return (
    <div className='p-5 space-y-2 sm:space-y-10'>
        <div className="relative w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] m-auto group overflow-hidden rounded-full">
            <Image
            src={userData?.profileImage || defaultProfile}
            width={250}
            height={250}
            className="border rounded-full shadow-sm hover:opacity-80"
            objectFit='contain'
            alt="Profile Image"
            />
            <UploadIcon
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={handleUploadClick}
            />
            <input
            title='upload image'
            type='file'
            ref={fileInputRef}
            accept='image/*'
            onChange={handleFileChange}
            className='hidden'
            />
        </div>

    {/* Follow / Following section */}
    <section className='flex items-center justify-center gap-x-9 w-full'>
        <FollowUnFollow
        follow={Number(userData?.counts?.followedCount)}
        followers={Number(userData?.counts?.followersCount)}
        />
    </section>
        {/* user Details and edit section */}
        <div className='relative p-5 border rounded-lg space-y-1 overflow-hidden'>
            <Button onClick={handleEditContainer} className='border-2 absolute right-5 ' variant={'destructive'} size='icon'>
                <Pencil2Icon />
            </Button>
            <section>
                <h2 className='font-bold'>{userData?.userName}</h2>
                <p className='font-thin'>@{userData?.fullName}</p>
            </section>
        </div>
        {/* Edit profile container */}
        <div className={`relative editProfileModal ${editProfileModal} border rounded-md p-5`}>
            <button className='absolute right-5' onClick={handleEditContainer}>close</button>
            <h3 className='w-full text-center'>Edit Profile</h3>
            <p className='w-full h-10 text-center text-red-500'>{error}</p>
            <Form fields={editUserFields} onSubmit={handleModalSubmit} />
        </div>
        {/* User Posts */}
        <section>
            <h2 className='w-full p-2 text-center border rounded-lg mb-2 bg-[var(--color-bg)]'>Your Posts</h2>
            <div className='flex flex-col rounded-sm gap-2 p-2'>
            
                {userData?.posts.length !== 0 ? (
                    userData?.posts.map((post) => (
                        <div className='relative'>
                            <div className='absolute z-10 sm:top-2 -right-2'>
                            <ReusableDropdown
                                options={[
                                    { label: 'Delete', action: () => handleDelete(post?._id) },
                                    { label: 'Edit', action: () => handleEdit(post) }

                                ]}
                                postId={post?._id}
                            />
                            </div>
                            <Suspense fallback={<PostContentSkeleton />}>
                                <PostContentContainer 
                                    key={post?._id}
                                    mediaUrl={post?.mediaUrl}
                                    content={post?.content}
                                    mediaType={post?.mediaType}
                                    time={post?.createdAt}
                                    postId={post?._id}
                                    userId={post?.userId}
                                    
                                />
                            </Suspense>
                            <EditPost
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            postData={currentPost as IPostResponse}
                            />
                        </div>
                        
                    ))
                ) : (
                    <p>No more posts</p>
                )}
            </div>
        </section>
        
    </div>
    )
}

export default withAuth(Page,true)

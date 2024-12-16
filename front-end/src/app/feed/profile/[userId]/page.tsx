'use client'

import { confirmAction } from '@/components/cm/ConfirmationModal'
import Form from '@/components/cm/Form'
import { Button } from '@/components/ui/button'
import FollowUnFollow from '@/components/user_components/FollowUnFollow'
import { useToast } from '@/hooks/use-toast'
import { RootState } from '@/lib/redux/store/store'
import userAuthService from '@/services/user/userAuthService'
import { Pencil2Icon, UploadIcon } from '@radix-ui/react-icons'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { ValidationError } from 'yup'
import { IUserWithCounts } from '../../../../lib/utils/interfaces/IUserWIthCounts'
import { editProfileSchema } from '../../../../lib/utils/validationSchemas'
import defaultProfile from '../../../../../public/Images/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg'
import DefaultPosts from '@/components/post_components/profile/DefaultPosts'
import { useAppDispatch, useAppSelector } from '@/hooks/typedUseDispatch'
import { RiListSettingsLine } from "react-icons/ri";
import Link from 'next/link'
import { getProfileUserData } from '@/lib/redux/features/storySlice'
import UnFollowHandleButton from '@/components/user_components/UnFollowHandelButton'
import FollowHandleButton from '@/components/user_components/FollowHandleButton'
import FollowRequest from '@/components/user_components/FollowRequest'

const Page = ({params}:{params:{userId:string}}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const loginedUserId = useSelector((state:RootState) => state.user.userId)

    const userId = params?.userId || loginedUserId // to track the current profile opened userId
    
    const userData = useAppSelector((state:RootState) => state?.stories?.profileUserData)
    const [ editProfileModal ,setEditProfileModal] = useState('hidden')
    const [ error , setError ] = useState('')
    const  { toast } = useToast()
    const dispatch = useAppDispatch()

    const editUserFields = [
        {name:'fullName',type:"text",label:"Full Name",placeHolder:`${userData?.fullName}`, value:`${userData?.fullName}` },
        {name:'userName',type:"text",label:"User Name",placeHolder:`${userData?.userName}`, value:`${userData?.userName}` },
        {name:'email',type:"email",label:"Email",placeHolder:`${userData?.email}` ,value:`${userData?.email}`}
    ]

    async function getUserData(){   
        dispatch(getProfileUserData(userId))
    }

    useEffect(() => {
        if(userId){
            getUserData()    
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[userId,params])

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
                    const update = await userAuthService.uploadProfileImg(loginedUserId,formData)
                if(update?.status){
                    getUserData()
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

            } catch (error:unknown) {
                console.log(error)
            }
        }
    }

    //trigger the edit form container
    async function handleEditContainer(){
            setEditProfileModal(editProfileModal === 'hidden' ? 'block' : 'hidden')
    }

    async function handleModalSubmit(formData:FormData){
        try {
            await editProfileSchema.validate(formData, {abortEarly:true})
            const updateProfile = await userAuthService.editProfile(loginedUserId,formData)
            if(updateProfile?.status){
                handleEditContainer()
                getUserData()
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
                error.inner.map((err:Error) => err.message).join(', ')
                setError(error.message)
                return
            }
        }
    }

    
    return (
    <div className='p-5 space-y-2 sm:space-y-10'>
        {/* the settings drop down */}
        {/* <ProfileDropDown /> */}
        {userId === loginedUserId && (
            <div className='relative w-full h-7 overflow-hidden'>
            <div className='absolute right-0' title='Settings'>
                <Link href={'/feed/settings'} ><RiListSettingsLine/></Link>
            </div>
            </div>
        )}
        
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
            className={`absolute top-1/2 left-1/2 ${userId !== loginedUserId && 'hidden'} transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
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
            {(userData?.isPrivateAccount && userId === loginedUserId ||
                userData?.isPrivateAccount && userData?.followsData?.followers?.includes(loginedUserId) ||
                !userData?.isPrivateAccount
            ) ? (
                <FollowUnFollow
                follow={Number(userData?.followsData?.counts?.followedCount)}
                followers={Number(userData?.followsData?.counts?.followersCount)}
                profileUserId={userId}
                />
            ) : (
                <div className='flex items-center justify-center gap-x-1 w-full mt-2'>
                    <div className='space-y-1'>
                    <p className='px-1 rounded-lg py-1 font-mono'>Following</p>
                    <p className='text-center cursor-pointer'>{userData?.followsData?.counts?.followedCount}</p>
                    </div>
                    <div className='space-y-1'>
                    <p className='px-1 rounded-lg py-1 font-mono'>Followers</p>
                    <p className='text-center cursor-pointer'>{userData?.followsData?.counts?.followersCount}</p>
                    </div>
                </div> 
            )}
        </section>

        <section about='follow button'>
            {userId !== loginedUserId && (
                userData?.requestPendingFollows?.includes(loginedUserId) ? (
                    <FollowRequest refetchPosts={getUserData} following={userId} isButton isFromProfile />
                ) :
                userData?.followsData?.followers?.includes(loginedUserId) ? (
                    <UnFollowHandleButton refetchPosts={getUserData} following={userId} isButton isFromProfile />
                ) : (
                    <FollowHandleButton  refetchPosts={getUserData} following={userId} isButton isFromProfile/>
                )
            )}
        </section>

        {/* user Details and edit section */}
        <div className='relative p-5 border rounded-lg space-y-1 overflow-hidden'>
            <Button onClick={handleEditContainer} className={`border-2 absolute right-5 ${userId !== loginedUserId && 'hidden'} `} variant={'destructive'} size='icon'>
                <Pencil2Icon />
            </Button>
            <section>
                <h2 className='font-bold'>{userData?.userName}</h2>
                <p className='font-thin'>@{userData?.fullName}</p>
                <p className='text-md text-gray-800'>{userData?.isPrivateAccount ? 'Private Account':null}</p>
            </section>
        </div>

        {/* Edit profile container */}
        <div className={`relative editProfileModal ${editProfileModal} border rounded-md p-5`}>
            <button className='absolute right-5' onClick={handleEditContainer}>close</button>
            <h3 className='w-full text-center'>Edit Profile</h3>
            <p className='w-full h-10 text-center text-red-500'>{error}</p>
            <Form fields={editUserFields} onSubmit={handleModalSubmit} />
        </div>

        {/* -------------  Users post default view -------------- */}
        
        {(userData?.isPrivateAccount && userId === loginedUserId ||
         userData?.isPrivateAccount && userData?.followsData?.followers?.includes(loginedUserId) ||
        !userData?.isPrivateAccount) && (
            <DefaultPosts userData={userData as IUserWithCounts} />
        )}
    </div>
    )
}
export default Page
// export default withAuth(Page,true)

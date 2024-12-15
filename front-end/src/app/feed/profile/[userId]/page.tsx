'use client'

import withAuth from '@/app/contexts/withAuth'
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
import Setting from '@/components/cm/Setting'
import DefaultPosts from '@/components/post_components/profile/defaultPosts'

const Page = ({params}:{params:{userId:string}}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const loginedUserId = useSelector((state:RootState) => state.user.userId)

    const userId = params?.userId || loginedUserId
    
    const [userData, setUserData] = useState<IUserWithCounts | null>(null);
    const [ profileImage , setProfileImage ] = useState(userData?.profileImage || defaultProfile)
    const [ editProfileModal ,setEditProfileModal] = useState('hidden')
    const [ error , setError ] = useState('')
    const  { toast } = useToast()

    const editUserFields = [
        {name:'fullName',type:"text",label:"Full Name",placeHolder:`${userData?.fullName}`, value:`${userData?.fullName}` },
        {name:'userName',type:"text",label:"User Name",placeHolder:`${userData?.userName}`, value:`${userData?.userName}` },
        {name:'email',type:"email",label:"Email",placeHolder:`${userData?.email}` ,value:`${userData?.email}`}
    ]

    async function getUserData(){
        const user = await userAuthService.user(userId)
        console.log('user data :',user)
        setUserData(user?.userData[0])
    }

    useEffect(() => {
        if(userId){
            getUserData()
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
                    const update = await userAuthService.uploadProfileImg(loginedUserId,formData)
                    console.log('update :',update)
                if(update.status){
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
            const updateProfile = await userAuthService.editProfile(loginedUserId,formData)
            console.log(updateProfile)
            if(updateProfile.status){
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
                const validationErrors = error.inner.map((err:any) => err.message).join(', ')
                console.log("validationErrors :",error,"<>",error.message)
                setError(error.message)
                return
            }
            console.log(error)
        }
    }

    
    return (
    <div className='p-5 space-y-2 sm:space-y-10'>
        <Setting />
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
        <FollowUnFollow
            follow={Number(userData?.counts?.followedCount)}
            followers={Number(userData?.counts?.followersCount)}
        />
    </section>
        {/* user Details and edit section */}
        <div className='relative p-5 border rounded-lg space-y-1 overflow-hidden'>
            <Button onClick={handleEditContainer} className={`border-2 absolute right-5 ${userId !== loginedUserId && 'hidden'} `} variant={'destructive'} size='icon'>
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

        {/* -------------  Users post deault view -------------- */}
            <DefaultPosts userData={userData as IUserWithCounts} />
            
    </div>
    )
}

export default withAuth(Page,true)

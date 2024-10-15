'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import defaultProfiel from '../../../../public/Images/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg'
import { Button } from '@/components/ui/button'
import {Pencil2Icon  } from '@radix-ui/react-icons'
import {UploadIcon} from '@radix-ui/react-icons'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/lib/redux/features/auth/userSlice'
import { RootState } from '@/lib/redux/store/store'
import withAuth from '@/app/contexts/withAuth'
import { useState } from 'react'
import { useRef } from 'react'
import userAuthService from '@/services/user/userAuthService'
import { ISignUp_user } from '@/app/(auth)/signUp/page'
import Form from '@/app/components/Form'
import { editProfileSchema } from '@/app/utils/validationSchemas'
import { ValidationError } from 'yup'
import Toast from '@/app/components/Toast'
import { title } from 'process'
import { useToast } from '@/hooks/use-toast'
import { confirmAction } from '@/app/components/ConfirmationModal'
import { IUserWithCounts } from '@/app/utils/interfaces/IUserWIthCounts'



const Page = () => {
    const dispatch = useDispatch()
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const userId = useSelector((state:RootState) => state.user.userId)

    const [userData, setUserData] = useState<IUserWithCounts | null>(null);
    const [ profileImage , setProfileImage ] = useState(userData?.profileImage || defaultProfiel)
    const [ editProfileModal ,setEditProfileModal] = useState('hidden')
    const [ error , setError ] = useState('')
    const  { toast } = useToast()

    const editUserFields = [
        {name:'fullName',type:"text",label:"Full Name",placeHolder:`${userData?.fullName}`, value:`${userData?.fullName}` },
        {name:'userName',type:"text",label:"User Name",placeHolder:`${userData?.userName}`, value:`${userData?.userName}` },
        {name:'email',type:"email",label:"Email",placeHolder:`${userData?.email}` ,value:`${userData?.email}`}
    ]

    async function getUserData(userId :string){
        const user = await userAuthService.user(userId)
        console.log(user,"<< user ")
        setUserData(user?.userData[0])
        console.log('user data :>>>...',userData)
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

    function handleLogout(){
        console.log('handle logout function invoked')
        dispatch(logout())
    }

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
    
    return (
    <div className='p-5 space-y-10'>
        <div className="relative w-[250px] h-[250px] m-auto group overflow-hidden">
        <Image
        
        src={userData?.profileImage || defaultProfiel}
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
    <div className='space-y-2'>
        <p className='px-5 border rounded-lg py-1 font-bold'>Following</p>
        <p className='text-center'>{userData?.counts?.followedCount}</p>
    </div>
    <div className='space-y-2'>
        <p className='px-5 border rounded-lg py-1 font-bold'>Followers</p>
        <p className='text-center'>{userData?.counts?.followersCount}</p>
    </div>
    </section>
        {/* user Details and edit section */}
        <div className='relative p-5 border rounded-sm space-y-1 overflow-hidden'>
            <Button onClick={handleEditContainer} className='border-2 absolute right-5 ' variant={'ghost'} size='icon'>
                <Pencil2Icon />
            </Button>
            <section>
                <h2 className='font-bold'>{userData?.userName}</h2>
                <p className='font-thin'>@{userData?.fullName}</p>
            </section>
            <pre>
                Lorem ipsum dolor, sit amet consectetur,
            </pre>
            <pre>
                adipisicing elit. Mollitia nam inventore,
            </pre>
            <button className='border-2 absolute right-5 bottom-0 p-1 rounded'
                onClick={handleLogout}>
                logout
            </button>
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
            <h2 className='w-full p-2 text-center border rounded-lg'>Your Posts</h2>
        </section>
    </div>
    )
}

export default withAuth(Page,true)

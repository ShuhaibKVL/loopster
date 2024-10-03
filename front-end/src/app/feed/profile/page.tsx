'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import defaultProfiel from '../../../../public/Images/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg'
import { Button } from '@/components/ui/button'
import {Pencil2Icon  } from '@radix-ui/react-icons'
import {UploadIcon} from '@radix-ui/react-icons'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store/store'
import { useRouter } from 'next/navigation'


export default function page() {
    const router = useRouter()
    const isAuthenticated = useSelector((state:RootState) => state.user.isAuthenticated)
    console.log("isAuthenticated :",isAuthenticated)

    // useEffect(() => {
    //     if(!isAuthenticated){
    //         router.replace('/signIn')
    //     }
    // })
    console.log(">>>",isAuthenticated)
    return (
    <div className='p-5 space-y-10'>
        <div className="relative w-[250px] h-[250px] m-auto group">
        <Image
        src={defaultProfiel}
        width={250}
        height={250}
        className="border rounded-full shadow-sm hover:opacity-80"
        alt="Profile Image"
        />
        <UploadIcon
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
    </div>

    {/* Follow / Following section */}
    <section className='flex items-center justify-center gap-x-9 w-full'>
    <div className='space-y-2'>
        <p className='px-5 border rounded-lg py-1 font-bold'>Following</p>
        <p className='text-center'>548</p>
    </div>
    <div className='space-y-2'>
        <p className='px-5 border rounded-lg py-1 font-bold'>Followers</p>
        <p className='text-center'>278</p>
    </div>
    </section>
        {/* user Details and edit section */}
        <div className='relative p-5 border rounded-sm space-y-1'>
            <Button className='border-2 absolute right-5 ' variant={'ghost'} size='icon'>
                <Pencil2Icon/>
            </Button>
            <section>
                <h2 className='font-bold'>User Name</h2>
                <p className='font-thin'>@first name</p>
            </section>
            
            <pre>
                Lorem ipsum dolor, sit amet consectetur,
            </pre>
            <pre>
                adipisicing elit. Mollitia nam inventore,
            </pre>
            <pre>
                voluptates quaerat veniam dolor at impedit.
            </pre>
        </div>
        {/* User Posts */}
        <section>
            <h2 className='w-full p-2 text-center border rounded-lg'>Your Posts</h2>
        </section>
    </div>
    )
}

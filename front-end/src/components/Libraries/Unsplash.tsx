import unsplashService from '@/services/unsplash/unsplashService'
import React, { forwardRef, useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { RiUnsplashLine } from 'react-icons/ri'
import { IoIosSearch } from "react-icons/io";
import Image from 'next/image';

export interface UnsplashImage {
    urls: {
      small: string;
      raw: string;
    };
    alt_description?: string;
  }

  
interface IUnsplashProps {
    onSaveImage : (unsplashImgFile:File,prevImageUrl:string) => void
}


// eslint-disable-next-line react/display-name
const Unsplash = forwardRef(({onSaveImage} : IUnsplashProps ) => {
    const [ imgData , setImgData ] = useState<null | UnsplashImage[]>(null)
    const [ query , setQuery ] = useState<string | 'nature'>('nature')
    const [ isLoading , setIsLoading ] = useState<boolean>(true)
    const [ timeoutId , setTimeoutId ] = useState<NodeJS.Timeout | null>(null)
    const [ openDialog , setOpenDialog ] = useState<boolean>(false)

    const fetchUnsplashImages = async() => {
        const result = await unsplashService.searchImages(1,query,10)
        setImgData(result?.result as UnsplashImage[] || [])
        setIsLoading(false)
    }

    useEffect(() => {
        if(timeoutId){
            clearTimeout(timeoutId)
        }
        const Id = setTimeout(() => {
            fetchUnsplashImages()
        },1000)
        setTimeoutId(Id)
        return () => {
            clearTimeout(Id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[query])

    const selectImage = async(imageUrl:string) => {
        try {
            const response = await fetch(imageUrl)
            const blob = await response.blob()

            //Creating a File Object
            const file = new File([blob],"image.jpg",{type:blob.type})
            const localImgUrl = URL.createObjectURL(file)
            setOpenDialog(false)
            onSaveImage(file,localImgUrl)
        } catch (error) {
            console.log(error)
        }
    }

    return (
    <div className=''>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger >
        <div className='flex flex-col items-center hover:bg-[var(--color-bg)] duration-2 p-4 rounded-md'>
            <RiUnsplashLine
            className='w-10 h-10'
            title='Upload High quality images from Unsplash' />
            <p>Unsplash API</p>
        </div>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Explore the latest hd images</DialogTitle>
            <DialogDescription 
            className='relative w-full h-[80vh] overflow-y-auto p-4 
            bg-[var(--secondary-bg)] shadow-sm rounded-md flex 
            flex-col gap-2 scrollbar-hide'>
                <div className='w-full flex items-center justify-start p-2 border gap-2 rounded-sm overflow-hidden'>
                    <IoIosSearch  className='h-5 w-5' />
                    <label htmlFor="search"></label>
                    <input type="text" value={query} 
                    placeholder='Nature...' className='w-full outline-none' 
                    onChange={(e) => setQuery(e.target.value)} />
                </div>
                {isLoading ? (
                    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                    <span className="loading loading-ring loading-sm"></span>
                    <span className="loading loading-ring loading-md"></span>
                    <span className="loading loading-ring loading-lg"></span>
                    </div>
                ) : (
                    imgData && imgData.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3 lg:grid-cols-3 lg:gap-4">
                        {imgData.map((val: UnsplashImage, index) => (
                            <Image
                                key={index}
                                className="col-span-1 img-fluid img-thumbnail"
                                width={200}
                                height={100}
                                src={val?.urls?.small}
                                alt={val?.alt_description || 'Unsplash Image'}
                                onClick={() => selectImage(val?.urls?.raw)}
                            />
                        ))}
                    </div>
                    ) : (<p>No images available. Please check your internet.</p>)
                )}
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
        </Dialog>
    </div>
    )
});

export default Unsplash
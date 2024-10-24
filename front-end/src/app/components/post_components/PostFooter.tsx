import React from 'react'
import { IoMdHeartEmpty } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";

export default function PostFooter() {
    return (
    <div className='flex items-center justify-between w-full pt-1'>
        <div className='flex items-center gap-2 px-1'>
            <IoMdHeartEmpty  className='w-5 h-5'/>
            <FaRegComment className='w-5 h-5' />
        </div>
        <FaRegBookmark className='w-5 h-5' />
    </div>
    )
}

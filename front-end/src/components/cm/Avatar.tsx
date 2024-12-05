import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { BiSolidUserCircle } from 'react-icons/bi'

interface IAvatarProps{
    imgUrl?:string
    h?:string,
    w?:string
}
export default function AvatarComponent({imgUrl,h='h-10',w='w-10'}:IAvatarProps) {
    return (
        <div className={`${h} ${w} overflow-hidden shrink-0 rounded-full border`}>
        <Avatar >
        {imgUrl !== '' ? 
        (<>
            <AvatarImage
                src= {imgUrl}
                alt="PR"
                className=''
            />
        </>
        ) : ( 
            <BiSolidUserCircle className='text-[var(--color-bg)] w-full h-full object-contain' />
        )}
        </Avatar>
        </div>
    )
}

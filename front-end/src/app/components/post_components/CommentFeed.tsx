
import React from 'react'
import AvatarComponent from '../Avatar'
import { CiHeart } from 'react-icons/ci'
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useAppSelector } from '@/hooks/typedUseDispatch';
import { RootState } from '@/lib/redux/store/store';
import { confirmAction } from '../ConfirmationModal';
import { useToast } from '@/hooks/use-toast';
import commentService from '@/services/user/post/comment/commentService';
import { ICommentResponse } from '@/lib/utils/interfaces/IComment';


interface ICommendFeedProps{
    userProfileImg:string,
    userName:string,
    comment:ICommentResponse
    getComments:(postId:string) => void
}


export default function CommentFeed({userProfileImg,userName,comment,getComments}:ICommendFeedProps) {
  const loggedUserId = useAppSelector((state:RootState) => state?.user?.userId)
  const { toast } = useToast()

  const deleteComment = async(commentId:string) => {
    const willProceed = await confirmAction({
      title: `Are you sure to delete ?`,
      text: `Once deleted, you are not able to return..!`,
      icon: 'warning',
    });

    if(willProceed){
      const response = await commentService.deleteComment(commentId)
      console.log('response :',response)
      if(!response?.status){
        toast({
          title: 'File upload Filed !!!',
          description: 'File upload filed.Try once again!',
          className:"toast-failed"
        })
        return
      }
        toast({
          title:'SUCCESS',
          description:'Comment deleted sussessfuly',
          className:'toast-success'
        })
        getComments(comment?.postId)
        return
    }
  }
    
  return (
    <div className='flex gap-1 items-center justify-between'>
      <div className='flex gap-2'>
      <AvatarComponent
        imgUrl={userProfileImg}
        />
        <div></div>
        <h1 className='font-semibold mr-1 md:text-md'>{userName}<span className='font-light ml-1'>{comment?.comment}</span></h1>
      </div>

      <div className='flex'>
        {loggedUserId === comment?.userId ? 
        (
          <MdOutlineDeleteOutline
          onClick={() => deleteComment(comment?._id)}
           className='w-4 h-4'/>
        ) : 
        (null)}
        <CiHeart className='w-4 h-4'/>
      </div>
    </div>
  )
}

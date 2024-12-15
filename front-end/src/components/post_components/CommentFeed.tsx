
import { useAppSelector } from '@/hooks/typedUseDispatch';
import { useToast } from '@/hooks/use-toast';
import { RootState } from '@/lib/redux/store/store';
import { ICommentResponseWInnerComment } from '@/lib/utils/interfaces/IComment';
import commentService from '@/services/user/post/comment/commentService';
import { CiHeart } from 'react-icons/ci';
import { MdOutlineDeleteOutline } from "react-icons/md";
import AvatarComponent from '../cm/Avatar';
import { confirmAction } from '../cm/ConfirmationModal';
import { FaHeart } from 'react-icons/fa6';


interface ICommendFeedProps{
    userProfileImg:string,
    userName:string,
    comment:ICommentResponseWInnerComment
    getComments:(postId:string) => void
    commentInputRef:React.RefObject<HTMLElement>
    selectedComment:React.Dispatch<React.SetStateAction<null | {userProfile:string,comment:string,commentId:string}>>
}


export default function CommentFeed({userProfileImg,userName,comment,getComments,commentInputRef,selectedComment}:ICommendFeedProps) {
  const loggedUserId = useAppSelector((state:RootState) => state?.user?.userId)
  const { toast } = useToast()
  console.log('comments inside the Comment Feed :',comment)

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

  const handleReplayComment = () => {
    commentInputRef.current?.focus()

    const newComment : {userProfile:string,comment:string,commentId:string} = {
      userProfile:userProfileImg,
      comment:comment?.comment,
      commentId:comment?._id
    }

    selectedComment(newComment)
  }

  const likeComment = async(commentId:string,postId:string) => {
    const like = await commentService.likeComment(commentId,loggedUserId,postId,)
    console.log('response :',like)
    getComments(comment?.postId)
  }

  const unLikeComment = async(commentId:string) => {
    const unLike = await commentService.unlikeComment(commentId,loggedUserId)
    console.log('response :',unLike)
    getComments(comment?.postId)
  }
    
  return (
    <>
    <div className='flex gap-1 items-center justify-between overflow-hidden'>
      <div className='flex gap-2'>
      <AvatarComponent
        imgUrl={userProfileImg}
        />
        <div>
        <h1 className='font-semibold mr-1 md:text-md'>
          {userName}<span className='font-light ml-1'>
          {comment?.comment}</span>
        </h1>
        <p className='text-xs font-mono' onClick={handleReplayComment}>Replay</p>
        </div>
      </div>

      <div className='flex'>
        {loggedUserId === comment?.userId ? 
        (
          <MdOutlineDeleteOutline
          onClick={() => deleteComment(comment?._id)}
           className='w-4 h-4'/>
        ) : 
        (null)}
        {comment?.likes?.includes(loggedUserId) ? (
            <FaHeart onClick={() => unLikeComment(comment?._id)} 
            className='opacity-75 text-red-600 cursor-pointer'
            />
        ) : (
          <CiHeart onClick={() => likeComment(comment?._id,comment?.postId)} 
          className='w-4 h-4 cursor-pointer'
          />
        )}
      </div>
    </div>

    <div className='max-h-40 overflow-y-scroll scrollbar-hide space-y-2'>
    {comment?.innerComments.length > 1 && (
      comment?.innerComments?.map((item) => (
        <div key={item?._id} className='flex gap-1 items-center justify-between w-[80%] relative left-10 overflow-hidden'>
        <div className='flex gap-2'>
        <AvatarComponent
          imgUrl={item?.user?.profileImage}
          />
          <div>
          <h1 className='font-semibold mr-1 md:text-md'>
            {item?.user?.userName}<span className='font-light ml-1'>
            {item?.comment}</span>
          </h1>
          <p className='text-xs font-mono' 
          onClick={handleReplayComment}>Replay</p>
          </div>
        </div>
        
        <div className='flex'>
          {loggedUserId === item?.userId ? 
          (
            <MdOutlineDeleteOutline
            onClick={() => deleteComment(item?._id)}
             className='w-4 h-4'/>
          ) : 
          (null)}
          {item?.likes?.includes(loggedUserId) ? (
            <FaHeart onClick={() => unLikeComment(item?._id)} 
            className='opacity-75 text-red-600 cursor-pointer'
            />
          ) : (
          <CiHeart onClick={() => likeComment(item?._id,item?.postId)} 
          className='w-4 h-4 cursor-pointer'
          />
          )}
        </div>
        <div>
        </div>
        
      </div>
      ))
    )}
    </div>
    </>
  )
}

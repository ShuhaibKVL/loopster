import {Router} from 'express'
import { authorize } from '../../middleware/userAuthMiddleware'
import { PostRepository } from '../../repositories/posts/postRepository'
import { PostService } from '../../services/posts/PostService'
import { PostController } from '../../controllers/posts/PostController'
import upload from '../../middleware/multer'
import { S3Service } from '../../services/admin/S3Services.ts/S3Service'
import { PostCommentsRepository } from '../../repositories/posts/comment/IPostCommentRepository'
import { CommentService } from '../../services/posts/comment/CommentService'
import { CommentConroller } from '../../controllers/posts/CommentController'
import { LikeRepository } from '../../repositories/posts/like/likeRepository'
import { LikeService } from '../../services/posts/like/likeService'
import { LikeController } from '../../controllers/posts/LIkeController'
import { BookMarkRepository } from '../../repositories/posts/bookmark/bookMarkRepository'
import { BookMarkService } from '../../services/posts/bookmark/bookMarkService'
import { BookMarkController } from '../../controllers/posts/BookMarkController'
import { NotificationRepository } from '../../repositories/notification/notificationRepository'
import { NotificationService } from '../../services/notification/notificationService'

const router:Router = Router()

const postRepository = new PostRepository()
const s3Service = new S3Service()
const postServices = new PostService(postRepository,s3Service)
const postController = new PostController(postServices)

const notificationRepository = new NotificationRepository()
const notificationService = new NotificationService(notificationRepository)

const commentRepository = new PostCommentsRepository()
const commentService = new CommentService(commentRepository)
const commentConroller = new CommentConroller(commentService,postServices,notificationService)

const likeRepository = new LikeRepository()
const likeService = new LikeService(likeRepository)
const likeController = new LikeController(likeService,postServices,notificationService)

const bookMarkRepository = new BookMarkRepository()
const bookMarkService = new BookMarkService(bookMarkRepository)
const bookMarkController = new BookMarkController(bookMarkService)

router.use(authorize)
router.post('/create',upload.single('mediaUrl'),postController.createPost.bind(postController))
router.delete('/delete',postController.DeletePost.bind(postController))
router.post('/:postId/update',postController.updatePost.bind(postController))
router.post('/report-post',postController.reportPost.bind(postController))
router.get('/:userId/get-latest-posts',postController.getLatestPosts.bind(postController))
router.get('/:userId/followed-users-post',postController.getFollowedUsersPosts.bind(postController))
router.get('/:userId/view-post',postController.getPost.bind(postController))

router.post('/like',likeController.create_like.bind(likeController))
router.delete('/unlike',likeController.unlike.bind(likeController))
router.post('/book-mark/create',bookMarkController.create.bind(bookMarkController))
router.delete('/book-mark/delete',bookMarkController.delete.bind(bookMarkController))
router.get('/:userId/book-mark/get_all',postController.getBookMarkedPosts.bind(postController))
router.get('/liked-users',likeController.fetchLIkedPostsUser.bind(likeController))

router.post('/comment/create',commentConroller.createComment.bind(commentConroller))
router.get('/comment/get-comments',commentConroller.getPostComments.bind(commentConroller))
router.delete('/comment/delete',commentConroller.deleteComment.bind(commentConroller))
router.patch('/comment/like',commentConroller.likeComment.bind(commentConroller))
router.patch('/comment/unlike',commentConroller.unLikeComment.bind(commentConroller))




export default router

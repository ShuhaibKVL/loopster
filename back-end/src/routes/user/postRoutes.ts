import {Router} from 'express'
import { authorize } from '../../middleware/userAuthMiddleware'
import { PostRepository } from '../../repositories/posts/postRepository'
import { PostService } from '../../services/posts/PostService'
import { PostController } from '../../controllers/posts/PostController'
import upload from '../../middleware/multer'
import { S3Service } from '../../services/admin/S3Services.ts/S3Service'

const router:Router = Router()

const postRepository = new PostRepository()
const s3Service = new S3Service()
const postServices = new PostService(postRepository,s3Service)
const postController = new PostController(postServices)

router.use(authorize)
router.post('/create',upload.single('mediaUrl'),postController.createPost.bind(postController))
router.get('/:userId/get-latest-posts',postController.getLatestPosts.bind(postController))
router.delete('/delete',postController.DeletePost.bind(postController))

export default router

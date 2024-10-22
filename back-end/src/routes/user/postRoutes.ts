import {Router} from 'express'
import { authorize } from '../../middleware/userAuthMiddleware'
import { PostRepository } from '../../repositories/posts/postRepository'
import { PostService } from '../../services/posts/PostService'
import { PostController } from '../../controllers/posts/PostController'

const router:Router = Router()

const postRepository = new PostRepository()
const postServices = new PostService(postRepository)
const postController = new PostController(postServices)

router.use(authorize)
router.post('/create',postController.createPost.bind(postController))

export default router

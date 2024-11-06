import { Router } from 'express'
import { UnsplashController } from '../../controllers/unsplash/unsplashController'
import { authorize } from '../../middleware/userAuthMiddleware'
import { UnsplashRepository } from '../../repositories/unsplash/unsplashReopository'
import { UnsplashService } from '../../services/unsplash/unsplashService'

const router : Router = Router()

const unsplashRepository = new UnsplashRepository()
const unsplashService = new UnsplashService(unsplashRepository)
const unsplashController = new UnsplashController(unsplashService)


router.use(authorize)
router.get('/search-unsplash-images',unsplashController.searchImages.bind(unsplashController))

export default router
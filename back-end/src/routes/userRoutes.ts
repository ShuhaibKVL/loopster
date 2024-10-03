import {Router} from 'express'
import { resentOtp, signIn, signUp, user, verifyOtp } from '../controllers/userController'
import { authorize } from '../middleware/userAuthMiddleware'
import { isVerifiedJwt } from '../controllers/jwtController'


const router:Router = Router()

console.log("user router invoked..!")

router.post('/register',signUp)
router.post('/verifyOtp',verifyOtp)
router.post('/resendotp',resentOtp)
router.post('/signIn',signIn)
router.post('/verifyjwt',isVerifiedJwt)

router.use(authorize)
router.get('/user',user)



export default router
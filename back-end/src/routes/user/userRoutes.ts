import { Router } from 'express'

import FollowController from '../../controllers/followController'
import { OtpController } from '../../controllers/otpController'
import { UserController } from '../../controllers/userController'
import upload from '../../middleware/multer'
import { authorize } from '../../middleware/userAuthMiddleware'
import { FollowRespository } from '../../repositories/follow/followRepository'
import { OtpRepository } from '../../repositories/otpRepository'
import { UserRepository } from '../../repositories/userRepository'
import { S3Service } from '../../services/admin/S3Services.ts/S3Service'
import { AuthService } from '../../services/AuthService'
import { EmailService } from '../../services/EmailService'
import { FollowService } from '../../services/follow/FollowService'
import { OtpService } from '../../services/OtpService'
import { userServices } from '../../services/userServices'


const router:Router = Router()

const userRepository = new UserRepository()
const s3Service = new S3Service()
const userService = new userServices(userRepository,s3Service)
const authService = new AuthService()
const emailService = new EmailService()
const otpRepository = new OtpRepository()
const otpService = new OtpService(otpRepository)
const followRepository = new FollowRespository()
const followService = new FollowService(followRepository)
const userController = new UserController(userService , authService , emailService,otpService,followService)
const otpController = new OtpController(otpService,emailService,userService)
const followController = new FollowController(followService)


router.post('/register',userController.signUp.bind(userController))
router.post('/verifyOtp',otpController.verifyOtp.bind(otpController))
router.post('/resendotp',otpController.resendOtp.bind(otpController))
router.post('/signIn',userController.signIn.bind(userController))

router.use(authorize)
router.get('/user/:userId',userController.getUser.bind(userController))
router.post('/user/:userId/upload-profile-img',upload.single('profileImage'),userController.uploadProfileImage.bind(userController))
router.post('/:userId/update-profile',userController.updateProfile.bind(userController))

router.post('/latest-users',userController.getLatestUsers.bind(userController))

router.post('/follow-user',followController.follow.bind(followController))
router.delete('/unfollow-user',followController.unFollow.bind(followController))





export default router
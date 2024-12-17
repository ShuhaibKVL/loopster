import { NextFunction, Router } from 'express'
import FollowController from '../../controllers/followController'
import { NotificationController } from '../../controllers/notification/notificationController'
import { OtpController } from '../../controllers/otpController'
import { StoryController } from '../../controllers/story/storyController'
import { UserController } from '../../controllers/userController'
import upload from '../../middleware/multer'
// import { authorize } from '../../middleware/userAuthMiddleware'
import { Request, Response } from 'express'
import jwt, { JwtPayload } from "jsonwebtoken"
import { ErrorMessages } from '../../enums/errorMessages'
import { HttpStatus } from '../../enums/httpStatus'
import { MessageRepository } from '../../repositories/chat/messageRepository'
import { FollowRespository } from '../../repositories/follow/followRepository'
import { NotificationRepository } from '../../repositories/notification/notificationRepository'
import { OtpRepository } from '../../repositories/otpRepository'
import { StoryRepository } from '../../repositories/story/storyRepository'
import { UserRepository } from '../../repositories/userRepository'
import { S3Service } from '../../services/admin/S3Services.ts/S3Service'
import { AuthService } from '../../services/AuthService'
import { MessageService } from '../../services/chat/messageService'
import { EmailService } from '../../services/EmailService'
import { FollowService } from '../../services/follow/FollowService'
import { NotificationService } from '../../services/notification/notificationService'
import { OtpService } from '../../services/OtpService'
import { StoryService } from '../../services/story/IStoryService'
import { userServices } from '../../services/userServices'

export const authorize = async (req:Request , res:Response , next:NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        // console.log("authHeader :",authHeader)

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: ErrorMessages.TOKEN_NOT_FONT});
        }
        const token = authHeader.split(' ')[1]
        const claims = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload

        if(!claims){
            res.status(HttpStatus.FORBIDDEN).json({message:ErrorMessages.TOKEN_VERIFIED_FAILED})
            return;
        }

        const user = await userService.findUserById(claims?.userId)
        console.log('user is Blocked :',user[0].isBlocked,)
        if(!user && user[0]?.isBlocked){
            console.log('blocked ')
            res.status(HttpStatus.FORBIDDEN).json({message:ErrorMessages.BLOCKED})
            return
        }
        console.log('middleware > next')
        next()
        
    } catch (error : any) {
        console.log(error.message)
        res.status(HttpStatus.FORBIDDEN).json({message:ErrorMessages.TOKEN_VERIFIED_FAILED})
    }
}

const router:Router = Router()

const userRepository = new UserRepository()
const s3Service = new S3Service()
export const userService = new userServices(userRepository,s3Service)
const authService = new AuthService()
const emailService = new EmailService()

const otpRepository = new OtpRepository()
const otpService = new OtpService(otpRepository)

const followRepository = new FollowRespository()
const followService = new FollowService(followRepository)

const messageRepository = new MessageRepository()
const messageService = new MessageService(messageRepository)

const notificationRepository = new NotificationRepository()
const notificationService = new NotificationService(notificationRepository)
const notificationController = new NotificationController(notificationService)

const storyRepository = new StoryRepository()
const sotryService = new StoryService(storyRepository)
const storyController = new StoryController(sotryService)

const userController = new UserController(userService , authService , emailService,otpService,followService,messageService)
const otpController = new OtpController(otpService,emailService,userService)
const followController = new FollowController(followService,notificationService,userService)


router.post('/register',userController.signUp.bind(userController))
router.post('/verifyOtp',otpController.verifyOtp.bind(otpController))
router.post('/resendotp',otpController.resendOtp.bind(otpController))
router.post('/signIn',userController.signIn.bind(userController))
router.post('/signin-with-next-auth',userController.signInWithGoogle.bind(userController))

console.log(typeof authorize)
router.use(authorize)

router.get('/user/:userId',userController.getUser.bind(userController))
router.post('/user/:userId/upload-profile-img',upload.single('profileImage'),userController.uploadProfileImage.bind(userController))
router.post('/:userId/update-profile',userController.updateProfile.bind(userController))
router.get('/:userId/settings/update-private-account',userController.handlePrivateAccount.bind(userController))

router.post('/latest-users',userController.getLatestUsers.bind(userController))
router.get('/:userId/search-followed-users',userController.search_followed_users.bind(userController))
router.get('/followed-users',followController.getFollowedUsers.bind(followController))
router.get('/followers',followController.getFollowers.bind(followController))
router.get('/suggestion-users',followController.findUnFollowedUsers.bind(followController))

router.post('/follow-user',followController.follow.bind(followController))
router.delete('/unfollow-user',followController.unFollow.bind(followController))
router.get('/accept-follow-request',followController.acceptFollowRequest.bind(followController))
router.delete('/reject-follow-request',followController.cancelFollow.bind(followController))
router.delete('/cancle-follow-request',followController.cancleFollowRequest.bind(followController))

router.get('/get-notifications',notificationController.fetchAllNotifications.bind(notificationController))
router.patch('/mark-as-readed',notificationController.markAsReaded.bind(notificationController))

router.post('/story/create',storyController.createStory.bind(storyController))
router.get('/:userId/story/latest-stories',storyController.fetchFollowed_Users_Stories.bind(storyController))
router.delete('/story/delete',storyController.deleteStory.bind(storyController))




export default router
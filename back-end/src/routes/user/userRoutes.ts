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
import { MessageRepository } from '../../repositories/chat/messageRepository'
import { MessageService } from '../../services/chat/messageService'
import { NotificationRepository } from '../../repositories/notification/notificationRepository'
import { NotificationService } from '../../services/notification/notificationService'
import { NotificationController } from '../../controllers/notification/notificationController'
import { StoryRepository } from '../../repositories/story/storyRepository'
import { StoryService } from '../../services/story/IStoryService'
import { StoryController } from '../../controllers/story/storyController'


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
const followController = new FollowController(followService,notificationService)


router.post('/register',userController.signUp.bind(userController))
router.post('/verifyOtp',otpController.verifyOtp.bind(otpController))
router.post('/resendotp',otpController.resendOtp.bind(otpController))
router.post('/signIn',userController.signIn.bind(userController))

router.use(authorize)
router.get('/user/:userId',userController.getUser.bind(userController))
router.post('/user/:userId/upload-profile-img',upload.single('profileImage'),userController.uploadProfileImage.bind(userController))
router.post('/:userId/update-profile',userController.updateProfile.bind(userController))

router.post('/latest-users',userController.getLatestUsers.bind(userController))
router.get('/:userId/search-followed-users',userController.search_followed_users.bind(userController))
router.get('/followed-users',followController.getFollowedUsers.bind(followController))
router.get('/followers',followController.getFollowers.bind(followController))
router.get('/suggestion-users',followController.findUnFollowedUsers.bind(followController))

router.post('/follow-user',followController.follow.bind(followController))
router.delete('/unfollow-user',followController.unFollow.bind(followController))

router.get('/get-notifications',notificationController.fetchAllNotifications.bind(notificationController))
router.patch('/mark-as-readed',notificationController.markAsReaded.bind(notificationController))

router.post('/story/create',storyController.createStory.bind(storyController))
router.get('/:userId/story/latest-stories',storyController.fetchFollowed_Users_Stories.bind(storyController))
router.delete('/story/delete',storyController.deleteStory.bind(storyController))




export default router
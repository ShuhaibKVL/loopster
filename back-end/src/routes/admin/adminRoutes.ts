import { Router } from "express";
import { AdminController } from "../../controllers/admin/adminController";
import { PostManagementController } from "../../controllers/admin/postManagementController";
import { UserManagementController } from "../../controllers/admin/userManagementController";
import { authorize } from "../../middleware/adminAuthMiddleware";
import { AdminRepository } from "../../repositories/admin/adminRepository";
import { PostManagementRepository } from "../../repositories/admin/postManagementRepository";
import { UserManagementRepo } from "../../repositories/admin/userManagmentRepo";
import { AdminService } from "../../services/admin/adminServices";
import { PostManagementService } from "../../services/admin/postManagementService";
import { UserManagementService } from "../../services/admin/userManagementService";
import { AuthService } from "../../services/AuthService";
import { ReportManagementRepository } from "../../repositories/admin/reportManagementRepository";
import { ReportManagementService } from "../../services/admin/reportManagementService";
import { ReportManagementController } from "../../controllers/admin/reportManagementController";

const router:Router = Router()

const adminRepository = new AdminRepository()
const authService = new AuthService()
const adminService = new AdminService(adminRepository)
const adminController = new AdminController(adminService,authService)

const userManagementRepo = new UserManagementRepo()
const userManagementService = new UserManagementService(userManagementRepo)
const userManagementController = new UserManagementController(userManagementService)

const reportManagementRepository = new ReportManagementRepository()
const reportManagementService = new ReportManagementService(reportManagementRepository)
const reportManagementController = new ReportManagementController(reportManagementService)

const postManagementRepository = new PostManagementRepository()
const postManagementService = new PostManagementService(postManagementRepository,reportManagementRepository)
const postManagementController = new PostManagementController(postManagementService)




router.post('/signIn',adminController.signIn.bind(adminController))

router.use(authorize)
    //User management routes
router.get('/users',userManagementController.getAllUsers.bind(userManagementController))
router.patch('/user/:userId/block',userManagementController.blockUnBlock.bind(userManagementController))
router.patch('/user/:userId/unlist',userManagementController.listUnList.bind(userManagementController))
router.get('/post/all-posts',postManagementController.getAllPosts.bind(postManagementController))
router.patch('/post/list-unlist',postManagementController.listUnList.bind(postManagementController))
router.get('/post/new-reportes',reportManagementController.getAllReports.bind(reportManagementController))
router.patch('/post/report-post',postManagementController.reportPost.bind(postManagementController))
router.patch('/post/report/mark-as-readed',reportManagementController.markAsRead.bind(reportManagementController))

export default router
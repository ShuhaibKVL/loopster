import { Router } from "express";
import { AdminController } from "../../controllers/admin/adminController";
import { UserManagementController } from "../../controllers/admin/userManagementController";
import { authorize } from "../../middleware/adminAuthMiddleware";
import { AdminRepository } from "../../repositories/admin/adminRepository";
import { UserManagementRepo } from "../../repositories/admin/userManagmentRepo";
import { AdminService } from "../../services/admin/adminServices";
import { UserManagementService } from "../../services/admin/userManagementService";
import { AuthService } from "../../services/AuthService";

const router:Router = Router()

const adminRepository = new AdminRepository()
const authService = new AuthService()
const adminService = new AdminService(adminRepository)
const adminController = new AdminController(adminService,authService)

const userManagementRepo = new UserManagementRepo()
const userManagementService = new UserManagementService(userManagementRepo)
const userManagementController = new UserManagementController(userManagementService)

router.post('/signIn',adminController.signIn.bind(adminController))

router.use(authorize)
    //User management routes
router.get('/users',userManagementController.getAllUsers.bind(userManagementController))
router.patch('/user/:userId/block',userManagementController.blockUnBlock.bind(userManagementController))
router.patch('/user/:userId/unlist',userManagementController.listUnList.bind(userManagementController))

export default router
import { Router } from "express";
import { getusers, signIn } from "../controllers/adminController";

const router:Router = Router()

router.post('/signIn',signIn)
router.get('/getusers',getusers)

export default router
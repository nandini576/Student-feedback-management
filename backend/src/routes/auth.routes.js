import express from "express"
import {register,login} from "../controllers/auth.controller.js"
import allowRoles from "../middleware/role.middleware.js"
import auth from '../middleware/auth.middleware.js'
const router=express.Router()
router.post("/register",auth,allowRoles("admin"),register)
router.post("/login",login)
export default router
import express from "express"
import {createCourse,getCourses,getMyCourses} from "../controllers/course.controller.js"
import auth from '../middleware/auth.middleware.js'
import allowedRoles from '../middleware/role.middleware.js'
const router=express.Router()
router.post("/",auth,allowedRoles("admin"),createCourse)
router.get("/",auth,getCourses)
router.get("/my-courses",auth,getMyCourses)
export default router
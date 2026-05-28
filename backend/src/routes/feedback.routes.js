import express from "express"
import {submitFeedback,getCourseFeedback,getAllFeedback,getMyFeedback} from "../controllers/feedback.controller.js"
import auth from '../middleware/auth.middleware.js'
import allowedRoles from '../middleware/role.middleware.js'
const router=express.Router()
router.post("/",auth,allowedRoles("student"),submitFeedback)
router.get("/",auth,allowedRoles("admin"),getAllFeedback)
router.get("/my-feedback",auth,getMyFeedback)
router.get("/course/:courseId",auth,allowedRoles("faculty","admin"),getCourseFeedback)
export default router
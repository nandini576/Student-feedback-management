import express from "express";
import { courseReport } from "../controllers/report.controller.js";
import auth from '../middleware/auth.middleware.js'
import allowedRoles from '../middleware/role.middleware.js'
const router = express.Router();
router.get("/course/:courseId",auth,allowedRoles("admin","faculty"),courseReport);
export default router;
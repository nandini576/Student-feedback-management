import express from "express";
import { getAllUsers, deleteUser } from "../controllers/user.controller.js";
import auth from '../middleware/auth.middleware.js'
import allowedRoles from '../middleware/role.middleware.js'
const router = express.Router();

router.get("/",auth,allowedRoles("admin"),getAllUsers);
router.delete("/:id",auth,allowedRoles("admin"), deleteUser);

export default router;
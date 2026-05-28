import express from "express";
import {
    createQuestion,
    getQuestions,
    updateQuestion,
    deleteQuestion
} from "../controllers/question.controller.js";

import auth from "../middleware/auth.middleware.js";
import allowedRoles from "../middleware/role.middleware.js";

const router = express.Router();

// Admin only
router.post("/", auth, allowedRoles("admin"), createQuestion);
router.put("/:id", auth, allowedRoles("admin"), updateQuestion);
router.delete("/:id", auth, allowedRoles("admin"), deleteQuestion);

// All authenticated users
router.get("/", auth, getQuestions);

export default router;
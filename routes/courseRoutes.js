import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  getCourses,
  addCourse,
  deleteCourse,
} from "../controllers/courseController.js";

const router = express.Router();

router.get("/", getCourses);
router.post("/", adminAuth, addCourse);
router.delete("/:id", adminAuth, deleteCourse);

export default router;

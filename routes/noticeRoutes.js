import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  getNotices,
  addNotice,
  deleteNotice,
} from "../controllers/noticeController.js";

const router = express.Router();

router.get("/", getNotices);
router.post("/", adminAuth, addNotice);
router.delete("/:id", adminAuth, deleteNotice);

export default router;

import express from "express";
import upload from "../middleware/upload.js";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  addImage,
  getImagesByCategory,
} from "../controllers/galleryController.js";

const router = express.Router();

router.post("/upload", adminAuth, upload.single("image"), addImage);
router.get("/:category", getImagesByCategory);

export default router;

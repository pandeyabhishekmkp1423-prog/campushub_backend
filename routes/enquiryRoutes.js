import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  createEnquiry,
  getAllEnquiries,
} from "../controllers/enquiryController.js";

const router = express.Router();

// PUBLIC: students submit enquiry
router.post("/", createEnquiry);

// ADMIN: view enquiries (protected)
router.get("/", adminAuth, getAllEnquiries);

export default router;

import express from "express";
import {
  createEnquiry,
  getAllEnquiries,
} from "../controllers/enquiryController.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

// ✅ PUBLIC — student enquiry
router.post("/", createEnquiry);

// ✅ ADMIN — view enquiries
router.get("/", verifyAdmin, getAllEnquiries);

export default router;

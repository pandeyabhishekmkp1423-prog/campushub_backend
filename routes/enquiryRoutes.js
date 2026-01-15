import express from "express";
import supabase from "../config/supabase.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

/* =====================================================
   PUBLIC: SUBMIT ENQUIRY (NO AUTH REQUIRED)
===================================================== */
router.post("/public/enquiry", async (req, res) => {
  try {
    const { name, email, phone, course_interest, message } = req.body;

    if (!name || !email || !phone || !course_interest) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const { error } = await supabase.from("enquiries").insert([
      {
        name,
        email,
        phone,
        course_interest,
        message,
      },
    ]);

    if (error) {
      console.error("❌ ENQUIRY INSERT ERROR:", error);
      return res.status(500).json({ message: "Database error" });
    }

    res.json({ message: "Enquiry submitted successfully" });
  } catch (err) {
    console.error("❌ ENQUIRY API ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   ADMIN: FETCH ALL ENQUIRIES (JWT PROTECTED)
===================================================== */
router.get("/admin/enquiries", adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ FETCH ENQUIRIES ERROR:", error);
      return res.status(500).json({ message: "Database error" });
    }

    res.json(data);
  } catch (err) {
    console.error("❌ ADMIN ENQUIRY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

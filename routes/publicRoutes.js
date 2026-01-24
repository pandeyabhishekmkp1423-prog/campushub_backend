import express from "express";
import supabase from "../config/supabase.js";

const router = express.Router();

/* =========================
   PUBLIC – CAMPUS MEMORIES
========================= */
router.get("/gallery/:category", async (req, res) => {
  const { category } = req.params;

  const { data, error } = await supabase
    .from("gallery_images")
    .select("id, image_url")
    .eq("category", category)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json(data);
});

/* =========================
   PUBLIC – COURSES (FOR DROPDOWN)
========================= */
router.get("/courses", async (_req, res) => {
  const { data, error } = await supabase
    .from("courses")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json(data);
});

/* =========================
   PUBLIC – ENQUIRY SUBMIT
========================= */
router.post("/enquiry", async (req, res) => {
  const { name, email, phone, course_interest, message } = req.body;

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
    return res.status(500).json({ message: error.message });
  }

  res.json({ success: true });
});

export default router;

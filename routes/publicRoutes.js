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
   PUBLIC – COURSES (FULL LIST)
========================= */
router.get("/courses", async (_req, res) => {
  const { data, error } = await supabase
    .from("courses")
    .select("id, name, level, duration, description")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json(data);
});

/* =========================
   PUBLIC – COURSES (DROPDOWN ONLY)
========================= */
router.get("/courses/dropdown", async (_req, res) => {
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
   PUBLIC – NOTICES
========================= */
router.get("/notices", async (_req, res) => {
  const { data, error } = await supabase
    .from("notices")
    .select("id, title, description, category, created_at")
    .order("created_at", { ascending: false });

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

  if (!name || !email || !course_interest) {
    return res.status(400).json({ message: "Required fields missing" });
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
    return res.status(500).json({ message: error.message });
  }

  res.json({ success: true });
});

export default router;

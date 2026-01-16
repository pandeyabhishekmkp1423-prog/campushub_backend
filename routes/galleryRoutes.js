import express from "express";
import upload from "../middleware/upload.js";
import supabase from "../config/supabase.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

/* =========================
   ADMIN: UPLOAD IMAGE
========================= */
router.post(
  "/upload",
  adminAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const { category } = req.body;

      if (!req.file || !category) {
        return res.status(400).json({ message: "Missing image or category" });
      }

      const { error } = await supabase.from("gallery_images").insert([
        {
          category,
          image_url: req.file.path, // Cloudinary URL
        },
      ]);

      if (error) throw error;

      res.json({ message: "Image uploaded successfully" });
    } catch (err) {
      console.error("GALLERY UPLOAD ERROR:", err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

/* =========================
   PUBLIC: FETCH BY CATEGORY
========================= */
router.get("/:category", async (req, res) => {
  try {
    const { category } = req.params;

    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

export default router;

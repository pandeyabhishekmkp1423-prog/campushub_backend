import express from "express";
import supabase from "../config/supabase.js";

const router = express.Router();

/* =========================
   PUBLIC – GET GALLERY BY CATEGORY
========================= */
router.get("/:category", async (req, res) => {
  try {
    const { category } = req.params;

    const { data, error } = await supabase
      .from("gallery_images")
      .select("id, image_url")
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("❌ GALLERY FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to load gallery" });
  }
});

export default router;

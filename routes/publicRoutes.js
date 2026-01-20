import express from "express";
import supabase from "../config/supabase.js";

const router = express.Router();

/* =========================
   PUBLIC NOTICE API
   (Supabase)
========================= */
router.get("/notices", async (req, res) => {
  const { data, error } = await supabase
    .from("notices")
    .select("id, title, description, category, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    return res.status(500).json({ message: "Database error" });
  }

  res.status(200).json(data);
});

export default router;

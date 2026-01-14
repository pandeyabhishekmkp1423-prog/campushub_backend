import express from "express";
import upload from "../middleware/upload.js";
import db from "../config/db.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

/* ================= ADMIN UPLOAD IMAGE ================= */
router.post(
  "/upload",
  adminAuth,
  upload.single("image"),
  (req, res) => {
    const category = req.body.category?.toLowerCase();

    if (!req.file || !category) {
      return res.status(400).json({ message: "Invalid upload" });
    }

    const imageUrl = `uploads/gallery/${req.file.filename}`;

    db.query(
      "INSERT INTO gallery_images (category, image_url) VALUES (?, ?)",
      [category, imageUrl],
      (err) => {
        if (err) {
          console.error("DB ERROR:", err);
          return res.status(500).json({ message: "DB error" });
        }
        res.json({ message: "Image uploaded successfully" });
      }
    );
  }
);

/* ================= PUBLIC FETCH ================= */
router.get("/:category", (req, res) => {
  const category = req.params.category.toLowerCase();

  db.query(
    "SELECT * FROM gallery_images WHERE category = ? ORDER BY id DESC",
    [category],
    (err, rows) => {
      if (err) {
        console.error("DB ERROR:", err);
        return res.status(500).json({ message: "DB error" });
      }
      res.json(rows);
    }
  );
});

export default router;

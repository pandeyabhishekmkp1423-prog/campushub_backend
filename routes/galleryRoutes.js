import express from "express";
import upload from "../middleware/upload.js";
import db from "../config/db.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

/* ADMIN UPLOAD */
router.post("/upload", adminAuth, upload.single("image"), (req, res) => {
  const { category } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  db.query(
    "INSERT INTO gallery_images (category, image_url) VALUES (?, ?)",
    [category, req.file.path],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "DB error" });
      }
      res.json({ message: "Image uploaded successfully" });
    }
  );
});

/* PUBLIC FETCH */
router.get("/:category", (req, res) => {
  db.query(
    "SELECT image_url FROM gallery_images WHERE category = ? ORDER BY id DESC",
    [req.params.category],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json(rows);
    }
  );
});

export default router;

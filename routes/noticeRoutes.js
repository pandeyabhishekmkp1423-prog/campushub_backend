import express from "express";
import db from "../config/db.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

/* ================= ADMIN ADD NOTICE ================= */
router.post("/", adminAuth, (req, res) => {
  const { title, description, category } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ message: "All fields required" });
  }

  db.query(
    "INSERT INTO notices (title, description, category) VALUES (?, ?, ?)",
    [title, description, category],
    (err) => {
      if (err) {
        console.error("DB ERROR:", err);
        return res.status(500).json({ message: "DB error" });
      }
      res.json({ message: "Notice added successfully" });
    }
  );
});

/* ================= ADMIN DELETE NOTICE ================= */
router.delete("/:id", adminAuth, (req, res) => {
  db.query(
    "DELETE FROM notices WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        console.error("DB ERROR:", err);
        return res.status(500).json({ message: "DB error" });
      }
      res.json({ message: "Notice deleted" });
    }
  );
});

/* ================= PUBLIC FETCH ================= */
router.get("/", (req, res) => {
  db.query(
    "SELECT * FROM notices ORDER BY id DESC",
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

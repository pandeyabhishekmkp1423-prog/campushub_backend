import express from "express";
import db from "../config/db.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

/* ADMIN: ADD COURSE */
router.post("/", adminAuth, (req, res) => {
  const { name, level, duration, description } = req.body;

  db.query(
    "INSERT INTO courses (name, level, duration, description) VALUES (?, ?, ?, ?)",
    [name, level, duration, description],
    (err) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json({ message: "Course added" });
    }
  );
});

/* ADMIN: DELETE COURSE */
router.delete("/:id", adminAuth, (req, res) => {
  db.query(
    "DELETE FROM courses WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json({ message: "Course deleted" });
    }
  );
});

/* PUBLIC: FETCH COURSES */
router.get("/", (req, res) => {
  db.query(
    "SELECT * FROM courses ORDER BY created_at DESC",
    (err, results) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json(results);
    }
  );
});

export default router;

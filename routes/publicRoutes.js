import express from "express";
import db from "../config/db.js";

const router = express.Router();

/* =========================
   PUBLIC NOTICE API
========================= */
router.get("/notices", (req, res) => {
  db.query(
    "SELECT id, title, description, category, created_at FROM notices ORDER BY created_at DESC",
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "DB error" });
      }
      res.json(rows);
    }
  );
});
export default router;

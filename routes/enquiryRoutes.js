import express from "express";
import db from "../config/db.js";

const router = express.Router();

/* =========================
   PUBLIC ENQUIRY SUBMIT
========================= */
router.post("/enquiry", (req, res) => {
  const { name, email, phone, course_interest, message } = req.body;

  if (!name || !email || !phone || !course_interest) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  db.query(
    "INSERT INTO enquiries (name, email, phone, course_interest, message) VALUES (?, ?, ?, ?, ?)",
    [name, email, phone, course_interest, message],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
      }
      res.json({ message: "Enquiry submitted successfully" });
    }
  );
});

export default router;

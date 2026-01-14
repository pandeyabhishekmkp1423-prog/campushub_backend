import express from "express";
import db from "../config/db.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

/* =========================
   ADMIN DASHBOARD (EXISTING)
========================= */
router.get("/dashboard", adminAuth, (req, res) => {
  const data = {};

  db.query("SELECT COUNT(*) AS users FROM users", (e1, r1) => {
    if (e1) return res.status(500).json({ message: "DB error" });
    data.users = r1[0].users;

    db.query("SELECT COUNT(*) AS notices FROM notices", (e2, r2) => {
      if (e2) return res.status(500).json({ message: "DB error" });
      data.notices = r2[0].notices;

      db.query("SELECT COUNT(*) AS courses FROM courses", (e3, r3) => {
        if (e3) return res.status(500).json({ message: "DB error" });
        data.courses = r3[0].courses;

        /* Recent Enquiries */
        db.query(
          "SELECT name, email, phone, course_interest FROM enquiries ORDER BY created_at DESC LIMIT 5",
          (e4, r4) => {
            if (e4) return res.status(500).json({ message: "DB error" });
            data.recentEnquiries = r4;

            /* Recent Notices */
            db.query(
              "SELECT title, category FROM notices ORDER BY created_at DESC LIMIT 5",
              (e5, r5) => {
                if (e5) return res.status(500).json({ message: "DB error" });
                data.recentNotices = r5;

                /* Recent Courses */
                db.query(
                  "SELECT name, level FROM courses ORDER BY created_at DESC LIMIT 5",
                  (e6, r6) => {
                    if (e6) return res.status(500).json({ message: "DB error" });
                    data.recentCourses = r6;

                    res.json(data);
                  }
                );
              }
            );
          }
        );
      });
    });
  });
});

/* =========================
   ADMIN – VIEW ALL ENQUIRIES
========================= */
router.get("/enquiries", adminAuth, (req, res) => {
  db.query(
    "SELECT * FROM enquiries ORDER BY created_at DESC",
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
      }
      res.json(rows);
    }
  );
});

export default router;

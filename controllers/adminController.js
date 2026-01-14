import db from "../config/db.js";

export const getDashboardStats = (req, res) => {
  const stats = {};

  db.query("SELECT COUNT(*) AS users FROM users", (e1, r1) => {
    if (e1) return res.status(500).json({ message: "DB error" });
    stats.users = r1[0].users;

    db.query("SELECT COUNT(*) AS notices FROM notices", (e2, r2) => {
      if (e2) return res.status(500).json({ message: "DB error" });
      stats.notices = r2[0].notices;

      db.query("SELECT COUNT(*) AS courses FROM courses", (e3, r3) => {
        if (e3) return res.status(500).json({ message: "DB error" });
        stats.courses = r3[0].courses;

        res.json({
          message: "Admin dashboard access granted",
          admin: req.admin,
          stats,
        });
      });
    });
  });
};

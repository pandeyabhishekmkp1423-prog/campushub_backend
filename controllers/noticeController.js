import pool from "../config/db.js";

export const getNotices = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM notices ORDER BY created_at DESC"
  );
  res.json(rows);
};

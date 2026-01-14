import pool from "../config/db.js";

export const getCourses = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM courses");
  res.json(rows);
};

import express from "express";
import supabase from "../config/supabase.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

/* =========================
   ADMIN DASHBOARD
========================= */
router.get("/dashboard", adminAuth, async (req, res) => {
  try {
    const data = {};

    // USERS COUNT
    const { count: usersCount, error: usersErr } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });
    if (usersErr) throw usersErr;
    data.users = usersCount;

    // NOTICES COUNT
    const { count: noticesCount, error: noticesErr } = await supabase
      .from("notices")
      .select("*", { count: "exact", head: true });
    if (noticesErr) throw noticesErr;
    data.notices = noticesCount;

    // COURSES COUNT
    const { count: coursesCount, error: coursesErr } = await supabase
      .from("courses")
      .select("*", { count: "exact", head: true });
    if (coursesErr) throw coursesErr;
    data.courses = coursesCount;

    // RECENT ENQUIRIES
    const { data: recentEnquiries, error: enquiriesErr } = await supabase
      .from("enquiries")
      .select("name, email, phone, course_interest, created_at")
      .order("created_at", { ascending: false })
      .limit(5);
    if (enquiriesErr) throw enquiriesErr;
    data.recentEnquiries = recentEnquiries;

    // RECENT NOTICES
    const { data: recentNotices, error: noticesListErr } = await supabase
      .from("notices")
      .select("title, category, created_at")
      .order("created_at", { ascending: false })
      .limit(5);
    if (noticesListErr) throw noticesListErr;
    data.recentNotices = recentNotices;

    // RECENT COURSES
    const { data: recentCourses, error: coursesListErr } = await supabase
      .from("courses")
      .select("name, level, created_at")
      .order("created_at", { ascending: false })
      .limit(5);
    if (coursesListErr) throw coursesListErr;
    data.recentCourses = recentCourses;

    res.json(data);
  } catch (err) {
    console.error("❌ ADMIN DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Dashboard fetch failed" });
  }
});

/* =========================
   ADMIN – VIEW ALL ENQUIRIES
========================= */
router.get("/enquiries", adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("❌ ENQUIRIES FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch enquiries" });
  }
});

export default router;

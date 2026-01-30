import express from "express";
import supabase from "../config/supabase.js";
import { adminAuth } from "../middleware/adminAuth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* =========================
   ADMIN DASHBOARD (FINAL FIX)
========================= */
router.get("/dashboard", adminAuth, async (_req, res) => {
  try {
    const [
      enquiriesCount,
      noticesCount,
      coursesCount,
      recentEnquiries,
      recentNotices,
      recentCourses,
    ] = await Promise.all([
      // ✅ TOTAL USERS = ENQUIRIES
      supabase.from("enquiries").select("*", { count: "exact" }),

      // ✅ TOTAL NOTICES
      supabase.from("notices").select("*", { count: "exact" }),

      // ✅ TOTAL COURSES
      supabase.from("courses").select("*", { count: "exact" }),

      // RECENT ENQUIRIES
      supabase
        .from("enquiries")
        .select("id, name, email")
        .order("created_at", { ascending: false })
        .limit(5),

      // RECENT NOTICES
      supabase
        .from("notices")
        .select("id, title, category")
        .order("created_at", { ascending: false })
        .limit(5),

      // RECENT COURSES
      supabase
        .from("courses")
        .select("id, name, level")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    return res.status(200).json({
      stats: {
        totalUsers: enquiriesCount.count ?? 0,
        totalNotices: noticesCount.count ?? 0,
        totalCourses: coursesCount.count ?? 0,
      },
      recent: {
        enquiries: recentEnquiries.data ?? [],
        notices: recentNotices.data ?? [],
        courses: recentCourses.data ?? [],
      },
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);

    return res.status(200).json({
      stats: {
        totalUsers: 0,
        totalNotices: 0,
        totalCourses: 0,
      },
      recent: {
        enquiries: [],
        notices: [],
        courses: [],
      },
    });
  }
});

/* =========================
   ADMIN – NOTICES
========================= */
router.get("/notices", adminAuth, async (_req, res) => {
  const { data, error } = await supabase
    .from("notices")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

router.post("/notices", adminAuth, async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category) {
    return res.status(400).json({ message: "All fields required" });
  }

  const { error } = await supabase.from("notices").insert({
    title,
    description,
    category,
  });

  if (error) return res.status(500).json({ message: error.message });
  res.status(201).json({ message: "Notice added" });
});

router.delete("/notices/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("notices").delete().eq("id", id);
  if (error) return res.status(500).json({ message: error.message });
  res.json({ message: "Notice deleted" });
});

/* =========================
   ADMIN – COURSES
========================= */
router.get("/courses", adminAuth, async (_req, res) => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

router.post("/courses", adminAuth, async (req, res) => {
  const { name, level, duration, description } = req.body;
  if (!name || !level) {
    return res.status(400).json({ message: "Name and level required" });
  }

  const { error } = await supabase.from("courses").insert({
    name,
    level,
    duration,
    description,
  });

  if (error) return res.status(500).json({ message: error.message });
  res.status(201).json({ message: "Course added" });
});

router.delete("/courses/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) return res.status(500).json({ message: error.message });
  res.json({ message: "Course deleted" });
});

/* =========================
   ADMIN – ENQUIRIES
========================= */
router.get("/enquiries", adminAuth, async (_req, res) => {
  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

/* =========================
   ADMIN – GALLERY UPLOAD
========================= */
router.post(
  "/gallery/upload",
  adminAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const { category } = req.body;
      const file = req.file;

      if (!category || !file) {
        return res.status(400).json({ message: "category and image required" });
      }

      const ext = file.originalname.split(".").pop();
      const filePath = `${category}/${Date.now()}.${ext}`;

      const { error: storageError } = await supabase.storage
        .from("campus-memories")
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
        });

      if (storageError) {
        return res.status(500).json({ message: storageError.message });
      }

      const { data } = supabase.storage
        .from("campus-memories")
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("gallery_images").insert({
        category,
        image_url: data.publicUrl,
        file_path: filePath,
        is_published: true,
      });

      if (dbError) {
        return res.status(500).json({ message: dbError.message });
      }

      res.status(201).json({ message: "Image uploaded successfully" });
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

export default router;

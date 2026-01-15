import supabase from "../config/supabase.js";

/* =========================
   ADMIN DASHBOARD STATS
========================= */
export const getDashboardStats = async (req, res) => {
  try {
    // Users count
    const { count: users } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    // Notices count
    const { count: notices } = await supabase
      .from("notices")
      .select("*", { count: "exact", head: true });

    // Courses count
    const { count: courses } = await supabase
      .from("courses")
      .select("*", { count: "exact", head: true });

    res.json({
      message: "Admin dashboard access granted",
      admin: req.admin,
      stats: {
        users,
        notices,
        courses,
      },
    });
  } catch (err) {
    console.error("❌ DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Dashboard fetch failed" });
  }
};

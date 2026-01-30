import supabase from "../config/supabase.js";

/* =========================
   GET PUBLIC NOTICES
========================= */
export const getNotices = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("notices")
      .select("id, title, description, category, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // ✅ CONSISTENT RESPONSE
    res.status(200).json({
      success: true,
      data: data || [],
    });
  } catch (err) {
    console.error("GET /notices error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notices",
    });
  }
};

/* =========================
   ADD NOTICE (ADMIN)
========================= */
export const addNotice = async (req, res) => {
  try {
    let { title, description, category } = req.body;

    // ✅ BASIC VALIDATION
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ NORMALIZE CATEGORY
    category = category.toLowerCase().trim();

    const { error } = await supabase.from("notices").insert([
      {
        title: title.trim(),
        description: description.trim(),
        category,
      },
    ]);

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Notice added successfully",
    });
  } catch (err) {
    console.error("POST /admin/notices error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to add notice",
    });
  }
};

/* =========================
   DELETE NOTICE (ADMIN)
========================= */
export const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Notice ID required",
      });
    }

    const { error } = await supabase
      .from("notices")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: "Notice deleted successfully",
    });
  } catch (err) {
    console.error("DELETE /admin/notices error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete notice",
    });
  }
};

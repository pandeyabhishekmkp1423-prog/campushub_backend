import supabase from "../config/supabase.js";

export const getNotices = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addNotice = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const { error } = await supabase.from("notices").insert([
      { title, description, category },
    ]);

    if (error) throw error;

    res.json({ message: "Notice added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteNotice = async (req, res) => {
  try {
    const { error } = await supabase
      .from("notices")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;

    res.json({ message: "Notice deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

import supabase from "../config/supabase.js";

export const getCourses = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addCourse = async (req, res) => {
  try {
    const { name, level, duration, description } = req.body;

    const { error } = await supabase.from("courses").insert([
      { name, level, duration, description },
    ]);

    if (error) throw error;

    res.json({ message: "Course added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;

    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

import supabase from "../config/supabase.js";

export const addImage = async (req, res) => {
  try {
    const { category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const { error } = await supabase.from("gallery_images").insert([
      {
        category,
        image_url: req.file.path,
      },
    ]);

    if (error) throw error;

    res.json({ message: "Image uploaded successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getImagesByCategory = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("image_url")
      .eq("category", req.params.category)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

import supabase from "../config/supabase.js";

export const submitEnquiry = async (req, res) => {
  try {
    const { name, email, phone, course_interest, message } = req.body;

    if (!name || !email || !phone || !course_interest) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const { error } = await supabase.from("enquiries").insert([
      { name, email, phone, course_interest, message },
    ]);

    if (error) throw error;

    res.json({ message: "Enquiry submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

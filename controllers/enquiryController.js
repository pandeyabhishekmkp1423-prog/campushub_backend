import supabase from "../config/supabase.js";

/* =========================
   CREATE ENQUIRY (PUBLIC)
========================= */
export const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, course_interest, message } = req.body;

    const { error } = await supabase.from("enquiries").insert([
      {
        name,
        email,
        phone,
        course_interest,
        message,
      },
    ]);

    if (error) throw error;

    res.status(201).json({ message: "Enquiry submitted successfully" });
  } catch (err) {
    console.error("❌ ENQUIRY ERROR:", err);
    res.status(500).json({ message: "Failed to submit enquiry" });
  }
};

/* =========================
   GET ENQUIRIES (ADMIN)
========================= */
export const getAllEnquiries = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("❌ FETCH ENQUIRIES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch enquiries" });
  }
};

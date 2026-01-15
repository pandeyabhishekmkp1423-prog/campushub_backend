import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import supabase from "../config/supabase.js";

/* =========================
   REGISTER (STUDENT)
========================= */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check duplicate email
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await supabase.from("users").insert([
      {
        name,
        email,
        password: hashedPassword,
        role: "student",
      },
    ]);

    if (error) throw error;

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ REGISTER ERROR:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

/* =========================
   LOGIN (STUDENT)
========================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
    });
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

/* =========================
   LOGIN (ADMIN ONLY)
========================= */
export const adminLogin = async (req, res) => {
  try {
    console.log("🔥 adminLogin HIT", req.body);

    const { email, password } = req.body;

    const { data: admin, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("role", "admin")
      .single();

    if (error || !admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: admin.role,
      name: admin.name,
    });
  } catch (err) {
    console.error("❌ ADMIN LOGIN ERROR:", err);
    res.status(500).json({ message: "Admin login failed" });
  }
};

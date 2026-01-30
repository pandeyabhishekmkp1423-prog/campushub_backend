import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import supabase from "../config/supabase.js";

/* =========================
   REGISTER (STUDENT)
========================= */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const { data: existing, error: existError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (existError) {
      console.error("SUPABASE CHECK ERROR:", existError);
      return res.status(500).json({ message: "Registration failed" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await supabase.from("users").insert({
      name,
      email,
      password: hashedPassword,
      role: "student",
    });

    if (error) {
      console.error("SUPABASE INSERT ERROR:", error);
      return res.status(500).json({ message: "Registration failed" });
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
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
      .maybeSingle();

    if (!user || error) {
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
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

/* =========================
   LOGIN (ADMIN ONLY) ✅ FINAL FIX
========================= */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // ✅ USE maybeSingle() — avoids false 404 / silent crash
    const { data: admin, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (!admin || error) {
      console.error("ADMIN NOT FOUND:", error);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin.id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: "admin",
      name: admin.name,
    });
  } catch (err) {
    console.error("ADMIN LOGIN ERROR:", err);
    res.status(500).json({ message: "Admin login failed" });
  }
};

import dotenv from "dotenv";
dotenv.config(); // ✅ MUST BE FIRST

import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://campushub-frontend.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/notices", noticeRoutes);
app.use("/gallery", galleryRoutes);
app.use("/courses", courseRoutes);
app.use("/admin/enquiries", enquiryRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("CampusHub API running");
});

app.get("/health", (req, res) => {
  res.send("OK");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

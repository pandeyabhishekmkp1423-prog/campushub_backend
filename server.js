import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/notices", noticeRoutes);
app.use("/gallery", galleryRoutes);
app.use("/courses", courseRoutes);

/* ✅ PUBLIC ENQUIRY */
app.use("/public", enquiryRoutes);

/* ✅ ADMIN */
app.use("/admin", adminRoutes);

app.get("/", (req, res) => res.send("CampusHub API running"));

app.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);

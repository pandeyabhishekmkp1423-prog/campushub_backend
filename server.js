import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

dotenv.config();

const app = express();

/* =========================
   CORS
========================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://campushub-frontend.vercel.app",
    ],
    credentials: true,
  })
);

/* =========================
   MIDDLEWARES
========================= */
app.use(express.json());

/* =========================
   ROUTES
========================= */
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/", publicRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (_, res) => {
  res.send("CampusHub API running");
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

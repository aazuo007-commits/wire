import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import uploadRoutes from "./routes/upload.js";
import logoRoutes from "./routes/logos.js";
import bannerRoutes from "./routes/banners.js";
import serviceRoutes from "./routes/services.js";
import projectRoutes from "./routes/projects.js";
import expertiseRoutes from "./routes/expertise.js";
import industryRoutes from "./routes/industries.js";
import technologyRoutes from "./routes/technologies.js";
import partnerRoutes from "./routes/partners.js";
import contactRoutes from "./routes/contact.js";
import templateRoutes from "./routes/templates.js";
import settingsRoutes from "./routes/settings.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// NOTE: uploaded files (images/video/pdf/doc) now live on Cloudinary, not on local
// disk, so there is no local "/uploads" static route anymore — see routes/upload.js.

app.get("/api/health", (req, res) => res.json({ success: true, message: "Wirecto API is running" }));

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/logos", logoRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/expertise", expertiseRoutes);
app.use("/api/industries", industryRoutes);
app.use("/api/technologies", technologyRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/settings", settingsRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Wirecto API listening on port ${PORT}`));

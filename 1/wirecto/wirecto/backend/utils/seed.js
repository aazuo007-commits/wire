import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";
import Logo from "../models/Logo.js";
import Service from "../models/Service.js";
import Technology from "../models/Technology.js";

dotenv.config();

const run = async () => {
  await connectDB();

  // 1. Superadmin
  const email = (process.env.SUPERADMIN_EMAIL || "admin@wirecto.com").toLowerCase();
  const existing = await Admin.findOne({ email });
  if (!existing) {
    await Admin.create({
      name: process.env.SUPERADMIN_NAME || "Super Admin",
      email,
      password: process.env.SUPERADMIN_PASSWORD || "ChangeMe@123",
      role: "superadmin",
    });
    console.log(`Superadmin created: ${email}`);
  } else {
    console.log("Superadmin already exists, skipping.");
  }

  // 2. Default logo (only if none exist yet)
  // NOTE: this is just a starter placeholder — replace it from Admin > Logo,
  // which uploads directly to Cloudinary.
  if ((await Logo.countDocuments()) === 0) {
    await Logo.create({
      name: "Wirecto",
      imageUrl: "https://placehold.co/200x60?text=Wirecto",
      isActive: true,
    });
    console.log("Default logo placeholder created.");
  }

  // 3. A couple of sample services (optional starter content)
  if ((await Service.countDocuments()) === 0) {
    await Service.insertMany([
      {
        title: "Web Design & Development",
        slug: "web-design-development",
        shortDescription: "Custom, high-performing websites built for growth.",
        description:
          "We design and build fast, modern, SEO-friendly websites tailored to your business goals — from marketing sites to complex web applications.",
        order: 1,
      },
      {
        title: "Mobile App Development",
        slug: "mobile-app-development",
        shortDescription: "Native and cross-platform apps for iOS & Android.",
        description:
          "Our team builds native and cross-platform mobile apps that are fast, reliable, and designed around your users' needs.",
        order: 2,
      },
      {
        title: "Software Development",
        slug: "software-development",
        shortDescription: "Robust, scalable custom software solutions.",
        description:
          "From internal tools to full SaaS platforms, we design and build custom software that scales with your business.",
        order: 3,
      },
    ]);
    console.log("Sample services created.");
  }

  // 4. Sample technologies
  if ((await Technology.countDocuments()) === 0) {
    await Technology.insertMany([
      { name: "React", category: "Frontend", logoUrl: "https://placehold.co/80x80?text=React", order: 1 },
      { name: "Node.js", category: "Backend", logoUrl: "https://placehold.co/80x80?text=Node", order: 2 },
      { name: "MongoDB", category: "Database", logoUrl: "https://placehold.co/80x80?text=Mongo", order: 3 },
    ]);
    console.log("Sample technologies created.");
  }

  console.log("Seeding complete.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

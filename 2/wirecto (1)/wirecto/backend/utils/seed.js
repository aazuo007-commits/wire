import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";
import Logo from "../models/Logo.js";
import Service from "../models/Service.js";
import Technology from "../models/Technology.js";
import Career from "../models/Career.js";
import BlogCategory from "../models/BlogCategory.js";
import Blog from "../models/Blog.js";

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

  // 5. Sample career postings
  if ((await Career.countDocuments()) === 0) {
    await Career.insertMany([
      {
        title: "Frontend Developer (React)",
        slug: "frontend-developer-react",
        department: "Engineering",
        location: "Remote / Noida",
        jobType: "Full-time",
        experience: "2-4 years",
        description: "We're looking for a Frontend Developer to build and maintain client-facing React applications.",
        requirements: "Strong React & JavaScript fundamentals, experience with REST APIs, good eye for UI detail.",
        order: 1,
      },
      {
        title: "Backend Developer (Node.js)",
        slug: "backend-developer-nodejs",
        department: "Engineering",
        location: "Remote / Noida",
        jobType: "Full-time",
        experience: "2-5 years",
        description: "Join our backend team to design and build scalable APIs and services powering our products.",
        requirements: "Node.js, Express, MongoDB, understanding of REST API design and authentication.",
        order: 2,
      },
      {
        title: "UI/UX Designer",
        slug: "ui-ux-designer",
        department: "Design",
        location: "Remote / Noida",
        jobType: "Full-time",
        experience: "1-3 years",
        description: "Design intuitive, polished interfaces for our web and mobile products, working closely with engineering.",
        requirements: "Figma proficiency, a strong portfolio, understanding of responsive design principles.",
        order: 3,
      },
    ]);
    console.log("Sample career postings created.");
  }

  // 6. Sample blog category + a step-by-step tutorial blog post (for learning purposes)
  let devCategory = await BlogCategory.findOne({ slug: "web-development" });
  if (!devCategory) {
    devCategory = await BlogCategory.create({ name: "Web Development", order: 1 });
    console.log("Sample blog category created.");
  }

  if ((await Blog.countDocuments()) === 0) {
    await Blog.create({
      title: "Building A MERN Blog CRUD With A Rich Text Editor — Step By Step",
      category: devCategory._id,
      author: "Wirecto Team",
      excerpt:
        "A beginner-friendly, step-by-step walkthrough of how a blog module (categories, a rich text editor, SEO fields, and grid/list views) gets built on the MERN stack — written for learning purposes.",
      tags: ["mern", "tutorial", "mongodb", "express", "react", "nodejs"],
      isFeatured: true,
      content: `
        <p>This post walks through, step by step, how a full "Blog" feature — categories, a rich text
        editor, SEO fields, and public grid/list views — gets added to a MERN (MongoDB, Express, React,
        Node.js) application. It's written for learning purposes: each step explains <em>why</em>, not
        just <em>what</em>.</p>

        <h2>Step 1: Design the data model first</h2>
        <p>Before writing any routes or UI, decide what a "blog post" actually needs to store: a title,
        a unique slug for its URL, a category, an author, a cover image, the rich content itself, tags,
        and a nested set of SEO fields (meta title, meta description, keywords, social image, canonical
        URL). Getting the schema right first saves a lot of rework later.</p>

        <h2>Step 2: Build the category model and CRUD routes</h2>
        <p>Categories are simpler than posts, so build them first: a <code>name</code> and a
        <code>slug</code>. Wire up standard create/read/update/delete routes, protected so only a
        superadmin can manage them, but with a public read endpoint so the website can list them.</p>

        <h2>Step 3: Add automatic, unique slug generation</h2>
        <p>Typing a URL-safe slug by hand is error-prone. Instead, generate it automatically from the
        title (lowercase, spaces to hyphens, special characters stripped) in a pre-save hook, and check
        the database for collisions — appending <code>-2</code>, <code>-3</code>, and so on until it's
        unique. This means an admin can just type a normal title and get a clean, working URL for free.</p>

        <h2>Step 4: Build the Blog model and its routes</h2>
        <p>With categories in place, build the Blog schema referencing a category by ID, plus a public
        endpoint to fetch a single post by its slug (used by the detail page) and a public endpoint to
        list all published posts, newest first.</p>

        <h2>Step 5: Wire up a rich text editor in the admin panel</h2>
        <p>Plain textareas aren't enough for real blog content. Add a WYSIWYG editor to the admin form —
        headings, bold/italic, lists, links, images, code blocks — that outputs clean HTML. That HTML is
        saved directly to the post's <code>content</code> field and rendered as-is on the public page.</p>

        <h2>Step 6: Add the SEO fields</h2>
        <p>Group meta title, meta description, keywords, a social-share (Open Graph) image, and a
        canonical URL into their own section of the admin form. On the public detail page, read these
        values and set the page's <code>&lt;title&gt;</code> and <code>&lt;meta&gt;</code> tags
        dynamically whenever a post loads.</p>

        <h2>Step 7: Build the public grid and list views</h2>
        <p>On the frontend, fetch the list of posts once and let the user toggle between a card-based
        grid view and a more compact list view — same data, two layouts. Add category filter buttons
        that just filter the already-loaded list on the client.</p>

        <h2>Step 8: Show a preview on the homepage</h2>
        <p>Finally, pull a handful of the latest posts onto the homepage, with the exact number
        controlled by a simple admin setting — so the homepage can show 3, 6, or however many posts
        make sense, without touching any code.</p>

        <p>That's the whole feature, end to end: a data model, protected CRUD routes, an editor, SEO
        metadata, and two ways to browse the result. The same pattern — model → routes → admin form →
        public page — is worth reusing for almost any content type you add to a site like this.</p>
      `,
    });
    console.log("Sample tutorial blog post created.");
  }

  console.log("Seeding complete.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

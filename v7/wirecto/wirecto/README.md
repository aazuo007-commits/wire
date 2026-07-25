# Wirecto — IT Company Website (MERN)

Full-stack IT company website: **React + Vite** frontend, **Node.js + Express** backend,
**MongoDB** database, with a superadmin dashboard to manage all site content.

Pages: Home · About Us · Services · Project · Blog · Careers · Contact
Admin CRUD: Logo · Hero Slider (Banners) · Services · Projects · Expertise · Industries · Technology · Partners · Careers · Blogs · Blog Categories · Topics · Parent Menus · Submenu Items · Legal/Policy Pages

Latest updates:
- **Homepage Hero Slider**: the existing Banners module now powers a real slider on Home —
  auto-rotates every ~4.5s, smooth fade transitions, manual prev/next arrows, and pagination dots.
- **Technology Management enhanced**: technologies now have a slug, banner image, short/full
  description, key features, benefits, and a "Featured on Home" flag, plus a dedicated details
  page at `/technologies/<slug>` (banner, logo, features, benefits, related services, a
  "Start Your Project" CTA, and related technologies).
- **Project Details page rebuilt**: projects now support an image gallery, a technologies-used
  tag list, and Features/Challenges/Solution/Results sections, plus a right-hand sidebar showing
  4–6 other recent/related projects. Live at `/projects/<slug>`.
- **Partner Logo Slider**: the existing Partners module now powers an infinite auto-scrolling logo
  marquee on the homepage — pauses on hover, click-through to each partner's site, speed
  configurable from Admin → Settings.
- **Homepage Technology section**: shows technologies marked "Featured on Home" as cards (logo,
  name, short description, View Details button); count configurable from Admin → Settings.
- **Site-wide search**: a prominent search bar on the homepage searches Services, Blogs,
  Technologies, Topics, Projects, and Navigation Menu submenu items all at once, with a live
  results dropdown.

> **Naming note:** Technology detail pages live at `/technologies/<slug>` (plural) — deliberately
> different from `/technology/<submenuSlug>` (singular), which belongs to the Parent Menu
> "Technology" from the Navigation Menu module (section 11). They're separate systems that happen
> to share a name; the plural/singular split keeps their URLs from colliding.

Latest updates:
- **Header nav fixed and reordered**: Home · About Us · Services ▾ · Expertise ▾ · Industries ▾ ·
  Technology ▾ · Project · Blog · Careers · Contact — all items now sit on the same vertical
  baseline (the misalignment was a missing `align-items: center` on the nav container). Every
  dropdown (Services, and each dynamic Parent Menu) is a wide "mega menu" listing **all** its
  items with a search box once there are more than a handful.
- **Footer rebuilt**: dynamic logo + company tagline (from Admin → Settings), a **Quick Links**
  column, a merged **Popular Links** column (Topics + Parent Menu items marked "Show In Footer"),
  a **Get In Touch** column (phone/email/address + social icons, all from Admin → Settings), and
  a bottom bar with **© {year} Wirecto. All Rights Reserved.** plus a legal links row (Privacy
  Policy, Terms & Conditions, Refund & Cancellation Policy, Shipping & Delivery Policy — managed
  from Admin → Legal / Policies).
Bonus: **Templates** — import any content block from an external REST API.

Navigation Menu module (Admin → **Parent Menus** / **Submenu Items**) turns the site's whole
navigation into admin-managed data:
- Create unlimited **Parent Menus** (Expertise, Industries, Technology, Partners, and any future
  ones like Solutions or Products) with header/footer visibility toggles
- Each parent gets unlimited **Submenu Items**, each with its own rich content, featured + banner
  images, and SEO fields, at a clean URL like `/expertise/cloud-erp` or `/technology/react-js`
- The Navbar and Footer render these dynamically — hover dropdowns on desktop, a tap-to-expand
  accordion on mobile — with zero code changes needed to add a new menu or page

Topics is a dedicated Content Management module (Admin → **Topics**) for unlimited, fully
dynamic pages that need no code changes to add:
- Rich text content, a featured image, and a short + full description
- Per-topic checkboxes for **Show In Navbar**, **Show In Footer**, and **Show On Homepage**
- A configurable homepage display limit (3, 4, or any number, set in Admin → Settings)
- Admin search, status filter, sort (display order/latest/oldest), and pagination
- A dedicated, SEO-friendly detail page at `/topics/<slug>` with breadcrumb navigation,
  related topics, and social share buttons

Blogs work as a small CMS:
- Admin creates/updates/deletes blog posts using a **rich text editor** (headings, bold/italic, lists,
  links, images, code blocks) and organizes them into **categories** (also full CRUD).
- Each post has its own **SEO fields** (meta title, meta description, keywords, social-share image,
  canonical URL) that get applied to the page's `<title>` and `<meta>` tags automatically.
- The public **Blog** page has a **grid/list view toggle** plus category filters.
- Clicking a post opens its detail page at `/blog/<slug>`.
- The homepage shows a **configurable number of latest posts** (default 3) via Admin → Settings.
- Every slug (Services, Careers, Blogs, Blog Categories) is **auto-generated and guaranteed unique** —
  admins can just type a title/name and leave the slug field blank.

Careers works as a full mini job board:
- Admin creates/updates/deletes job postings (title, department, location, job type, experience, description, requirements).
- The public **Careers** page lists them in a toggleable **grid or list view**.
- Clicking a job opens its detail page (`/careers/<slug>`) with an **"Apply Now" form** — name, email, phone,
  experience, location, resume upload (PDF/DOC/DOCX), and a comment.
- Submissions land in **Admin → Applications**, where the resume, applicant details, and comment are all visible,
  searchable by name/email/phone, and sortable by latest/oldest.

Key behaviors:
- All file uploads (images, video, PDF, DOC/DOCX) go straight to **Cloudinary** — nothing is stored on local disk.
- Any Service added/edited/removed in the admin dashboard **instantly shows up in the site's Services dropdown menu** (no code changes needed).
- The number of services shown on the **homepage is admin-configurable** (e.g. 6, 9, 12, or any custom number) via Admin → Settings; the full list still shows on the `/services` page.
- Every service automatically gets its own detail page at `/services/<slug>`, e.g. `/services/web-design-development`.

```
wirecto/
├── backend/     Express API + MongoDB (Mongoose) + Cloudinary uploads
└── frontend/    React 18 + Vite
```

---

## 1. Prerequisites

- Node.js 18+ (needed for the built-in `fetch` used by template imports)
- MongoDB running locally, or a MongoDB Atlas connection string
- A free [Cloudinary](https://cloudinary.com) account (for image/video/PDF/DOC uploads)
- npm

---

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/wirecto
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
SUPERADMIN_NAME=Super Admin
SUPERADMIN_EMAIL=admin@wirecto.com
SUPERADMIN_PASSWORD=ChangeMe@123
CLIENT_URL=http://localhost:5173

# Cloudinary (all uploads — images, video, PDF, DOC/DOCX — go here)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Getting your Cloudinary credentials:**
1. Sign up free at https://cloudinary.com and log in.
2. On the Dashboard home page, copy **Cloud Name**, **API Key**, and **API Secret**.
3. Paste them into `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` above.
4. That's it — no bucket setup or SDK config needed; `config/cloudinary.js` picks these up automatically.

Create the superadmin account + starter content:

```bash
npm run seed
```

Start the API:

```bash
npm run dev      # nodemon, auto-restart
# or
npm start
```

API runs at `http://localhost:5000`. Health check: `GET /api/health`.

---

## 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Site runs at `http://localhost:5173`. Vite is pre-configured to proxy `/api`
requests to `http://localhost:5000` in dev, so no CORS setup is needed.
Uploaded files themselves are served directly from Cloudinary's CDN (their
URLs look like `https://res.cloudinary.com/...`), not from this server.

---

## 4. Using the admin dashboard

1. Go to `http://localhost:5173/admin/login`
2. Log in with the superadmin credentials from your `.env` (`SUPERADMIN_EMAIL` / `SUPERADMIN_PASSWORD`)
3. From the sidebar you can create/update/delete:
   - **Parent Menus** and **Submenu Items** — the dynamic navigation module (see section 11)
   - **Topics** — unlimited dynamic pages with navbar/footer/homepage visibility controls (see section 10)
   - **Logo** — the header logo shown site-wide
   - **Hero Slider** — homepage hero slides (see section 13)
   - **Services**, **Expertise**, **Industries**, **Partners**
   - **Technology** — now with detail pages, key features/benefits, and a "Featured on Home" flag (see section 13)
   - **Projects** — now with a gallery, technologies used, and Features/Challenges/Solution/Results (see section 13)
   - **Careers** — job postings, plus **Applications** to review resumes/details submitted via "Apply Now"
   - **Blogs** and **Blog Categories** — posts with a rich text editor and SEO fields
   - **Templates** — custom content blocks, including ones imported from any REST API
   - **Settings** — site-wide configuration: homepage counts, plus footer company info, contact details, and social links (see section 12)
   - **Legal / Policies** — Privacy Policy, Terms & Conditions, Refund & Cancellation Policy, Shipping & Delivery Policy, and any others (see section 12)
   - **Messages** — contact form submissions

Every resource supports file upload, ordering, and an active/inactive toggle.

> **Note on naming:** the sidebar has both a flat **Expertise / Industries / Technology / Partners**
> CRUD (simple cards used on the Home and About pages, no detail pages) *and* a Parent Menu named
> "Expertise" etc. under **Parent Menus / Submenu Items** (full dropdown + detail-page system, at
> URLs like `/expertise/cloud-erp`). These are intentionally separate — the flat CRUD is for quick
> homepage highlights, the Parent Menu system is for the deep, SEO-friendly navigation structure
> described in section 11. Both happen to reuse the same names because the spec examples do.
Two upload field types are available:
- **Image** fields (logo, banners, service/project photos, technology/partner logos) accept
  `jpg / png / gif / webp / svg` only, uploaded straight to Cloudinary.
- **File** fields (currently a service's optional intro video and brochure) accept images,
  video (`mp4 / webm / mov`), or documents (`pdf / doc / docx`) — also uploaded straight to
  Cloudinary, with a smart preview (image thumbnail, video player, or a "View uploaded file" link).

---

## 5. Adding a template from any REST API — step by step

This is the most flexible feature: instead of only being able to add content
through the built-in forms, the superadmin can pull a ready-made content block
(HTML or JSON) from **any external REST API** and drop it straight into the site.

### How it works

- `POST /api/templates/import` takes `{ name, key, sourceUrl, placement }`
- The **backend** (not the browser) calls `sourceUrl` — this avoids CORS issues
  since the external API only ever sees a server-to-server request
- The response is saved as a `Template` document:
  - JSON response → stored as `type: "json"`
  - Anything else (HTML, plain text) → stored as `type: "html"`
- The template is then fetched publicly via `GET /api/templates/by-key/:key`
  and rendered anywhere on the site with the `<TemplateBlock templateKey="..." />`
  component

### Step-by-step: import a template via the admin UI

1. Log in to `/admin` and open **Templates** in the sidebar.
2. Fill in the "Import Template From REST API" form:
   - **Name** — a human-readable label, e.g. `Homepage Testimonials Widget`
   - **Key** — a URL-safe identifier you'll reference in code, e.g. `home-testimonials`
   - **Source REST API URL** — the full URL of the external API endpoint that
     returns the HTML or JSON you want to embed, e.g.
     `https://api.example.com/widgets/testimonials`
   - **Placement** — a free-text label for where it's meant to go, e.g. `home`
3. Click **Import Template**. The backend fetches the URL, stores the result,
   and the new template appears in the table below.
4. If the external API's content changes later, use **resync** (see API section
   below) to refresh it without re-entering the URL.

### Step-by-step: import a template directly via the API (e.g. with curl)

```bash
# 1. Log in and grab a token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wirecto.com","password":"ChangeMe@123"}'
# → copy the "token" value from the response

# 2. Import a template from any REST API
curl -X POST http://localhost:5000/api/templates/import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
        "name": "Latest Case Studies",
        "key": "home-case-studies",
        "sourceUrl": "https://api.example.com/case-studies/latest",
        "placement": "home"
      }'

# 3. Re-fetch it later if the source API changes (replace <ID> with the returned _id)
curl -X POST http://localhost:5000/api/templates/<ID>/resync \
  -H "Authorization: Bearer <TOKEN>"

# 4. Fetch it publicly (no auth needed) to confirm it's live
curl http://localhost:5000/api/templates/by-key/home-case-studies
```

### Step-by-step: render the imported template on a page

1. Open the page component where you want it to appear, e.g. `frontend/src/pages/Home.jsx`.
2. Import the renderer:
   ```jsx
   import TemplateBlock from "../components/TemplateBlock.jsx";
   ```
3. Drop it in wherever you want the content to show, using the same `key` you
   imported it with:
   ```jsx
   <TemplateBlock templateKey="home-case-studies" />
   ```
4. Save — Vite hot-reloads, and the imported content (HTML or JSON) renders in place.

### Notes on the two content types

- **HTML templates** are rendered as-is. Since they come from an admin-only,
  authenticated import step, this is safe for content you control — but avoid
  importing from untrusted third-party APIs, since raw HTML is injected into
  the page.
- **JSON templates** are rendered as a formatted JSON block by default in
  `TemplateBlock.jsx`. In practice you'll usually customize that component (or
  write a page-specific one) to map the JSON fields to your own markup —
  e.g. a testimonials carousel, a pricing table, a partner grid, etc. The data
  is available at `template.content`.

### Manually creating a template (no external API)

You don't have to import from a URL — the **Templates** page also has a normal
CRUD form where you can type a `key`, pick `type: html` or `type: json`, and
paste content directly into the `content` field. This is useful for one-off
custom blocks that don't come from another system.

---

## 6. Services: menu, homepage count, and detail pages

These three pieces work together automatically — there's nothing to wire up
by hand once a service exists in the database.

### Services show up in the navigation menu automatically

The **Navbar** (`frontend/src/components/Navbar.jsx`) fetches `GET /api/services`
on load and renders each active service as a dropdown item under "Services" in
the main menu. Add, rename, reorder, or delete a service from Admin → Services,
and the menu updates the next time the page loads — no code changes needed.

### Configuring how many services show on the homepage

By default the homepage shows 6 services. To change it:

1. Go to Admin → **Settings**
2. Under "Homepage Services", pick a preset (3 / 6 / 9 / 12) or type any custom number
3. Click **Save Settings**

This is backed by `GET/PUT /api/settings` (a single settings document with a
`homeServicesCount` field) and read by `frontend/src/pages/Home.jsx`, which
slices the services list to that count. The full, unfiltered list always
remains visible on the `/services` page regardless of this setting.

### Service detail pages

Every service automatically gets a detail page at `/services/<slug>` — for
example, a service with slug `web-design-development` is reachable at:

```
http://localhost:5173/services/web-design-development
```

- The slug comes straight from the `slug` field you set when creating/editing
  the service in Admin → Services (keep it lowercase and hyphenated).
- The detail page (`frontend/src/pages/ServiceDetail.jsx`) is powered by the
  public endpoint `GET /api/services/slug/:slug` and shows the full
  description, image, optional intro/demo video, and an optional brochure
  download button (if you uploaded a PDF/DOC for that service).
- Both the homepage service cards and the `/services` listing page link
  directly to each service's detail page.

---

## 7. Careers: job postings, apply form, and reviewing applicants

### Admin: create a job posting

1. Go to Admin → **Careers**
2. Fill in the form: Job Title, Slug (e.g. `frontend-developer`), Department, Location,
   Job Type, Experience Required, Description, Requirements
3. Click **Create** — the job now appears on the public `/careers` page immediately

### Public site: browsing and applying

1. `/careers` shows all active job postings, with a **Grid View / List View** toggle
2. Clicking any job opens `/careers/<slug>`, e.g. `/careers/frontend-developer`, showing
   the full description, requirements, and an **Apply For This Job** form:
   - Name *
   - Email *
   - Phone *
   - Experience (in years) *
   - Location *
   - Select File — Upload Your Resume Here * (PDF or DOC/DOCX only)
   - Comment *
3. Clicking **Apply Now** uploads the resume to Cloudinary and saves the application —
   backed by `POST /api/careers/:id/apply` (multipart form, public endpoint, no login required)

### Admin: reviewing applicants

1. Go to Admin → **Applications**
2. Every submission shows the applicant's name, email, phone, job applied for, experience,
   location, a **View Resume** link (opens the Cloudinary-hosted PDF/DOC), and their comment
   (via the **Details** toggle on each row)
3. Use the **search box** to filter by name, email, or phone (case-insensitive, matches any of the three)
4. Use the **sort dropdown** to switch between latest-first and oldest-first
5. Mark an application as read, or delete it, from the row actions

This is backed by `GET /api/applications?search=...&sort=latest|oldest` (admin-only).

---

## 8. Blogs: categories, rich editor, SEO, and grid/list views

### Admin: managing categories and posts

1. Go to Admin → **Blog Categories** and add a category (e.g. "Web Development") — just a name,
   the slug generates itself.
2. Go to Admin → **Blogs** and click **Add New Blog Post**:
   - Title, (optional) Slug, Category, Author, Tags, Order, Cover Image, Featured, Active
   - **Excerpt** — the short summary shown on grid/list cards and the homepage
   - **Content** — the full rich text editor (bold/italic, headings, lists, links, images, code
     blocks, blockquotes); it saves as HTML
   - **SEO** section — Meta Title, Meta Description, Meta Keywords, Canonical URL, and an
     Open Graph (social share) image
3. Click **Create** — the post appears on `/blog` immediately (if Active is checked)

### Public site

- `/blog` lists all published posts with a **Grid View / List View** toggle and category filter buttons
- `/blog/<slug>` (e.g. `/blog/building-a-mern-blog-crud-with-a-rich-text-editor-step-by-step`) shows
  the full post; the page's title and meta tags update to match that post's SEO fields while you're
  on it, and revert when you navigate away
- The homepage shows the latest posts (default 3) — change this count from Admin → Settings, the same
  place that controls the homepage services count

A seeded example post ("Building A MERN Blog CRUD With A Rich Text Editor — Step By Step") is
included via `npm run seed` — it's a real, step-by-step tutorial blog post (written for learning
purposes) that walks through how this exact Blog feature was built, model → routes → admin form →
public page. Open it after seeding to see the rich text editor's output rendered on a real detail page.

---

## 9. Auto-generated, unique slugs

Services, Careers, Blogs, and Blog Categories all auto-generate their `slug` field from the
title/name if left blank — and the backend guarantees uniqueness by checking the database and
appending `-2`, `-3`, etc. if needed (see `backend/utils/slugify.js`). This means:

- Admins can leave the Slug field blank and get a clean, working URL for free
- Typing a custom slug still works — it just also gets uniqueness-checked the same way
- Two posts titled "Our New Service" won't collide; the second one automatically becomes
  `our-new-service-2`

---

## 10. Content Management → Topics

This is the most flexible content module in the admin: unlimited topics, each independently
controllable across the Navbar, Footer, Homepage, and its own detail page — no code required.

### Admin: creating a topic

1. Go to Admin → **Topics** (near the top of the sidebar)
2. Fill in the form:
   - **Title** — required; the Slug auto-generates from it if left blank (editable, always kept unique)
   - **Display Order** — controls sequence everywhere the topic appears
   - **Featured Image** — uploaded to Cloudinary, shown with a preview
   - **Short Description** (100–250 characters) — used on homepage cards and the detail page intro
   - **Full Description** — the rich text editor (headings H1–H6, bold/italic/underline, font
     color, bullet/numbered lists, links, images, code blocks, quotes, alignment, undo/redo);
     saves as HTML
   - **Visibility**: Active, Show In Navbar, Show In Footer, Show On Homepage — check any
     combination you need
   - **SEO** (optional): Meta Title, Meta Description, Meta Keywords
3. Click **Create** — depending on which visibility boxes were checked, it now appears in the
   relevant places immediately (no rebuild, no code change)

### Admin: search, filter, sort, and pagination

Above the topics table:
- **Search box** — matches title or slug
- **Status dropdown** — All / Active / Inactive
- **Sort dropdown** — Display Order / Latest First / Oldest First
- Results are paginated (10 per page) with Prev/Next controls beneath the table

### Where topics show up on the public site

- **Navbar**: any active topic with "Show In Navbar" checked appears in a **Topics** dropdown
  menu, ordered by Display Order (`GET /api/topics?navbar=true`)
- **Footer**: any active topic with "Show In Footer" checked appears under a **Topics** quick-links
  column (`GET /api/topics?footer=true`)
- **Homepage**: any active topic with "Show On Homepage" checked appears in a homepage Topics
  section, limited to the count set in Admin → Settings → "Number Of Topics On Home Page"
  (`GET /api/topics?homepage=true&limit=N`)
- **`/topics`**: a full grid listing of every active topic
- **`/topics/<slug>`**: the dedicated detail page — featured banner image, breadcrumb
  (Home / Topics / Title), short description, full rich content, up to 3 related topics, and
  social share buttons (Facebook, X/Twitter, LinkedIn, WhatsApp)

### API reference

```
GET  /api/topics                          -> all active topics (public /topics page)
GET  /api/topics?navbar=true               -> active + Show In Navbar
GET  /api/topics?footer=true               -> active + Show In Footer
GET  /api/topics?homepage=true&limit=4     -> active + Show On Homepage, limited
GET  /api/topics?admin=true&search=&status=&sortBy=&page=&limit=   -> superadmin, paginated
GET  /api/topics/slug/:slug                -> one topic + up to 3 related topics
POST /api/topics                           -> create (superadmin)
PUT  /api/topics/:id                       -> update (superadmin)
DELETE /api/topics/:id                     -> delete (superadmin)
```

Four sample topics (Artificial Intelligence, Cloud Computing, Cybersecurity, Data Analytics) are
included via `npm run seed` so the Navbar dropdown, Footer links, and Homepage section all have
something to show right away.

---

## 11. Dynamic Navigation Menu with multi-level submenus

This is the module that makes the whole site's navigation admin-managed, matching the
Expertise / Industries / Technology / Partners structure (and any future parent menus) without
touching code.

### How the two pieces fit together

- **Parent Menu** (Admin → Parent Menus): a top-level nav item — title, auto/custom slug,
  display order, an optional icon, and Header/Footer visibility checkboxes. Example: "Expertise".
- **Submenu Item** (Admin → Submenu Items): one page nested under a Parent Menu — name,
  auto/custom slug, short description, full rich-text description, featured image, banner image,
  display order, active/homepage toggles, and SEO fields (title, keywords, description). Example:
  "Cloud ERP" under "Expertise" → live at `/expertise/cloud-erp`.

### Admin: adding a brand-new menu (e.g. "Solutions")

1. Go to Admin → **Parent Menus** → create "Solutions", check "Show In Header" (and/or Footer)
2. Go to Admin → **Submenu Items** → select "Solutions" as the Parent Menu, add as many items as
   needed (e.g. "ERP Solutions", "CRM Solutions"), each with its own content and images
3. That's it — "Solutions" now appears as a new dropdown in the Navbar (and Footer, if checked),
   and each item is live at `/solutions/<slug>`, with zero deployments or code edits

### Admin: search, filter, sort, pagination

The Submenu Items screen supports the same admin UX as Topics: a search box (name/slug), a
Parent Menu filter, an Active/Inactive/All status filter, a sort dropdown (Display Order / Latest
/ Oldest), and paginated results.

### Frontend behavior

- **Desktop**: hovering a parent menu (or clicking its ▾ caret) opens a dropdown of its submenu
  items
- **Mobile**: tapping the ▾ caret expands/collapses that menu's items as an accordion, inside the
  slide-out mobile nav
- **`/​<parentSlug>`**: a generic listing page (grid of cards) for everything under that parent
- **`/​<parentSlug>/<submenuSlug>`**: the dedicated detail page — banner image, featured image,
  breadcrumb (Home / Parent / Item), rich content, a "Related `<Parent>`" section (other items
  under the same parent), best-effort Related Services / Related Projects / Related Blogs /
  Related Technologies sections pulled from those existing modules, a Contact CTA with an inquiry
  form (submits to the same Contact inbox as the site's Contact page, tagged with the page name),
  SEO metadata, and social share buttons (Facebook, X, LinkedIn, WhatsApp)

### API reference

```
GET  /api/parent-menus                          -> all active parent menus
GET  /api/parent-menus?header=true               -> active + Show In Header
GET  /api/parent-menus?footer=true               -> active + Show In Footer
GET  /api/parent-menus/slug/:slug                -> one parent menu (for the /:parentSlug page)
POST/PUT/DELETE /api/parent-menus[/:id]          -> CRUD (superadmin)

GET  /api/submenu-items                          -> all active submenu items
GET  /api/submenu-items?parent=<parentMenuId>     -> active items under one parent
GET  /api/submenu-items?homepage=true&limit=N     -> active + Show On Homepage, limited
GET  /api/submenu-items?admin=true&search=&status=&parent=&sortBy=&page=&limit=  -> superadmin, paginated
GET  /api/submenu-items/lookup/:parentSlug/:submenuSlug  -> one item + up to 3 related items
POST/PUT/DELETE /api/submenu-items[/:id]         -> CRUD (superadmin)
```

### Current scope note (future scalability)

The schema today supports one level of submenus per parent (parent → submenu), which covers
every example in the spec (Expertise, Industries, Technology, Partners) and any future parent
menu the same way. Deeper (3rd-level) nesting isn't built yet, but the same `parentMenu`
reference pattern used on `SubmenuItem` could be extended with a self-referencing `parentSubmenu`
field later if a menu ever needs a third level.

`npm run seed` creates all four parent menus from the spec (Expertise, Industries, Technology,
Partners) with their full submenu lists, so the dropdowns and detail pages have real content to
click through immediately.

---

## 12. Footer, company settings, and legal pages

### Admin: company info shown in the footer

Go to Admin → **Settings** → "Footer & Company Info":
- **Company Tagline / Short Description** — shown under the footer logo
- **Contact Phone**, **Contact Email**, **Address** — shown in the "Get In Touch" footer column
- **Social Media Links** (Facebook, X/Twitter, LinkedIn, Instagram, YouTube, WhatsApp) — any left
  blank simply doesn't render an icon/link

The footer logo itself is the same one managed in Admin → **Logo** (shown in white via a CSS
filter so it reads clearly on the dark footer background).

### Footer layout

- **Brand column** — logo + tagline
- **Quick Links** — Home, About, Services, Project, Blog, Careers, Contact
- **Popular Links** — a merged list of Topics marked "Show In Footer" and Parent Menu submenu
  items marked "Show In Footer" (capped at 10)
- **Get In Touch** — phone, email, address, and social icons
- **Bottom bar** — "© {year} Wirecto. All Rights Reserved." plus a row of legal page links

### Admin: legal / policy pages

Go to Admin → **Legal / Policies** to create/edit/delete pages like Privacy Policy, Terms &
Conditions, Refund & Cancellation Policy, and Shipping & Delivery Policy (seeded with placeholder
content via `npm run seed` — replace it with your real policy text). Each page:
- Has a title, auto/custom slug, an Order (controls position in the footer's legal links row),
  Active toggle, and full rich-text content
- Is live at `/legal/<slug>`, e.g. `/legal/privacy-policy`
- Automatically appears in the footer's bottom bar once created and Active — no code changes

### Header nav order and alignment

The header now renders, left to right: Home, About Us, Services (▾ mega menu), then each active
Parent Menu with "Show In Header" checked — by default Expertise, Industries, and Technology
(Partners is seeded as footer-only, so it doesn't clutter the header) — then Project, Blog,
Careers, Contact. The Topics dropdown was removed from the header (Topics remain reachable via
the footer's Popular Links and `/topics`). All top-level items, whether a plain link or a
dropdown, now share the same vertical alignment via `align-items: center` on the nav container.

---

## 13. Hero Slider, Technology & Project details, Partner slider, and site search

### Hero Slider

Admin → **Hero Slider** (same module as before, just relabeled) manages slides: Title, Subtitle,
Background Image, Button Text, Button URL, Display Order, Active/Inactive. The homepage
`HeroSlider` component auto-rotates every ~4.5 seconds, supports manual Previous/Next arrows and
pagination dots, and pauses cleanly between fades using a CSS opacity transition.

### Technology Management + details page

Admin → **Technology** now includes: Name, auto/custom Slug, Logo, Banner Image, Short
Description, Full Description (rich text), Key Features (one per line), Benefits (one per line),
Display Order, **Featured on Home**, and Active/Inactive.

- Featured technologies show as cards (logo, name, short description, "View Details") in the
  homepage's "Technologies We Work With" section — count configurable from Admin → Settings.
- Every technology gets a details page at `/technologies/<slug>`: banner, logo, full description,
  Key Features, Benefits, a few Related Services, a "Start Your Project" CTA, and Related
  Technologies (matched by category, topped off with other active technologies if needed).

### Project Details page enhancement

Admin → **Projects** now includes: Cover Image, a multi-image **Gallery** uploader, Technologies
Used (tag list), and Description/Features/Challenges/Solution/Results sections, alongside the
existing Title/Slug/Client/Category/Order/Active fields.

The public `/projects/<slug>` page shows: an image gallery with clickable thumbnails, Client/
Industry meta, the technologies-used tags, the full write-up (Features, Challenges, Solution,
Results), and a right-hand sidebar listing 4–6 **other recent projects** (same category first,
topped off with the latest projects) — each with a thumbnail, name, short excerpt, and a
"Read More" link.

### Partner Logo Slider

Admin → **Partners** (Name, Logo, Website URL, Display Order, Active/Inactive) now powers a
homepage **Trusted Partners** section: an infinite, auto-scrolling logo marquee built with a
seamless CSS animation (the logo list is duplicated end-to-end so the loop never visibly resets).
It pauses on hover, and each logo links out to that partner's website if one is set. Scroll speed
is configurable from Admin → Settings → "Partner Slider Speed" (seconds per loop; lower = faster).

### Homepage Technology section + configurable counts

All three "how many show on the homepage" settings now live together in Admin → **Settings**:
Services, Blog posts, Topics, and now **Technologies** — each with presets or a custom number.

### Site-wide search

A search bar sits front-and-center on the homepage. It calls `GET /api/search?q=<query>`, which
searches (by name/title and short description) across Services, Blogs, Technologies, Topics,
Projects, and Navigation Menu submenu items, returning a single combined list with each result's
type, title, short description, and link. Results appear in a live dropdown as you type
(debounced), grouped implicitly by their type label.

---

## 14. Production build

```bash
cd frontend
npm run build      # outputs to frontend/dist
```

Serve `frontend/dist` with any static host (Nginx, Vercel, Netlify, etc.) and
point it at your deployed backend URL, or serve the backend's `/uploads` and
API from the same origin as the frontend build with a reverse proxy.

Remember to:
- Set a strong, unique `JWT_SECRET` in production
- Change the seeded superadmin password after first login
- Point `MONGO_URI` at your production database
- Set `CLIENT_URL` to your deployed frontend origin (used for CORS)

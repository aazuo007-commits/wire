# Wirecto — IT Company Website (MERN)

Full-stack IT company website: **React + Vite** frontend, **Node.js + Express** backend,
**MongoDB** database, with a superadmin dashboard to manage all site content.

Pages: Home · About Us · Services · Project · Blog · Careers · Contact
Admin CRUD: Logo · Banners · Services · Projects · Expertise · Industries · Technology · Partners · Careers
Bonus: **Templates** — import any content block from an external REST API.

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
   - **Logo** — the header logo shown site-wide
   - **Banners** — homepage hero banners
   - **Services**, **Projects**, **Expertise**, **Industries**, **Technology**, **Partners**
   - **Templates** — custom content blocks, including ones imported from any REST API
   - **Settings** — site-wide configuration (currently: how many services show on the homepage)
   - **Messages** — contact form submissions

Every resource supports file upload, ordering, and an active/inactive toggle.
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

## 8. Production build

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

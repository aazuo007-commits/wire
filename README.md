# Wirecto — IT Company Website (MERN)

Full-stack IT company website: **React + Vite** frontend, **Node.js + Express** backend,
**MongoDB** database, with a superadmin dashboard to manage all site content.

Pages: Home · About Us · Services · Project · Blog · Careers · Contact
Admin CRUD: Logo · Banners · Services · Projects · Expertise · Industries · Technology · Partners
Bonus: **Templates** — import any content block from an external REST API.

```
wirecto/
├── backend/     Express API + MongoDB (Mongoose)
└── frontend/    React 18 + Vite
```

---

## 1. Prerequisites

- Node.js 18+ (needed for the built-in `fetch` used by template imports)
- MongoDB running locally, or a MongoDB Atlas connection string
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
```

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

Site runs at `http://localhost:5173`. Vite is pre-configured to proxy `/api` and
`/uploads` to `http://localhost:5000`, so no CORS setup is needed in dev.

---

## 4. Using the admin dashboard

1. Go to `http://localhost:5173/admin/login`
2. Log in with the superadmin credentials from your `.env` (`SUPERADMIN_EMAIL` / `SUPERADMIN_PASSWORD`)
3. From the sidebar you can create/update/delete:
   - **Logo** — the header logo shown site-wide
   - **Banners** — homepage hero banners
   - **Services**, **Projects**, **Expertise**, **Industries**, **Technology**, **Partners**
   - **Templates** — custom content blocks, including ones imported from any REST API
   - **Messages** — contact form submissions

Every resource supports image upload (drag a file in, it's stored in `backend/uploads`
and served at `/uploads/<filename>`), ordering, and an active/inactive toggle.

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

## 6. Production build

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

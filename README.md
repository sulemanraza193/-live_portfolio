# Portfolio — Phase 1 through 5

A production-structured MERN portfolio with a full admin dashboard, blog, and GitHub
integration. Covers **Phase 1 (foundation)**, **Phase 2 (public site core)**,
**Phase 3 (auth + admin panel)**, **Phase 4 (blog system)**, and **Phase 5 (GitHub
integration, coding profiles, structured data, deployment configs)**.

## What's in this build

**Public site** (`client/src/pages/Home.jsx` + components)
- Sticky navbar (blur on scroll, active-link tracking, mobile menu, light/dark toggle,
  Blog link that works from any page)
- Hero with typing animation, animated gradient blobs, "build log" panel
- About, Skills (filterable, animated bars), Projects (from MongoDB, category filters)
- **GitHub section** — live profile stats, contribution heatmap, pinned/top repos,
  recent activity feed, and animated coding-profile cards (GitHub, LeetCode,
  Codeforces, HackerRank, LinkedIn)
- Animated Experience timeline, Services, animated stat counters, auto-sliding
  Testimonials, validated Contact form, Footer
- Light/dark theme, lazy-loaded routes, skeleton loading states, 404 page
- SEO: meta tags, Open Graph, robots.txt, sitemap.xml, and **JSON-LD structured
  data** (Person/WebSite schema site-wide, Article schema injected per blog post)

**Blog** (`/blog`, `/blog/:slug`) — see Phase 4 notes below; unchanged in this phase.

**Admin dashboard** (`/admin`) — see Phase 3/4 notes below; unchanged in this phase.

**Server** (`server/`) — Node.js + Express + MongoDB (Mongoose)
- All Phase 1–4 routes (projects, contact/messages, auth, skills, experience,
  services, resume, image upload, dashboard stats, blog)
- **GitHub integration** (`/api/github/*`) — all public, all cached in-memory for 30
  minutes to stay well under GitHub's rate limits:
  - `GET /api/github/profile` — avatar, bio, followers/following/repo counts
  - `GET /api/github/repos` — top 6 repos by star count (REST)
  - `GET /api/github/pinned` — true pinned repos via GraphQL, **only when
    `GITHUB_TOKEN` is set**; returns `[]` otherwise so the frontend falls back to
    `/repos` automatically
  - `GET /api/github/contributions` — contribution calendar via the public
    [jogruber contributions API](https://github-contributions-api.jogruber.de/) —
    no token needed
  - `GET /api/github/activity` — recent public events (pushes, PRs, stars, etc.),
    turned into readable strings

## GitHub integration setup

Set `GITHUB_USERNAME` in `server/.env` (required for the whole section to render).
`GITHUB_TOKEN` is optional:
- **Without it**: profile, top repos, contributions, and activity all work fine off
  GitHub's public rate limit (60 requests/hour, easily enough given the 30-minute
  cache). The "Pinned Repositories" card falls back to showing your top-starred repos
  instead, labeled accordingly.
- **With it**: rate limit jumps to 5,000/hour, and true pinned repos (as configured on
  your GitHub profile) become available. A token needs no special scopes for this —
  a classic token with no boxes checked, or a fine-grained token with public-repo
  read access, both work since none of this touches private data.

## Run it locally

**1. Backend**
```bash
cd server
cp .env.example .env      # fill in MONGO_URI, JWT_SECRET, ADMIN_EMAIL/PASSWORD,
                           # GITHUB_USERNAME (and optionally GITHUB_TOKEN)
npm install
npm run seed               # optional: 3 sample projects
npm run seed:blog          # optional: 3 published posts + 1 draft
npm run seed:admin         # creates your admin login from .env values
npm run dev
```

**2. Frontend** (separate terminal)
```bash
cd client
npm install
npm run dev
```
Visit `http://localhost:5173` for the public site (GitHub section is on the
homepage), `/blog` for the blog, and `/admin/login` for the dashboard.

## Deployment

Configs are included for the stack named in the original spec:

- **Frontend → Vercel**: `client/vercel.json` handles SPA rewrites (so client-side
  routes like `/blog/some-post` don't 404 on refresh) and long-cache headers for
  hashed assets. Set `VITE_API_URL` in Vercel's environment settings to your deployed
  backend URL.
- **Backend → Railway or Render**: `server/Procfile` (`web: node server.js`) works for
  Railway; `server/render.yaml` is a ready-to-use Render blueprint. Either way, set
  `MONGO_URI`, `CLIENT_URL` (your Vercel URL), `JWT_SECRET`, and the `GITHUB_*` vars
  in the platform's environment settings — never commit `.env`.
- **Database → MongoDB Atlas**: any free-tier cluster works; put its connection
  string in `MONGO_URI`.

**Known limitation**: the Resume and Project-image uploads (`server/uploads/`) are
written to local disk. Railway's and Render's free-tier filesystems are ephemeral —
uploaded files disappear on every redeploy. This is fine for local development and
demoing, but for a real production deployment you'd want to swap the `multer`
disk storage in `server/middleware/upload.js` for an object-storage backend (S3,
Cloudinary, etc.). That swap is straightforward but intentionally left out here to
keep the stack matching what was originally specified (no third-party storage
service was requested).

## Not in this build

Everything from the original spec has now been covered across the five phases.
Anything you'd still like added — the swap to persistent file storage mentioned
above, tests, CI, or something else — just say the word.

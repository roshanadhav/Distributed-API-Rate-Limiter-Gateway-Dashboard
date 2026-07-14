# Rohan Adhav — Portfolio

A React + Vite portfolio site. All content lives in **`public/data.json`** —
you edit that one file to update anything on the site (text, projects,
experience, links). No backend, no database.

## Design system

- **Dual theme.** A theme toggle in the navbar switches dark/light, persists to
  `localStorage`, and respects the visitor's OS preference on first visit.
  Everything is driven by CSS variables in `src/styles/global.css` under
  `[data-theme='dark']` / `[data-theme='light']` — change the palette there.
- **Type:** Inter for all reading text, IBM Plex Mono reserved for small
  utility labels (eyebrows, tags, stats) — never for headings.
- **Accents:** a cobalt accent for interactive/informational elements, a warm
  amber reserved for primary calls-to-action and emphasis.

## Real links already wired in

I pulled the actual hyperlinks embedded in your résumé PDF and wired them in:
GitHub, LinkedIn, LeetCode, Codeforces, CodeChef, GeeksforGeeks. Two things
you should still update in `public/data.json`:

- **`youtube.url`** — your résumé didn't include a channel link, so it's a
  placeholder. Add your real channel URL.
- **Per-project `github` / `live`** — your résumé links to the same generic
  GitHub profile and a placeholder `live.com/project` URL for every project
  (not real per-repo links), so I pointed every project's GitHub button at
  `github.com/roshanadhav` and removed the "Live demo" button rather than
  ship dead links. Once you have real repo URLs and live deployments, add
  them per project — the "Live demo" button reappears automatically the
  moment `"live"` isn't `null`.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
```

Build for production:

```bash
npm run build      # outputs to /dist
npm run preview    # preview the production build locally
```

## Deploying

This is a client-side routed app (React Router), so your host needs to
serve `index.html` for every route, not just `/`.

- **Vercel** — already configured via `vercel.json`. Just import the repo.
- **Netlify** — already configured via `public/_redirects`. Just import the repo.
- **GitHub Pages / other static host** — you'll need to add your own SPA
  fallback rule (serve `index.html` for unknown paths).

## Where everything lives

```
public/
  data.json          ← ALL site content. Edit this.
  images/hero.jpg     ← your circular profile photo
  images/projects/    ← one cover image per project (16:9 works best)
  videos/              ← project demo videos, e.g. mindedix.mp4
  logos/                ← company + Bellorin logos (transparent PNG ideal)
  gallery/              ← workshop/seminar photos
  resume.pdf            ← your résumé (linked from the hero "download résumé" button)

src/
  pages/               ← one file per route
  components/          ← shared UI (Navbar, Timeline, ProjectCard, etc.)
  hooks/useSiteData.js  ← fetches public/data.json once and caches it
  styles/global.css     ← the entire design system (colors, type, layout)
```

Until you drop in real images, every photo/logo/cover shows a clean
placeholder automatically — nothing breaks, nothing looks like a broken
image icon.

## Routes

| Route                          | What it is                                   |
|---------------------------------|-----------------------------------------------|
| `/`                             | Home — hero + overview of every section       |
| `/projects`                     | Full project listing                          |
| `/projects/:slug`               | One project's full case study / docs page     |
| `/experience`                   | Full experience log                           |
| `/experience/:slug`             | One role's full write-up                      |
| `/leadership`                   | Bellorin / leadership page                    |
| `/gallery`                      | Photo gallery                                 |

## Adding a new project

Open `public/data.json`, find the `"projects"` array, and add a new object.
The `slug` field becomes the URL, so `"slug": "my-new-project"` gives you
`/projects/my-new-project` automatically — no routing code to touch.

```json
{
  "slug": "my-new-project",
  "name": "My New Project",
  "tagline": "One sentence on what it does.",
  "cover": "/images/projects/my-new-project-cover.jpg",
  "stack": ["Go", "Postgres"],
  "github": "https://github.com/you/repo",
  "live": "https://your-live-link.com",
  "video": "/videos/my-new-project.mp4",
  "featured": true,
  "timeline": [
    { "date": "Week 1", "title": "...", "detail": "..." }
  ],
  "docs": {
    "overview": "...",
    "problem": "...",
    "architecture": "...",
    "features": ["...", "..."],
    "challenges": [{ "title": "...", "detail": "..." }],
    "results": ["...", "..."]
  }
}
```

Set `"featured": true` to have it show up on the home page too (it always
shows on `/projects` regardless).

## Adding a new role to `/experience`

Same idea — add an object to the `"experience"` array in `data.json` with a
unique `slug`; `/experience/that-slug` is created automatically.

## Notes on placeholder content

A few sections were left as clearly-marked placeholders because the resume
you shared didn't include the details:

- **Leadership / Bellorin** — `data.json → "leadership"` has sample copy.
  Replace it with your real story, responsibilities, and metrics.
- **Gallery photos** — six placeholder slots with generic captions. Add your
  real image files to `public/gallery/` and update the `photos` array.
- **Social links** (`profile.social`, `youtube.url`) — currently point to
  generic URLs. Swap in your real GitHub/LinkedIn/YouTube links.
- **Coding-profile timeline dates** — the milestones and stats are drawn
  from your resume, but exact months were estimated to build the "past 1.5
  years" timeline. Adjust dates/entries in `codingProfiles.timeline` to match
  your real history.

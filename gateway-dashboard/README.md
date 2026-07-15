# Apex Gateway — Distributed API Gateway Control Center

A production-styled, enterprise-grade React dashboard for managing a distributed API gateway — in the spirit of the AWS Console, Grafana, Kubernetes Dashboard, and Cloudflare's dashboard. All data is simulated client-side; there is no backend.

## Stack

- **React 18** + **React Router 6** (real client-side routing, one route per page)
- **Tailwind CSS** for utility styling, layered with a hand-tuned CSS design-token system (`src/index.css`)
- **Framer Motion** for transitions and micro-interactions
- **Recharts** for time-series charts
- **lucide-react** for icons
- **Vite** for dev/build tooling

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`).

```bash
npm run build      # production build to dist/
npm run preview    # preview the production build
```

## Project structure

```
src/
├── main.jsx                 # React root, router setup
├── App.jsx                  # App shell: sidebar + topbar + routed pages
├── index.css                # design tokens, Tailwind layers, base styles
├── lib/
│   ├── constants.js          # nav config, status metadata, algorithm metadata
│   └── utils.js               # formatting + math helpers
├── data/
│   └── seed.js                 # seed data for services, logs, notifications, incidents
├── context/
│   └── EngineContext.jsx      # React context exposing the live mock engine
├── hooks/
│   └── useMockEngine.js       # the simulated telemetry/data engine (interval-driven)
├── components/
│   ├── layout/                 # Sidebar, Topbar, AppLayout
│   ├── ui/                     # StatCard, StatusBadge, Modal, ProgressBar, SectionCard, ...
│   ├── architecture/            # interactive topology diagram
│   ├── services/                # service cards + instance detail modal
│   ├── gateway/                  # request-pipeline flow visualization
│   ├── loadbalancer/              # algorithm visual snippets
│   └── notifications/              # notification bell + dropdown
└── pages/
    ├── OverviewPage.jsx
    ├── ArchitecturePage.jsx
    ├── GatewayPage.jsx
    ├── ServicesPage.jsx
    ├── LoadBalancerPage.jsx
    ├── RateLimiterPage.jsx
    ├── HealthCheckerPage.jsx
    ├── LogsPage.jsx
    ├── NotificationsPage.jsx
    ├── UsersPage.jsx
    └── SettingsPage.jsx
```

## Routes

| Path                     | Page                          |
|---------------------------|-------------------------------|
| `/overview`                | Executive health dashboard    |
| `/architecture`            | Interactive system topology   |
| `/gateway`                  | Edge routing metrics          |
| `/services`, `/services/:id` | Service fleet + instance detail |
| `/loadbalancer`             | Load balancing algorithms     |
| `/ratelimiter`               | Rate limiting algorithms      |
| `/healthchecker`             | Health probe monitoring       |
| `/logs`                       | Streaming log viewer          |
| `/notifications`              | Incident/alert center         |
| `/users`                       | Admin users & roles           |
| `/settings`                     | Admin controls & config       |

## Notes

- All backend/API/socket behavior is simulated in `useMockEngine`, which ticks on an interval and mutates service health, traffic metrics, logs, and notifications.
- Theme (dark/light) is toggled via a `light` class on the app root and CSS custom properties in `index.css`.
- No real authentication, persistence, or network calls are included — this is a UI/UX reference implementation.

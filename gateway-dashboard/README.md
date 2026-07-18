# Apex Gateway — Distributed API Gateway Control Center

A React dashboard for the **MindEdix Gateway** (or any gateway exposing the same admin API). All data on screen is live — polled from real HTTP endpoints on an interval — there is no mock/simulated data anywhere in this build.

## Stack

- **React 18** + **React Router 6**
- **Tailwind CSS** + a hand-tuned CSS design-token system (`src/index.css`)
- **Framer Motion** for transitions and micro-interactions
- **Recharts** for time-series charts
- **lucide-react** for icons
- **Vite** for dev/build tooling

No authentication is wired up — every request in `src/api/client.js` is a plain unauthenticated `GET`, matching the endpoints you provided.

## Getting started

```bash
npm install
npm run dev
```

Make sure the gateway is running and reachable at `http://localhost:3000` (or update the base URL — see below) before loading the app, otherwise the dashboard shows a "Can't reach the gateway" state with a retry button.

```bash
npm run build      # production build to dist/
npm run preview    # preview the production build
```

## Changing the API base URL (single place)

Every API call in the app is built from **one constant**:

```js
// src/config.js
const DEFAULT_API_BASE_URL = "http://localhost:3000";
```

Change it there and every page, every fetch, updates automatically — no other file needs touching.

Two additional override options are supported for convenience, without a rebuild:
- **URL query param**: open the app with `?apiBase=http://your-host:3000`
- **Settings page**: paste a new base URL into Settings → Connection → "API base URL" and click Save (stores it in `localStorage` and reloads)

## How the live data works

The app polls four endpoints every `POLL_INTERVAL_MS` (default 5s, also in `src/config.js`):

| Endpoint | Used for |
|---|---|
| `GET /admin/overview` | Overview page KPIs, the traffic/latency/error trend charts |
| `GET /admin/gateway` | Gateway page, Rate Limiter page, config values shown in Settings |
| `GET /admin/services` | Services page, Health Checker page, service nodes in the Architecture diagram |
| `GET /admin/services/:id` | Fetched on demand when a service detail modal opens |
| `GET /admin/load-balancer` | Load Balancer page, traffic-distribution rings |

Since the gateway's API only reports **current values** (not a time series), the dashboard keeps a small rolling history buffer in memory (`src/hooks/useLiveEngine.js`) purely for the trend charts — every point in that buffer comes from a real poll, nothing is synthesized between polls.

**Logs, Notifications, and Health Events are derived, not fabricated.** The hook diffs each service's status between consecutive polls; a `healthy → down` transition generates a log line, a notification, and an incident, all with real timestamps and real service ids. If nothing changes between polls, nothing new appears — there's no background random-event generator.

### Known API quirks handled by the mapper (`src/lib/mappers.js`)

- The sample `/admin/services` and `/admin/load-balancer` payloads return service objects **without an id/name field**. IDs are reconstructed by pairing array position with the known distribution keys (`user-service`, `user-service-2`, `user-service-3`, `auth-service`, `admin-1`). If your gateway's array order or count differs, update `SERVICE_ID_FALLBACK_ORDER` in `src/lib/mappers.js`.
- `minLatency` (and similar fields) sometimes come back as `Number.MAX_SAFE_INTEGER` as a "no data yet" sentinel — `sanitizeMetric()` converts that to `null` so the UI shows "—" instead of a 16-digit number.
- Requests/sec per service isn't provided directly, so it's derived client-side from the delta in `totalRequests` between two polls, divided by elapsed seconds.

## Project structure

```
src/
├── main.jsx / App.jsx            # React root, router setup
├── config.js                      # ⭐ single source of truth for API base URL + poll interval
├── index.css                      # design tokens, Tailwind layers, base styles
├── api/
│   └── client.js                    # thin fetch wrapper for the 5 admin endpoints (no auth)
├── lib/
│   ├── constants.js                  # nav config, status metadata, LB/RL algorithm reference data
│   ├── mappers.js                     # raw-API-payload → UI-shape transforms
│   └── utils.js                        # formatting helpers
├── hooks/
│   └── useLiveEngine.js                 # polls the API, derives history/logs/notifications/incidents
├── context/
│   ├── EngineContext.jsx                 # exposes useLiveEngine() to the whole tree
│   └── ThemeContext.jsx                   # dark/light theme, synced onto <html> and localStorage-free
├── components/
│   ├── layout/                             # Sidebar, Topbar, AppLayout
│   ├── ui/                                  # StatCard, Modal, StatusBadge, ConnectionState, ...
│   ├── architecture/                         # live topology diagram + info panel
│   ├── services/                              # ServiceCard, ServiceDetailModal
│   ├── gateway/, loadbalancer/, notifications/
└── pages/                                    # one file per route
```

## Routes

| Path | Page | Backed by |
|---|---|---|
| `/overview` | Executive health dashboard | `/admin/overview` |
| `/architecture` | Interactive live topology | `/admin/services`, `/admin/gateway`, `/admin/load-balancer` |
| `/gateway` | Edge routing metrics | `/admin/gateway` |
| `/services`, `/services/:id` | Service fleet + instance detail | `/admin/services`, `/admin/services/:id` |
| `/loadbalancer` | Load balancing distribution | `/admin/load-balancer` |
| `/ratelimiter` | Rate limiting metrics | `/admin/gateway` (`rateLimiter` block) |
| `/healthchecker` | Health probe monitoring | `/admin/services` |
| `/logs` | Derived event stream | client-side, from polling diffs |
| `/notifications` | Derived incident/alert center | client-side, from polling diffs |
| `/settings` | Live gateway config + API base URL control | `/admin/gateway` |

## What's intentionally *not* here

- No **Users** page — there's no user-management endpoint in the provided API.
- No algorithm-switching controls that actually mutate the gateway — the Load Balancer / Rate Limiter pages show the live-reported algorithm and reference cards for the alternatives, but there's no control-plane `POST` endpoint documented yet to change it. Service action buttons (restart/disable/remove traffic) surface a clear "no control-plane endpoint connected" toast rather than pretending to work.
- No authentication — matches the brief; add it back in `src/api/client.js` if/when the gateway requires it.

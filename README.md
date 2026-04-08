# 🌊 Wave — Music Streaming Platform

A full-stack music streaming platform with a Python/Flask REST API backend, React (Vite) frontend, JioSaavn content integration, and a native Android app via Capacitor — all from a single codebase.

**Live:** [wavemusic-six.vercel.app](https://wavemusic-six.vercel.app) (Frontend) | [wave-1-plq6.onrender.com](https://wave-1-plq6.onrender.com) (API)

---

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Database](#database)
- [API Reference](#api-reference)
- [Frontend Architecture](#frontend-architecture)
- [Android App](#android-app)
- [Audio Engine](#audio-engine)
- [JioSaavn Integration](#jiosaavn-integration)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [Key Design Decisions](#key-design-decisions)
- [Known Limitations](#known-limitations)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTS                                  │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │ Web (PC) │  │ Web (Mobile) │  │ Android APK           │  │
│  │ Browser  │  │ Browser      │  │ Capacitor WebView     │  │
│  └────┬─────┘  └──────┬───────┘  └───────────┬───────────┘  │
│       │               │                      │               │
│       └───────────────┼──────────────────────┘               │
│                       │ Same React codebase                  │
│              ┌────────▼────────┐                             │
│              │  React Frontend │                             │
│              │  Vite + Tailwind│                             │
│              └────────┬────────┘                             │
└───────────────────────┼─────────────────────────────────────┘
                        │ HTTPS / REST
        ┌───────────────┼───────────────┐
        ▼                               ▼
┌───────────────┐              ┌────────────────┐
│ Flask Backend │              │ JioSaavn API   │
│ REST API      │              │ Node.js Proxy  │
│ Port 5000     │              │ Port 3001      │
└───────┬───────┘              └────────┬───────┘
        │                               │
        ▼                               ▼
┌───────────────┐              ┌────────────────┐
│ MySQL / TiDB  │              │ JioSaavn CDN   │
│ Database      │              │ Audio Streams   │
└───────────────┘              └────────────────┘
```

All three client platforms (desktop web, mobile web, Android APK) share the **exact same React codebase**. The Android app is the compiled `dist/` folder wrapped in a Capacitor WebView — there is no separate mobile codebase.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React + Vite | React 19, Vite 8 |
| **Styling** | TailwindCSS | v4 |
| **Animations** | Motion (Framer Motion) + GSAP | — |
| **Icons** | Lucide React | — |
| **HTTP Client** | Axios | — |
| **Mobile** | Capacitor | v6 |
| **Backend** | Flask + Gunicorn | Flask 3.0 |
| **Database** | MySQL (local) / TiDB Serverless (prod) | MySQL 8 / TiDB |
| **Auth** | PyJWT (HS256) | — |
| **Audio Metadata** | Mutagen (Python) | — |
| **Rate Limiting** | Flask-Limiter | — |
| **Content API** | Self-hosted JioSaavn API (Node.js) | — |

---

## Project Structure

```
wave/
├── backend/                        # Flask REST API
│   ├── app.py                      # Entry point, CORS, blueprint registration
│   ├── config.py                   # Env-based configuration (DB, JWT, Saavn URL)
│   ├── db.py                       # MySQL connection pool + query helpers
│   ├── middleware.py               # JWT auth decorators (@token_required, @admin_required)
│   ├── migrate.py                  # Migration runner (local + TiDB production)
│   ├── schema.sql                  # Universal schema (MySQL + TiDB compatible)
│   ├── requirements.txt            # Python dependencies
│   ├── .env                        # Local secrets (git-ignored)
│   ├── .env.example                # Template for environment setup
│   ├── routes/
│   │   ├── auth.py                 # Login, register, sessions, profile, onboarding
│   │   ├── songs.py                # CRUD, search, likes, recommendations, streaming
│   │   ├── playlists.py            # User playlists + liked JioSaavn playlists
│   │   ├── jiosaavn.py             # JioSaavn proxy: search, import, home, playlists
│   │   ├── albums.py               # Album CRUD
│   │   ├── stats.py                # Analytics, trending, follow/unfollow
│   │   ├── admin.py                # Admin-only endpoints (user/song management)
│   │   └── issues.py               # Error reporting from frontend
│   ├── migrations/                 # Numbered SQL migration files
│   ├── tests/                      # Pytest automation suite
│   │   ├── conftest.py             # Mock DB fixtures
│   │   ├── test_auth.py            # JWT and identity validation
│   │   └── test_songs.py           # Deduplication mechanics
│   └── uploads/                    # Local dev file fallback (Prod uses Supabase)
│
├── frontend/                       # React + Vite (serves ALL platforms)
│   ├── index.html                  # HTML shell
│   ├── package.json                # Dependencies
│   ├── vite.config.js              # Vite build config
│   ├── capacitor.config.json       # Android WebView config
│   ├── vercel.json                 # Vercel SPA rewrite rules
│   ├── .env.production             # Production API URL
│   ├── src/
│   │   ├── main.jsx                # React entry + PlayerProvider
│   │   ├── App.jsx                 # Router, auth guard, error reporting
│   │   ├── api.js                  # Axios instance + Bearer token interceptor
│   │   ├── index.css               # Global styles + TailwindCSS
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Auth page
│   │   │   ├── Register.jsx        # Registration (listener/artist role selection)
│   │   │   ├── Onboarding.jsx      # Genre/language/artist preference picker
│   │   │   ├── Dashboard.jsx       # Main listener UI (Home/Library/Search)
│   │   │   ├── Search.jsx          # Global search with tabs
│   │   │   ├── ListenerStats.jsx   # "Spotify Wrapped" analytics
│   │   │   ├── Artist.jsx          # Artist portal
│   │   │   └── Admin.jsx           # Admin dashboard
│   │   ├── components/
│   │   │   ├── ErrorBoundary.jsx   # Global crash protection
│   │   │   ├── HorizontalCarousel.jsx
│   │   │   ├── VinylExpansionHeader.jsx  # Responsive spinning record hero
│   │   │   ├── ContentCard.jsx, QuickPickCard.jsx, TopThreeHeader.jsx
│   │   │   ├── SectionHeader.jsx
│   │   │   ├── BottomPlayer.jsx    # Now-playing bar + fullscreen player
│   │   │   ├── Sidebar.jsx         # Desktop navigation
│   │   │   ├── QueuePanel.jsx      # Play queue management
│   │   │   ├── SongCard.jsx        # Song list item
│   │   │   ├── SongContextMenu.jsx # Right-click/long-press menu
│   │   │   ├── ProfileSettingsModal.jsx
│   │   │   ├── MagicBento.jsx      # Animated bento grid component
│   │   │   ├── Logo.jsx, Plasma.jsx, TiltedCard.jsx, CountUp.jsx
│   │   │   └── artist/             # Artist portal components
│   │   └── context/
│   │       ├── PlayerContext.jsx    # Audio engine, queue, media controls
│   │       └── ToastContext.jsx     # Notification system
│   ├── android/                    # Capacitor-generated Android project
│   ├── public/                     # Static assets (favicon, manifest)
│   ├── icons/                      # PWA icons (various sizes)
│   └── assets/                     # Capacitor branding (icon, splash)
│
├── jiosaavn-api/                   # Self-hosted JioSaavn API proxy
│   ├── serve.mjs                   # Entry point
│   ├── src/                        # API source
│   └── package.json
│
├── start.ps1                       # One-click startup (all services)
├── kill.ps1                        # Stop all services
└── .gitignore
```

---

## Setup & Installation

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.10
- **MySQL** 8.0 (local development)
- **Android SDK** (optional, for APK builds)

### Quick Start

```powershell
# 1. Clone
git clone https://github.com/your-repo/wave.git
cd wave

# 2. Backend setup
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env          # Edit with your DB credentials
python db_init.py               # Initialize database + schema

# 3. Frontend setup
cd ..\frontend
npm install

# 4. JioSaavn API setup
cd ..\jiosaavn-api
npm install

# 5. Start everything
cd ..
.\start.ps1
```

The `start.ps1` script launches all 4 services:
1. Database initialization → `python db_init.py`
2. Flask backend → `http://localhost:5000`
3. JioSaavn API → `http://localhost:3001`
4. Vite dev server → `http://localhost:5173`

### Environment Variables

**Backend (`backend/.env`):**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=wave_db
DB_PORT=3306
DB_SSL_MODE=false
SECRET_KEY=                         # Auto-generates in dev if empty
SAAVN_API_URL=http://localhost:3001/api
FLASK_ENV=development

# Production TiDB (for migrations)
PROD_DB_HOST=gateway.tidbcloud.com
PROD_DB_USER=your_user
PROD_DB_PASSWORD=your_password
PROD_DB_NAME=test
PROD_DB_PORT=4000
PROD_DB_SSL_MODE=true
```

**Frontend (`frontend/.env.production`):**
```env
VITE_API_URL=https://wave-1-plq6.onrender.com
```

---

## Database

### Schema (14 tables)

| Table | Purpose |
|-------|---------|
| `users` | User accounts with roles (listener/artist/admin) |
| `user_preferences` | Onboarding selections (genre/language/artist) |
| `artist_profiles` | Artist metadata, verification status, banner |
| `albums` | Album containers with cover art |
| `songs` | Song metadata (local uploads + JioSaavn imports via `saavn_id`) |
| `song_artists` | Many-to-many song↔artist mapping with primary flag |
| `playlists` | User-created playlists |
| `playlist_songs` | Playlist↔song junction table |
| `streams` | Play history with `listen_duration` for analytics |
| `user_liked_songs` | Liked songs library |
| `liked_playlists` | Liked JioSaavn playlists (stored by `saavn_playlist_id`) |
| `follows` | User→Artist following relationship |
| `subscriptions` | Subscription tiers (schema exists, not fully wired) |
| `issues` | Error/issue reports from frontend |

### Views

- `platform_stats_view` — Admin overview aggregating total users, songs, streams, most popular song, etc.

### Migrations

Migrations are tracked in a `_migrations` table. The runner is at `backend/migrate.py`:

```bash
python migrate.py              # Apply pending migrations to local MySQL
python migrate.py --prod       # Apply to production TiDB
python migrate.py --dry-run    # Preview without applying
```

Migration files are numbered: `backend/migrations/001_name.sql`, `002_name.sql`, etc.

### Connection Layer (`db.py`)

- Uses `mysql-connector-python` with a **connection pool** (`pool_size=10`)
- Disables `ONLY_FULL_GROUP_BY` for TiDB compatibility
- Three helpers: `fetch_one()`, `fetch_all()`, `execute_query()`

---

## API Reference

**Base URL:** `http://localhost:5000/api` (dev) | `https://wave-1-plq6.onrender.com/api` (prod)

### Auth (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | ❌ | Register (username, email, password, role) |
| `POST` | `/login` | ❌ | Login, returns JWT token |
| `POST` | `/logout` | ✅ | Clear session |
| `GET` | `/me` | ✅ | Validate session, returns user data |
| `POST` | `/onboarding` | ✅ | Save genre/language/artist preferences |
| `POST` | `/profile` | ✅ | Update username, name, avatar |
| `POST` | `/avatar` | ✅ | Upload avatar image |

### Songs (`/api/songs`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | ❌ | List all songs (with artist enrichment) |
| `POST` | `/` | ✅ | Upload song (multipart: audio + cover + metadata) |
| `PUT` | `/:id` | ✅ | Update song metadata |
| `DELETE` | `/:id` | ✅ | Delete song (admin or uploader only) |
| `GET` | `/search?q=` | ❌ | Full-text search |
| `GET` | `/liked/:userId` | ❌ | Get user's liked songs |
| `POST` | `/like/:songId` | ✅ | Toggle like |
| `GET` | `/:id/stream` | ❌ | Stream audio file |
| `POST` | `/:id/record-stream` | ✅ | Record play (≥20s minimum) |
| `GET` | `/recently-played/:userId` | ❌ | Last 50 played songs |
| `GET` | `/recommendations/:userId` | ❌ | SQL collaborative filtering + API fallback |

### JioSaavn Proxy (`/api/jiosaavn`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/search?q=` | ❌ | Search songs on JioSaavn (normalized response) |
| `GET` | `/search/artists?q=` | ❌ | Search artists |
| `GET` | `/search/playlists?q=` | ❌ | Search playlists |
| `GET` | `/home` | ❌ | Home page content (cached 5 min) |
| `GET` | `/song/:id` | ❌ | Get song details by JioSaavn ID |
| `GET` | `/playlist/:id` | ❌ | Get full playlist with tracks |
| `GET` | `/artist/:id` | ❌ | Get artist profile + top songs |
| `GET` | `/album/:id` | ❌ | Get album with tracks |
| `POST` | `/import` | ❌ | **Lazy-import**: Save JioSaavn song to local DB |

### Stats (`/api/stats`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/listener/:userId` | ❌ | Wrapped-style analytics (top songs, genres, hourly activity) |
| `GET` | `/artist/:artistId` | ❌ | Artist dashboard (plays, listeners, daily streams) |
| `GET` | `/trending` | ❌ | Trending songs (7-day window) |
| `GET` | `/platform` | ❌ | Admin platform overview |
| `POST` | `/follow/:artistId` | ❌ | Toggle follow/unfollow |
| `GET` | `/following/:userId` | ❌ | List followed artists |
| `GET` | `/is_following/:artistId/:userId` | ❌ | Check follow status |

### Playlists (`/api/playlists`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/user/:userId` | ❌ | Get user's playlists |
| `POST` | `/` | ✅ | Create playlist |
| `GET` | `/:id` | ❌ | Get playlist with songs |
| `PUT` | `/:id` | ❌ | Update playlist |
| `DELETE` | `/:id` | ❌ | Delete playlist |
| `POST` | `/:id/songs` | ❌ | Add song to playlist |
| `DELETE` | `/:id/songs/:songId` | ❌ | Remove song from playlist |
| `GET` | `/liked/:userId` | ❌ | Get liked JioSaavn playlists |
| `POST` | `/liked` | ✅ | Like a JioSaavn playlist |
| `DELETE` | `/liked/:saavnId` | ✅ | Unlike a JioSaavn playlist |

### Admin (`/api/admin`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/users` | 🔒 Admin | List all users |
| `DELETE` | `/users/:id` | 🔒 Admin | Delete user |
| `GET` | `/stats` | ❌ | Platform counts |
| `GET` | `/songs` | ❌ | All songs |

### Issues (`/api/issues`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | ✅ | Report an error/issue |
| `GET` | `/` | 🔒 Admin | List all issues |
| `PUT` | `/:id/resolve` | 🔒 Admin | Toggle issue status |

---

## Frontend Architecture

### Routing (HashRouter)

```
/login          → Login page
/register       → Registration (listener/artist)
/onboarding     → Genre/language/artist picker (first-time listener)
/dashboard/*    → Main listener UI (Home, Library, Search tabs)
/search         → Global search
/artist         → Artist portal (artists + admins)
/admin          → Admin dashboard (admins only)
```

### Role-Based Access

| Role | Routes | Features |
|------|--------|----------|
| **Listener** | `/dashboard`, `/search`, `/onboarding` | Play music, like songs, create playlists, view stats |
| **Artist** | `/artist` | Upload songs, view listener analytics, manage releases |
| **Admin** | `/admin` | Platform overview, manage users/songs, view issues, upload tracks |

### Key Components

| Component | Size | Responsibility |
|-----------|------|----------------|
| `Dashboard.jsx` | 20KB | Main listener UI — Uses extracted modular components to show trending, recommendations, and recents |
| `VinylExpansionHeader.jsx`| Mobile-adaptive 3D spinning record Hero Banner |
| `ErrorBoundary.jsx` | Global catch-all wrapper to prevent white-screens of death |
| `BottomPlayer.jsx` | 25KB | Persistent now-playing bar. Expands to fullscreen with cover art, progress bar, volume. Sleep timer UI |
| `PlayerContext.jsx` | 26KB | Global audio engine — playback, queue, shuffle, preload, stream config |
| `Admin.jsx` | 41KB | Admin dashboard with tabs: Overview, Songs, Upload, Users, Issues |
| `Search.jsx` | 18KB | Multi-tab search (Songs, Artists, Albums, Playlists) with JioSaavn integration |
| `Sidebar.jsx` | 10KB | Desktop navigation with search, now-playing indicator |

### State Management

- **PlayerContext** — Global React Context for audio state (current song, queue, playback controls, liked songs, playlists)
- **localStorage** — Persisted: `token`, `user`, `wave_volume`, `wave_shuffle`, `wave_repeat`
- No Redux/Zustand — all state is in Context or component-local

---

## Android App

The Android app is the same React frontend compiled and wrapped in a Capacitor WebView.

### Build Process

```powershell
.\start.ps1 -BuildAPK

# Or manually:
cd frontend
npm run build           # Compile React → dist/
npx cap sync android    # Copy dist/ into Android project
cd android
./gradlew assembleDebug # Build APK
```

Output: `frontend/android/app/build/outputs/apk/debug/app-debug.apk`

### Capacitor Config

```json
{
  "appId": "com.wave.app",
  "appName": "Wave",
  "webDir": "dist",
  "server": { "cleartext": true, "androidScheme": "https" },
  "android": { "backgroundColor": "#0a0a0a", "allowMixedContent": true }
}
```

### Native Features

| Feature | Plugin | Usage |
|---------|--------|-------|
| Media controls (notification + lock screen) | `capacitor-music-controls-plugin` | Play/pause/next/prev from notification bar |
| Status bar | `@capacitor/status-bar` | Transparent overlay, dark style |
| Hardware back button | `@capacitor/app` | Prevents app exit, minimizes player |
| ADB port forwarding | Built-in | `start.ps1` auto-maps ports 5000 + 3001 for emulator |

### Platform Detection

```javascript
const isCapacitor = typeof window !== 'undefined' && window.Capacitor !== undefined;
```

Used for: toggling `withCredentials` on Axios, loading native plugins in try/catch, adjusting bottom padding for mobile nav.

---

## Audio Engine

The audio engine lives in `PlayerContext.jsx` and handles:

### Playback Pipeline

1. **Play request** → Check if song is from JioSaavn (has `saavn_id`)
2. If JioSaavn → **Lazy-import** via `POST /api/jiosaavn/import` (saves to local DB)
3. Resolve audio URL → Set on `<Audio>` element → Play
4. **Preload next track** in hidden `<Audio>` element for gapless transition
5. After ≥20 seconds → **Record stream** via `POST /api/songs/:id/record-stream`

### Queue Management

- `queue[]` — Ordered list of songs
- `queueIndex` — Current position
- `history[]` — Previously played songs
- **Shuffle** — Fisher-Yates on remaining queue
- **Repeat** — `off` / `all` (loop queue) / `one` (loop current)

### Sleep Timer

Countdown timer (15/30/45/60 min) that pauses playback when it hits zero.

### Native Media Controls (Android)

When a song plays, `CapacitorMusicControls.create()` is called with:
- Track title, artist name, cover art URL
- Notification buttons: prev, play/pause, next, close
- Lock screen controls

Events are captured via `CapacitorMusicControls.addListener()` and mapped to player actions.

---

## JioSaavn Integration

The self-hosted JioSaavn API proxy (`jiosaavn-api/`) provides access to JioSaavn's music catalog.

### How It Works

1. **Search/Browse** — Frontend calls `/api/jiosaavn/search?q=...` → Backend proxies to local JioSaavn API → Normalizes response
2. **Play** — When user plays a JioSaavn song, `PlayerContext` calls `POST /api/jiosaavn/import` → Backend:
   - Resolves the artist (creates `user` + `artist_profile` if needed)
   - Saves song metadata to `songs` table with `saavn_id`
   - Creates `song_artists` mapping
   - Returns local `song_id` for stream recording
3. **CDN URLs** — Audio streams directly from JioSaavn's CDN, not through our backend
4. **Genre Enrichment** — Falls back to iTunes Search API for real genre metadata (JioSaavn often returns language as genre)
5. **URL Self-Healing** — If a cached `audio_url` expires, the import endpoint auto-fetches a fresh one

### Home Page Caching

The `/api/jiosaavn/home` endpoint caches JioSaavn home data for **5 minutes** (`_home_cache` dict) to reduce latency and external API calls.

---

## Authentication

### Flow

1. **Register** → Hash password with `scrypt` → Store in `users` table
2. **Login** → Verify password → Generate JWT (HS256, 30-day expiry) → Return token
3. **Session** — Token stored in `localStorage` + sent as `Bearer` header on every request
4. **Validation** — `@token_required` decorator decodes JWT → Sets `request.current_user`
5. **Concurrent Sessions** — `active_session` column tracks current session ID; `/me` endpoint checks if session matches

### Dual Token Strategy

- **Web browsers** — `withCredentials: true` (cookie-based fallback)
- **Capacitor Android** — `withCredentials: false` (Bearer token only, avoids CORS issues)
- `api.js` auto-detects platform:
  ```javascript
  const isCapacitor = window.Capacitor !== undefined;
  withCredentials: !isCapacitor
  ```

### Role Decorators

```python
@token_required      # Any authenticated user
@admin_required      # Admin role only
@artist_required     # Artist or admin role
```

---

## Deployment

### Frontend → Vercel

- **Build command:** `npm run build`
- **Output:** `dist/`
- **Config:** `vercel.json` with SPA rewrite (`/* → /index.html`)
- **Env:** `VITE_API_URL` set in Vercel dashboard

### Backend → Render

- **Start command:** `gunicorn app:app --bind 0.0.0.0:$PORT`
- **Env vars:** All `DB_*`, `SECRET_KEY`, `SAAVN_API_URL`, `FLASK_ENV=production`
- **⚠️ Ephemeral filesystem:** Uploaded files in `uploads/` are lost on each deploy

### Database → TiDB Serverless

- MySQL-compatible, serverless, free tier
- SSL required (`DB_SSL_MODE=true`)
- Schema avoids MySQL-specific features (no partitioning, no FULLTEXT, no triggers)

### Cloud Storage → Supabase Storage (S3 API)
- Uploaded media (`songs/`, `albums/`, `avatars/`) is piped over purely decoupled REST endpoints to a Supabase bucket (`wave-uploads`) via `backend/storage.py` to circumvent Render's volatile ephemeral disks.

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Single codebase for 3 platforms** | Capacitor wraps the same React build, avoiding code duplication |
| **JioSaavn lazy-import** | Saves songs to local DB on first play, enabling likes/playlists/analytics on external content |
| **No ORM (raw SQL)** | Direct control over queries, TiDB compatibility, simpler for MySQL-specific optimizations |
| **HashRouter** | Avoids server-side routing conflicts on Vercel and Capacitor |
| **Connection pool** | Reuses DB connections across requests (pool_size=10) |
| **JWT over sessions** | Stateless auth works across web + native without cookie headaches |
| **Batch artist enrichment** | Single JOIN query for all songs' artists instead of N+1 queries |

---

## Known Limitations

1. **Home cache has no size limit.** The `_home_cache` dict in `jiosaavn.py` can grow unbounded.
2. **Subscriptions table exists but isn't wired** to any feature or paywall logic.

---

## Testing

The backend is backed by an automated **`pytest`** suite. The testing engine (`backend/tests/`) ensures regressions don't slip into deployment:
- Validates the `bcrypt` JWT generation lifecycle cleanly (`test_auth.py`)
- Employs `unittest.mock` patch targets to simulate database queries dynamically (Zero Data-Loss paradigm)
- Checks programmatic algorithm components like `_dedup_songs` (`test_songs.py`) 

---

## Default Credentials

| Account | Email | Password | Role |
|---------|-------|----------|------|
| Admin | admin@wave.com | admin123 | admin |

⚠️ Change this immediately in production.

---

## Scripts

| Script | Description |
|--------|-------------|
| `start.ps1` | Start all services (DB init + backend + JioSaavn + frontend) |
| `start.ps1 -BuildAPK` | Build Android debug APK |
| `kill.ps1` | Stop all spawned processes |
| `backend/migrate.py` | Database migration runner |
| `backend/db_init.py` | Initialize database from schema.sql |

---

*Built with Flask, React, TailwindCSS, Capacitor, and too much coffee ☕*

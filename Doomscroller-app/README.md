# ☠️ Doomscroller

> **Doom scrolling w/ maximum efficiency.** A customisable grid where you can connect multiple apps to watch short form videos endlessly.

![Dark Mode](https://img.shields.io/badge/theme-dark%20only-000000?style=flat-square&labelColor=000000)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![Phase](https://img.shields.io/badge/phase-MVP-red?style=flat-square)

---

## What Is This?

An automated, high-density video grid that plays **6 to 8 short-form vertical videos simultaneously**. It's an overstimulation engine — a brutalist, chaotic, multi-screen wall of content that scrolls itself based on when each video naturally ends.

No buttons. No algorithms. No mercy.

---

## Features

### 🎛️ The Grid
A responsive **2×2 / 2×3 / 2×4** grid of vertical video players. Zero borders, zero UI clutter. Just a wall of content like security monitors in a dystopian control room.

### ⚡ Event-Driven Auto-Scroll
Each tile listens for `onEnded` — when a video finishes, it automatically swipe-animates to the next one. Because videos vary in length (7s to 60s), tiles naturally desynchronize, creating organic chaos across the screen.

### 🔇 Hover Audio
All videos start **muted**. Hover or tap a tile to hear its audio. Move away and it cuts immediately.

### 🔍 Focus Mode (Pop-Out)
Click any tile to expand it full-screen with engagement metrics (likes, comments, creator handle). All other tiles **freeze** mid-frame — no auto-scrolling while you're focused. Hit back and the grid resumes exactly where it left off.

### ⏪ History (Reverse Scroll)
Swipe down or scroll down on any tile to retrieve the **previous video** from that feed. Temporarily overrides auto-scroll so you can re-watch missed content.

### 💀 The Panic Button
A single red skull button that instantly **blacks out all screens and kills all audio**. The escape hatch when the overstimulation hits.

### 🎚️ The Rot Dial
Bottom-right control to switch between **4 / 6 / 8 screens** on the fly. Dial up the brainrot.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19, Tailwind CSS 4, Framer Motion |
| **State** | Zustand (independent tile state, global pause, cleanse) |
| **Database** | SQLite + Prisma 5 |
| **Icons** | Lucide React |
| **Video** | Native HTML5 `<video>` with `autoPlay`, `playsInline`, `muted` |

---

## Project Structure

```
Doomscroller-app/
├── prisma/
│   ├── schema.prisma          # Video model (SQLite)
│   └── seed.js                # Seeds DB with 19 unique video clips
├── public/
│   ├── manifest.json          # PWA manifest
│   └── videos/                # 19 locally stored MP4 clips
├── scripts/
│   └── download-videos.js     # Script to fetch sample video clips
├── src/
│   ├── app/
│   │   ├── globals.css        # Brutalist dark theme
│   │   ├── layout.tsx         # PWA meta, viewport lock
│   │   └── page.tsx           # Server component → fetches & shuffles videos
│   ├── components/
│   │   ├── GridContainer.tsx   # CSS Grid + Rot Dial + Panic Button
│   │   ├── VideoTile.tsx       # Auto-scrolling video player per tile
│   │   └── FocusOverlay.tsx    # Full-screen pop-out with engagement UI
│   ├── lib/
│   │   └── prisma.ts          # Prisma client singleton
│   └── store/
│       └── useGridStore.ts    # Zustand: tiles, queues, pause, cleanse
└── package.json
```

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up the database
npx prisma generate
npx prisma db push

# 3. Seed with sample videos
node prisma/seed.js

# 4. Run the dev server
npm run dev
```

Open **http://localhost:3000** on your phone or browser.

### Install as a Mobile App (PWA)
1. Open the URL on your phone's browser
2. **iPhone:** Share → "Add to Home Screen"
3. **Android:** Menu → "Add to Home Screen"
4. Launch from your home screen — full screen, no browser chrome

---

## Design Philosophy

- **Aesthetic:** Dystopian. Brutalist. Minimalist. `#000000` only.
- **UX:** Zero visible UI in grid mode. The content IS the interface.
- **Mobile-first:** Designed for vertical 9:16 phone screens.
- **State isolation:** Each tile manages its own queue independently.

---

## Roadmap

| Phase | Status | Description |
|---|---|---|
| **Phase 1 — MVP** | ✅ Done | Local videos, SQLite, auto-scroll, focus mode, panic button, reverse scroll |
| **Phase 2 — Live** | 🔜 Next | Real-time feed scraping, live engagement metrics, Redis caching |
| **Phase 3 — Native** | 📋 Planned | Capacitor/APK build, app store distribution |

---

## Built With

> 🛸 Managed via [Google Antigravity](https://github.com/google/antigravity) — the agentic development orchestrator.

Part of the [ZeroG-Lab](https://github.com/jinyoung1900/Google-Antigravity-ZeroG-Lab) sandbox.

---

*Per aspera ad astra* 🌑

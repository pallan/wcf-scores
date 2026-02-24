# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**wcf-scores** is a web application for tracking and displaying scores for World Curling Federation (WCF) events. It is built with Vite, React, and TypeScript, styled with Tailwind CSS.

## Development Commands

```bash
# Install dependencies (already run by postCreateCommand)
npm install

# Start Vite dev server (available at http://localhost:5173)
npm run dev

# Type-check the project
npm run build   # also acts as a type-check; fails on TS errors

# Lint
npm run lint

# Run tests (once configured)
npm run test

# Preview production build
npm run preview
```

## Tech Stack

- **Vite** — build tool and dev server
- **React 18** — UI framework
- **TypeScript** — strict typing throughout
- **Tailwind CSS** — utility-first styling; config in `tailwind.config.js`
- **PostCSS** — Tailwind processing via `postcss.config.js`

## Project Setup Checklist (complete in devcontainer)

These steps scaffold the project and should be done once inside the devcontainer. They are NOT done on the host machine.

1. **Scaffold Vite project**
   ```bash
   npm create vite@latest . -- --template react-ts
   ```

2. **Install base dependencies**
   ```bash
   npm install
   ```

3. **Install Tailwind and tooling**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

4. **Configure Tailwind** — update `tailwind.config.js` content paths:
   ```js
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   ```

5. **Add Tailwind directives** to `src/index.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

6. **Verify** by running `npm run dev` and confirming the Vite default page loads.

## Live Scores API

**Base URL**: `https://livescores.worldcurling.org/curlitsse/Result/LiveResults`

CORS is open (`access-control-allow-origin: *`) — call directly from the browser, no proxy needed.

**Query parameters**:
| Param | Value | Notes |
|-------|-------|-------|
| `season` | `2526` | 2025-26 season |
| `competition` | `WJCC` | World Junior Curling Championship |
| `eventId` | `1` or `2` | 1 = Men, 2 = Women |
| `sessionId` | `0` | 0 = current/latest session; use 1,2,3… for specific sessions |
| `testMode` | `false` | always false |

**Example**:
```
https://livescores.worldcurling.org/curlitsse/Result/LiveResults?season=2526&competition=WJCC&eventId=1&sessionId=0&testMode=false
```

**Response shape** (array of game objects):
```jsonc
[
  {
    "gamesTitle": "Session 1 - Draw 1",
    "sheet": "A",
    "status": "running",   // "running" | "official"
    "cEnd": 7,             // current end number; null when complete
    "homeTeam": {
      "noc": "CAN",
      "teamShortName": "Canada",
      "total": 5,
      "w": 3,
      "l": 1,
      "winner": null,      // null | true | false
      "lsfe": true,        // has hammer in first end
      "lsce": false        // has hammer in current end
    },
    "awayTeam": { /* same shape */ },
    "ends": {
      "1": { "h": "2", "a": "0" },
      "2": { "h": "0", "a": "1" },
      "7": { "h": " ", "a": " " },  // " " = not yet played
      "EE": { "h": "X", "a": "X" }  // "X" = blank end; EE = extra end
    }
  }
]
```

**Standings**: Derived from game data — `w` and `l` on each team object reflect cumulative record. Collect unique teams across all games in a session.

**Schedule**: Only available via server-rendered HTML (no CORS) — not implemented.

## Architecture Notes

- All source code lives under `src/`
- Components go in `src/components/`
- Types and interfaces go in `src/types/` — see `src/types/api.ts`
- API / data-fetching utilities go in `src/utils/` — see `src/utils/api.ts`
- Custom hooks go in `src/hooks/` — see `src/hooks/useLiveResults.ts`

## Tailwind Configuration

After init, ensure `tailwind.config.js` includes the full content glob:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

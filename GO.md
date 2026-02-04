# GO.md - Claude Code Onboarding Procedure

**Purpose**: Standard onboarding protocol for fresh Claude Code instances working on Mangaroa Impact Reporting (Vite + React + TypeScript SPA).

---

## Onboarding Checklist

When a user says "read GO.md" or similar, follow this procedure:

### Step 1: Status Check (no automated script)

This project has no automated status check script. Use documentation plus quick repo checks.

Suggested commands (if helpful):

```bash
git status
```

### Note on Agent Compatibility

`CLAUDE.md` contains the development guide and rules. It applies to all agents working on this codebase (Claude Code, Codex, or otherwise). No separate agent-specific file is needed.

### Step 2: Read Core Documentation (in order)

1. **README.md** - Architecture and overview
2. **ACTIVE.md** - Current production status (create if missing)
3. **TODO.md** - Current tasks and development roadmap (create if missing)
4. **CHANGELOG.md** - History of features and improvements (create if missing)

### Step 3: Provide Brief Assessment

After reading all files, provide a brief assessment (1-2 paragraphs) covering:

- **Production Status**: Current system health, known warnings
- **Recent Progress**: Last 1-2 major completions from CHANGELOG.md
- **Current Focus**: In-progress or next priority from TODO.md
- **Architecture State**: Notable technical details or blockers

### Step 4: Ask What To Work On

Present the current priorities from TODO.md and ask which area to focus on.

---

## Current Codebase State (as of 2026-02-05)

- **Project Type**: Vite + React 18 + TypeScript single-page app
- **Styling**: Tailwind via CDN in `index.html`, inline `className` strings
- **Data**: Airtable via `data.ts` (proxy at `/api/airtable`), with safe defaults
- **Key Entry Points**: `index.tsx`, `App.tsx`, `components/`

**Essential Commands**:

```bash
npm install
npm run dev
npm run build
npm run preview
```

**Known Runtime Notes**:
- Vite dev server uses proxy for Airtable; without a backend, requests to `/api/airtable` will show `ECONNREFUSED` in dev logs and fall back where mocks exist.

---

## GO LOG (Plans + Executions)

Log each plan and execution here.

### 2026-02-05

**Plan**: Add Earth page high-level framing and adjust People page data for public-safe display.
**Execution**:
- Added Earth framing section before `PredatorFree` in `App.tsx`.
- Updated People domain narrative and metrics wording in `constants.ts`.
- Switched People page to first-name-only participant data and public-safe phrasing in `components/MahiExchange.tsx`.
- Updated People chatbot prompt language in `components/ImpactChatbot.tsx`.
- Installed dependencies with `npm install`.
- Started dev server with `npm run dev` (Airtable proxy unavailable in local env).

### 2026-02-05 (b)

**Plan**: Install Playwright for browser interaction, create GO documentation system.
**Execution**:
- Installed `playwright` npm package and all browser binaries (Chromium, Firefox, WebKit).
- Created `GO.md`, `CLAUDE.md`, `ACTIVE.md`, `TODO.md`, `CHANGELOG.md`.
- Added agent compatibility note to `GO.md`.

### 2026-02-05 (c)

**Plan**: Build comprehensive MANGAROA.md brand guide from mangaroa.org.
**Execution**:
- Scraped all major pages: homepage, about, predator free, about our meat, mahi exchange, earth school, volunteer, earth fellows, navigator x, stay.
- Compiled brand identity, mission, pillars, voice & tone, te reo usage, visual language, key people, site architecture, partner ecosystem, seasonal rhythms, and writing guidelines.
- Created `MANGAROA.md` at project root.

### 2026-02-05 (d)

**Plan**: Visual design alignment — match impact site to mangaroa.org patterns.
**Execution**:
- Updated footer in `App.tsx`: dark green background (#2D4F2D), white logo, white text, external links to mangaroa.org.
- Added "mangaroa.org →" link to nav bar (desktop only, hidden on mobile to preserve space).
- Switched body font stack in `index.html` to `aktiv-grotesk, Inter, sans-serif` for brand consistency with main site (macron support via Typekit).
- Quick Links in footer now point to full mangaroa.org URLs (external) instead of relative paths.
- Build verified: clean, 48 modules, no errors.

---

## Common Pitfalls

- Do not add new global CSS; keep styling in Tailwind class strings.
- Keep imports explicit with file extensions (`./Foo.tsx`).
- Avoid reformatting unrelated sections.

---

## Quick Reference

- **Project Type**: Impact reporting SPA
- **Architecture**: Vite SPA, React components, Airtable data access
- **Current Phase**: Content framing and data presentation updates

**Key Technologies**:
- React 18
- Vite 5
- TypeScript
- Tailwind CDN

---

**When in doubt, ask the user for clarification.**

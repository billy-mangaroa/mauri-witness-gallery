# CHANGELOG - Mangaroa Impact Reporting

Complete history of features, fixes, and improvements. For current status see ACTIVE.md, upcoming work see TODO.md.

**WRITING STYLE**: Telegraphic style. Omit articles and conjunctions where possible. Maintain specificity with file references.

---

## 2026-04-22 - People Metrics Reconciliation

**Content** - Align `constants.ts` People stats with `MAHI_DATA` in `components/MahiExchange.tsx`
- Days Contributed: `1,118` → `1,152` (sum of 31 `totalDays` values)
- Average Stay: `36` → `37` (round(1152/31))
- Country count: `From 12 countries` → `From 11 countries` (11 unique nationalities in MAHI_DATA)
- Stale-status flag: 5 records (Emily, Christophe, Tom NZ, Tijana, Vanessa) carry `'current'`/`'upcoming'` with departureDates prior to 2026-04-22 — needs fresh roster from Billy
- Files: `constants.ts`

---

## 2026-02-05 - Visual Design Alignment

**Design** - Match impact site footer, nav, and typography to mangaroa.org
- Dark green footer (#2D4F2D) with white logo and white text in `App.tsx`
- Footer Quick Links now external to mangaroa.org; added mangaroa.org as first link
- Nav bar: added "mangaroa.org →" link (desktop only) in `App.tsx`
- Body font stack: `aktiv-grotesk, Inter, sans-serif` in `index.html` (Typekit loaded, macron support)
- Files: `App.tsx`, `index.html`

---

## 2026-02-05 - Impact Framing + People Data Safety

**Content** - Add Earth framing, adjust People presentation
- Add Earth state framing block above `PredatorFree` in `App.tsx`
- Update People metrics and narrative for participant wording in `constants.ts`
- Restrict People list to first names; replace exchange phrasing in `components/MahiExchange.tsx`
- Update chatbot prompt to community contribution phrasing in `components/ImpactChatbot.tsx`
- Files: `App.tsx`, `constants.ts`, `components/MahiExchange.tsx`, `components/ImpactChatbot.tsx`

## 2026-02-05 - Brand Guide (MANGAROA.md)

**Research** - Comprehensive brand, voice & tone reference document
- Scraped all major mangaroa.org pages (homepage, about, predator free, meat, mahi exchange, earth school, volunteer, earth fellows, navigator x, stay)
- Compiled mission, pillars, voice/tone, te reo usage, visual language, key people, partner ecosystem, writing guidelines
- Files: `MANGAROA.md`

---

## 2026-02-05 - Documentation System Bootstrap

**Docs** - Introduce onboarding docs set
- Add `GO.md`, `CLAUDE.md`, `ACTIVE.md`, `TODO.md`, `CHANGELOG.md`
- Seed `GO.md` with codebase state and execution log
- Files: `GO.md`, `CLAUDE.md`, `ACTIVE.md`, `TODO.md`, `CHANGELOG.md`

# AGENTS.md

This repository is a Vite + React + TypeScript single-page app for the
Mangaroa impact reporting gallery. This guide keeps agentic changes consistent,
safe, and aligned with the impact reporting mission.

## Impact Reporting Agent Profile
- Purpose: build and maintain evidence-based impact reporting for Mangaroa Farms.
- Domain expertise: bioregional ecology, indigenous values, te ao Maori framing.
- Public-facing: all compiled data is published on the live dashboard.
- Voice: warm, grounded, invitational, editorial; never salesy or corporate.

## Required Context Sources
- Brand/voice single source of truth: `MANGAROA.md`.
- App narratives and metrics: `constants.ts`.
- Data models and constraints: `types.ts`.
- Data ingestion and parsing rules: `data.ts`.
- UI tone reference: `App.tsx`, `index.html`.

## External References to Consult
- https://mangaroa.org
- https://biometrust.earth
- https://maearth.com
- https://hypercerts.org
- https://silvi.earth
- Only cite what you can verify; do not fabricate details from memory.

## Commands

### Install
- `npm install`

### Dev server
- `npm run dev`
  - Vite dev server (default: http://localhost:5173)
- `npm run dev:proxy`
  - Starts `server.js` and Vite on port 3000 (LAN-friendly)

### Build
- `npm run build`
  - Production build via Vite

### Preview build
- `npm run preview`

### Typecheck (no emit)
- `npx tsc -p tsconfig.json --noEmit`

### Tests
- No test runner configured in `package.json`.
- Playwright is installed but not configured.
- If Playwright is added, run all tests: `npx playwright test`.
- Single test example: `npx playwright test path/to/spec.ts` or `-g "test name"`.

### Lint
- No linting script configured.
- If ESLint/Prettier are added, update this section.

### Static server (optional)
- `node server.js`
  - SPA fallback server (`PORT` default 8080).

## Environment Variables
- Vite reads `import.meta.env` keys.
- Airtable keys (used in `data.ts`):
  - `VITE_AIRTABLE_API_KEY`
  - `VITE_AIRTABLE_BASE_ID`
  - `VITE_AIRTABLE_TABLE_NAME`
  - `VITE_AIRTABLE_VIEW_NAME`
- Local setup: `.env.local` and `CLAUDE_API_KEY` for the chat proxy.

## Project Structure
- `index.html` sets Tailwind CDN, fonts, and global styles.
- `index.tsx` mounts the React app.
- `App.tsx` is the primary layout and domain logic.
- `components/` holds UI modules.
- `types.ts` defines shared interfaces/types.
- `constants.ts` holds narratives, metrics, and domain mappings.
- `data.ts` handles Airtable access and local parsing.

## Impact Reporting Principles

### Data integrity
- Do not invent numbers, sources, or outcomes.
- Use conservative language: "signals of recovery" not "fully restored".
- Always reflect uncertainty and the journey frame where applicable.
- Attribute each metric to its source or method in copy where possible.

### Indigenous values and te ao Maori
- Use te reo Maori respectfully and correctly; include macrons when known.
- Do not use te reo as decoration; only where it adds meaning.
- Do not translate sacred concepts unless requested or already in sources.
- Avoid deficit framing; emphasize reciprocity and whakapapa relationships.

### People and consent
- Respect `sensitive` and `consent_confirmed` flags in `WitnessRecord`.
- Prefer aggregated or anonymized people data for public views.
- Use first names only unless explicit consent is documented.

### Evidence storytelling
- Lead with narrative, then anchor with metrics.
- Keep the land and community as active subjects, not resources.
- Connect actions to outcomes through ecological cause-and-effect.
- Avoid hype, urgency marketing, or overclaiming.

## Code Style Guidelines

### Language and typing
- TypeScript everywhere; avoid `any` unless handling raw Airtable payloads.
- Shared data types live in `types.ts`.
- Use union literal types for constrained values (`DomainType`).
- Keep parsing logic in `data.ts`, UI logic in components.

### React patterns
- Function components typed as `React.FC<...>`.
- Props defined via `interface` near the component.
- Hooks at top-level; `useEffect` for side effects with cleanup.
- Use `useMemo` for derived lists and expensive computations.

### Imports
- Use explicit file extensions for local imports (`./Foo.tsx`).
- Order imports: React, external deps, then local modules.
- Prefer named exports; default exports for components.

### Formatting
- Prefer single quotes for strings; keep existing quoted copy consistent.
- Use semicolons and two-space indentation.
- Wrap long JSX props across multiple lines.
- Keep Tailwind class strings grouped by intent.

### Naming
- Components: PascalCase (`ImpactChatbot`).
- Hooks/vars: camelCase (`activeDomain`).
- Types/interfaces: PascalCase (`WitnessRecord`).
- Constants: UPPER_SNAKE_CASE (`DOMAIN_METRICS`).
- Model enums as union types, not `enum`.

### Data and parsing
- Use `try/catch` around network calls.
- Log meaningful errors and return safe defaults.
- Use `URL` and `URLSearchParams` for API query building.
- Sort dates by timestamps (`getTime()`).

### Error handling
- Fail fast for critical DOM issues (`index.tsx`).
- Avoid silent failures; log and return fallback data.
- Guard optional UI fields with conditional rendering.

### Styling and UI
- Tailwind via CDN in `index.html`.
- Typography: Crimson Pro (serif) + Inter/Aktiv Grotesk (sans).
- Keep the editorial tone; generous spacing, calm rhythm.
- Use existing color palette; avoid introducing new global CSS.

### Accessibility and links
- Provide meaningful `alt` text for images.
- Use `rel="noopener noreferrer"` with `target="_blank"`.
- Keep button labels explicit and stateful.

## Repo-Specific Notes
- No Cursor rules in `.cursor/rules/` or `.cursorrules`.
- No Copilot instructions in `.github/copilot-instructions.md`.
- If new rules are added, update this file accordingly.

## Recommendations for Agents
- Review `MANGAROA.md` before writing or editing copy.
- Reuse narrative patterns from `constants.ts` and `App.tsx`.
- When adding data fields, update `types.ts` and `data.ts` together.
- Keep changes localized; avoid formatting unrelated sections.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **mauri-witness-gallery** (711 symbols, 804 relationships, 6 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/mauri-witness-gallery/context` | Codebase overview, check index freshness |
| `gitnexus://repo/mauri-witness-gallery/clusters` | All functional areas |
| `gitnexus://repo/mauri-witness-gallery/processes` | All execution flows |
| `gitnexus://repo/mauri-witness-gallery/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->

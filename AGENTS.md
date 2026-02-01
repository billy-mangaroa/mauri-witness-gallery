# AGENTS.md

This repository is a Vite + React + TypeScript single-page app.
Use this guide to keep agentic changes consistent, safe, and aligned
with existing patterns.

## Quick Facts
- Package manager: npm (package.json only)
- Framework: React 18 + Vite 5
- Styling: Tailwind via CDN in `index.html` + inline `className` strings
- Build output: Vite default `dist/`
- No lint/test scripts defined in `package.json`

## Commands

### Install
- `npm install`

### Dev server
- `npm run dev`
  - Vite dev server on http://localhost:3000
  - Config in `vite.config.ts` (host 0.0.0.0, port 3000)

### Build
- `npm run build`
  - Production build via Vite

### Preview build
- `npm run preview`
  - Serves Vite build output

### Tests
- No test runner configured in `package.json`.
- There is no command to run a single test yet.
- If tests are added, document single-test commands here (e.g. `vitest path/to.test.ts`).

### Lint
- No linting script configured.
- If ESLint/Prettier are added, update this section.

### Static server (optional)
- `node server.js`
  - Basic SPA static server (fallbacks to `index.html`)
  - Uses `PORT` or defaults to 8080

## Environment Variables
- Vite reads `import.meta.env` keys.
- Used keys in `data.ts`:
  - `VITE_AIRTABLE_API_KEY`
  - `VITE_AIRTABLE_BASE_ID`
  - `VITE_AIRTABLE_TABLE_NAME`
  - `VITE_AIRTABLE_VIEW_NAME`
- Local setup: `README.md` mentions `.env.local` and `CLAUDE_API_KEY` for the chat proxy.

## Project Structure
- `index.html` sets up Tailwind CDN and font families.
- `index.tsx` mounts React app.
- `App.tsx` is the primary layout and page composition.
- `components/` contains React UI modules.
- `types.ts` defines shared types/interfaces.
- `constants.ts` holds app-wide constants and narratives.
- `data.ts` handles Airtable access and mock data.

## Code Style Guidelines

### Language and typing
- TypeScript everywhere; prefer explicit types over `any`.
- Shared data types live in `types.ts`.
- Exported types use `type` or `interface` as appropriate.
- Use union literal types for constrained values (see `DomainType`).

### React patterns
- Components are function components typed as `React.FC<...>`.
- Props are defined via `interface` next to the component.
- Hooks are imported from React and used at top-level.
- Side effects are wrapped in `useEffect` with cleanup when needed.
- Use `useMemo` for derived lists and expensive computations.

### Imports
- Use explicit file extensions in local imports (`./Foo.tsx`, `../types.ts`).
- Order imports: React first, then local modules.
- Named imports are preferred; default exports used for components.

### Formatting
- Use single quotes for strings.
- Use semicolons at statement ends.
- Two-space indentation.
- JSX attributes are multi-line when long.
- Keep Tailwind class strings readable and grouped by intent.

### Naming
- Components: PascalCase (`TeamMemberModal`).
- Hooks and variables: camelCase (`activeDomain`, `domainNarrative`).
- Types/interfaces: PascalCase (`WitnessRecord`).
- Constants: UPPER_SNAKE_CASE (`DOMAIN_METRICS`).
- Enums are modeled as union types, not `enum`.

### Data and parsing
- Data fetching is centralized in `data.ts`.
- Use `try/catch` around network requests.
- Log meaningful errors with context (`console.error`/`console.warn`).
- When data may be missing, return safe defaults (empty arrays, fallbacks).
- Use `URL` and `URLSearchParams` for API query building.

### Error handling
- Fail fast for critical DOM issues (see `index.tsx`).
- Handle API errors with explicit messages and fallback behavior.
- Avoid silent failures; log and return a safe default.
- For optional UI data, guard with conditional rendering.

### Styling and UI
- Tailwind is loaded via CDN in `index.html`.
- Custom fonts: Inter for sans, Crimson Pro for serif (see `index.html`).
- Keep `className` strings consistent with existing tone (editorial, serif-heavy).
- Use `font-serif` class when matching typography of existing UI.
- Animations use Tailwind utility classes (`animate-in`, `fade-in`, etc.).

### Accessibility and links
- Provide `alt` text for images when meaningful.
- Use `rel="noopener noreferrer"` for `target="_blank"` links.
- Buttons use `onClick` handlers with clear intent and states.

### Date handling
- Use `new Date(...)` and `toLocaleDateString('en-NZ', ...)` for display.
- When sorting by date, compare timestamps (`getTime()`).

### File edits
- Prefer editing the most specific component instead of adding new ones.
- Keep changes localized unless refactor is clearly warranted.
- Avoid reformatting unrelated sections.

## Repo-Specific Notes
- There are no Cursor rules in `.cursor/rules/` or `.cursorrules`.
- There are no Copilot instructions in `.github/copilot-instructions.md`.
- If new rules are added, update this file accordingly.

## Recommendations for Agents
- Before modifying styles, scan `App.tsx` and `index.html` for tone.
- Reuse existing typography patterns and color tokens.
- Avoid introducing new global CSS unless necessary.
- Keep imports explicit and consistent with existing file extensions.
- When adding data fields, update `types.ts` and `data.ts` together.

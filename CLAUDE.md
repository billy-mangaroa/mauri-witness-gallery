# Mangaroa Impact Reporting Development Guide

**For onboarding**: Read `GO.md` first for complete project context.
**For architecture**: See `README.md`
**For current status**: See `ACTIVE.md`

This guide covers development workflow, code patterns, and critical rules.

---

## Essential Commands

### Environment Setup

```bash
npm install
```

### Development Commands

```bash
npm run dev
npm run build
npm run preview
```

### Process Management

```bash
node server.js
```

---

## Development Guidelines

### Code Style

- TypeScript everywhere; prefer explicit types over `any`.
- Components are `React.FC` with props interfaces defined next to the component.
- Use explicit file extensions in local imports (`./Foo.tsx`, `../types.ts`).
- Two-space indentation, single quotes, semicolons.
- Use `useMemo` for derived lists or expensive computations.
- Keep Tailwind class strings readable and grouped by intent.

### Data and Parsing

- Data fetching is centralized in `data.ts`.
- Use `try/catch` around network requests and log meaningful errors.
- When data is missing, return safe defaults (empty arrays, fallbacks).
- Use `URL` and `URLSearchParams` for API query building.

### Error Handling

- Fail fast for critical DOM issues.
- Avoid silent failures; log and return a safe default.
- Guard optional UI data with conditional rendering.

### Documentation Style

**CHANGELOG.md - Telegraphic Style**:
- Omit articles and conjunctions where possible.
- Maintain specificity: include file references, error details, technical accuracy.
- Target 3-8 lines per entry for recent work, 1-3 lines for older entries.

---

## CRITICAL RULES

- Do not add global CSS unless necessary.
- Avoid reformatting unrelated sections.
- Keep imports explicit with file extensions.
- Use Tailwind CDN classes only (no new CSS files).

---

## Troubleshooting

### Common Issues

- **Airtable proxy errors**: `/api/airtable` requires a backend/proxy; dev server will show `ECONNREFUSED` without it.
- **Missing data**: Fallback mock data is used where available (see `data.ts`).

---

## Documentation Structure

- **GO.md** - Start here for onboarding procedure
- **README.md** - Architecture overview
- **ACTIVE.md** - Current production status
- **TODO.md** - Development roadmap
- **CHANGELOG.md** - History of features and improvements
- **CLAUDE.md** - This file - development workflow and patterns

---

**Remember**: This is a Vite + React + TypeScript SPA with Tailwind via CDN and inline class strings.

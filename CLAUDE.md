> **Read PREFERENCES.md in workspace root (`/Users/billylewis/workspace/PREFERENCES.md`) before starting work.**

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

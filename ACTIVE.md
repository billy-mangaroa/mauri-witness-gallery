# ACTIVE - Mangaroa Impact Reporting System Status

**Last Updated**: 2026-02-05
**System Health**: Local dev running; Airtable proxy unavailable in local env

## Live Metrics

### Build & Runtime
- **Vite Dev Server**: Running at `http://localhost:3000`
- **Proxy Status**: `/api/airtable` returning `ECONNREFUSED` locally

### Data Sources
- **Airtable**: Accessed via proxy in `data.ts`
- **Fallback Data**: Mocks used where available

---

## System Resources

### Services
| Service | Status | Purpose |
|---------|--------|---------|
| Vite dev server | Running | Local SPA dev |
| Airtable proxy | Not running | Airtable data fetch |

---

## API Endpoints

### Proxy
- `GET /api/airtable?type=records` - Witness records
- `GET /api/airtable?type=orgs` - Organisations
- `GET /api/airtable?type=team` - Team members
- `GET /api/airtable?type=events` - Events

---

## Current Capabilities

### Impact Reporting Pages
- Earth, People, Network domains enabled
- Earth narrative framing added above impact data
- People data shown with first names only

### Data Pipelines
- Airtable fetch with error handling
- Mock data fallback for events and some views

---

## Quick Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

---

## Documentation References

- **GO.md** - Onboarding procedure
- **README.md** - Architecture overview
- **TODO.md** - Development roadmap
- **CHANGELOG.md** - Version history

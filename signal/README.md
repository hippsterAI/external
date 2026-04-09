# SIGNAL — Community College Intelligence Platform

One URL. Every answer. A unified intelligence layer that sits on top of
Ellucian Banner, Workday, Brightspace, Salesforce, Raiser's Edge, and ServiceNow.

## Architecture
```
Ellucian Banner ──┐
Workday HCM    ──┤
Brightspace    ──┼──► Luminara_SIGNAL (SQL Server) ──► signal_live.html
Salesforce     ──┤       Single Source of Truth             │
Raiser's Edge  ──┤                                          ▼
ServiceNow     ──┘                                    Claude API Ask
```

## Data Standards
- CEDS — Common Education Data Standards (US Dept of Education)
- HEDM — Higher Education Data Model (Ellucian open standard)
- HERM — Higher Education Reference Models v3.2 (EDUCAUSE Dec 2025)
- 1EdTech Caliper — Learning data standard (Brightspace/D2L)

## Folders
- `/core` — Database schema, CEDS-aligned tables, intelligence views
- `/connectors` — API integration scripts per source system
- `/portal` — Python server + HTML dashboard
- `/docs` — Architecture, data model mapping, sandbox setup guides

## Target
900 community colleges in the US.
CHESS consortium — 6 New Mexico colleges on shared Workday instance.

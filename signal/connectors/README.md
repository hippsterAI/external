# SIGNAL Connectors

Each connector: authenticate → pull → upsert to SQL → update sync timestamp.

## Sandbox Setup (fastest to slowest)
1. Salesforce — developer.salesforce.com/signup — 5 min, free
2. ServiceNow — developer.servicenow.com — 30 min, free PDI
3. Workday — developer.workday.com — 1-2 days, tenant request
4. Brightspace — d2l.com trial — 1 day
5. Raiser's Edge — developer.blackbaud.com — 2-3 days
6. Banner/Ethos — developers.ellucian.com — 3-5 days

## Files
- `workday_connector.py` — HR / Staff positions
- `salesforce_connector.py` — Donor / Prospect pipeline
- `banner_connector.py` — Student enrollment (coming Week 3)
- `servicenow_connector.py` — Tickets / License assets (coming Month 2)
- `brightspace_connector.py` — Student engagement (coming Month 2)
- `raisersedge_connector.py` — Donors / Gifts (coming Month 2)

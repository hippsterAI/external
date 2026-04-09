# SIGNAL Portal

## Files
- `signal_live.html` — Live dashboard, connects to Python API server
- `signal_server.py` — Python stdlib HTTP server on port 7000

## Run
```
python signal_server.py
open signal_live.html
```

## API Endpoints
- GET /api/all — All data
- GET /api/kpi — KPI summary
- GET /api/signals — Active signals
- GET /api/enrollment — Program health
- GET /api/at-risk — At-risk students
- GET /api/licenses — License status
- GET /api/budget — Budget ledger
- GET /api/donors — Donor pipeline
- GET /api/systems — Source system sync status

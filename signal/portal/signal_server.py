"""
SIGNAL Platform — Python Server
================================
Feeds the SIGNAL portal with live data from Luminara_SIGNAL database.
Single file. No FastAPI. Pure stdlib + pyodbc.

Run:
    python signal_server.py

Open:
    http://localhost:7000

Author: builtindays.co · Senior DBA Portfolio
"""

import json
import pyodbc
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse

# ── CONFIG ────────────────────────────────────────────────────
SQL_SERVER = "localhost"
DATABASE   = "Luminara_SIGNAL"
PORT       = 7000
CONN_STR   = (
    "DRIVER={ODBC Driver 17 for SQL Server};"
    f"SERVER={SQL_SERVER};DATABASE={DATABASE};"
    "Trusted_Connection=yes;Connection Timeout=10;"
)
# ─────────────────────────────────────────────────────────────


def get_conn():
    return pyodbc.connect(CONN_STR)


def fetch_kpi():
    try:
        conn = get_conn()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM dbo.vw_SignalKPI")
        row = cursor.fetchone()
        cols = [d[0] for d in cursor.description]
        result = dict(zip(cols, row))
        for k, v in result.items():
            if hasattr(v, 'isoformat'):
                result[k] = v.isoformat()
            elif v is None:
                result[k] = 0
        conn.close()
        return result
    except Exception as e:
        return {"error": str(e)}


def fetch_signals():
    try:
        conn = get_conn()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT TOP 10
                Severity, Domain, SignalText, DataSource,
                RecommendedAction,
                DATEDIFF(MINUTE, LogDateUTC, GETUTCDATE()) AS MinutesAgo
            FROM dbo.SignalLog
            WHERE Acknowledged = 0
            ORDER BY
                CASE Severity WHEN 'CRITICAL' THEN 1 WHEN 'WARNING' THEN 2 ELSE 3 END,
                LogDateUTC DESC
        """)
        cols = [d[0] for d in cursor.description]
        rows = [dict(zip(cols, r)) for r in cursor.fetchall()]
        conn.close()
        return rows
    except Exception as e:
        return [{"error": str(e)}]


def fetch_systems():
    try:
        conn = get_conn()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT SystemName, SystemType, SyncStatus,
                   DATEDIFF(MINUTE, LastSyncUTC, GETUTCDATE()) AS MinutesSinceSync,
                   RecordCount
            FROM dbo.SourceSystems
            ORDER BY SystemType, SystemName
        """)
        cols = [d[0] for d in cursor.description]
        rows = [dict(zip(cols, r)) for r in cursor.fetchall()]
        conn.close()
        return rows
    except Exception as e:
        return [{"error": str(e)}]


def fetch_enrollment():
    try:
        conn = get_conn()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT ProgramName, Division, Enrolled, Capacity,
                   FillRatePct, YOYChangePct, InstructorVacancies,
                   Waitlisted, Status, Trend
            FROM dbo.vw_EnrollmentHealth
            ORDER BY YOYChangePct DESC
        """)
        cols = [d[0] for d in cursor.description]
        rows = [dict(zip(cols, r)) for r in cursor.fetchall()]
        for row in rows:
            for k, v in row.items():
                if v is None: row[k] = 0
                elif hasattr(v, 'item'): row[k] = v.item()
        conn.close()
        return rows
    except Exception as e:
        return [{"error": str(e)}]


def fetch_at_risk():
    try:
        conn = get_conn()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT TOP 10 StudentName, BannerID, Program,
                   GPA, AbsenceCount, FinancialHold,
                   AtRiskScore, AtRiskReason
            FROM dbo.vw_AtRiskStudents
            ORDER BY AtRiskScore DESC
        """)
        cols = [d[0] for d in cursor.description]
        rows = [dict(zip(cols, r)) for r in cursor.fetchall()]
        for row in rows:
            for k, v in row.items():
                if v is None: row[k] = ''
                elif hasattr(v, 'item'): row[k] = v.item()
        conn.close()
        return rows
    except Exception as e:
        return [{"error": str(e)}]


def fetch_licenses():
    try:
        conn = get_conn()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT TOP 8 SoftwareName, Vendor, Category,
                   ITSContact, FY26Budget, ContractEnd,
                   DaysUntilExpiry, AlertStatus
            FROM dbo.SoftwareLicense
            ORDER BY
                CASE AlertStatus
                    WHEN 'EXPIRED'  THEN 1
                    WHEN 'WARNING'  THEN 2
                    WHEN 'NOTICE'   THEN 3
                    WHEN 'CURRENT'  THEN 4
                    ELSE 5 END,
                ContractEnd ASC
        """)
        cols = [d[0] for d in cursor.description]
        rows = [dict(zip(cols, r)) for r in cursor.fetchall()]
        for row in rows:
            for k, v in row.items():
                if v is None: row[k] = ''
                elif hasattr(v, 'strftime'): row[k] = v.strftime('%m/%d/%y')
                elif hasattr(v, 'item'): row[k] = v.item()
        conn.close()
        return rows
    except Exception as e:
        return [{"error": str(e)}]


def fetch_budget():
    try:
        conn = get_conn()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT Department, FundType, BudgetAmount,
                   Encumbered, Expended, Available,
                   UtilizationPct, AlertStatus
            FROM dbo.BudgetLedger
            ORDER BY UtilizationPct DESC
        """)
        cols = [d[0] for d in cursor.description]
        rows = [dict(zip(cols, r)) for r in cursor.fetchall()]
        for row in rows:
            for k, v in row.items():
                if v is None: row[k] = 0
                elif hasattr(v, 'item'): row[k] = float(v)
        conn.close()
        return rows
    except Exception as e:
        return [{"error": str(e)}]


def fetch_donors():
    try:
        conn = get_conn()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT TOP 6 DonorName, DonorType, Stage,
                   AskAmount, PledgeAmount, DaysSinceContact,
                   NextAction, AssignedTo, Priority
            FROM dbo.DonorPipeline
            ORDER BY
                CASE Priority WHEN 'HIGH' THEN 1 WHEN 'MED' THEN 2 ELSE 3 END,
                DaysSinceContact DESC
        """)
        cols = [d[0] for d in cursor.description]
        rows = [dict(zip(cols, r)) for r in cursor.fetchall()]
        for row in rows:
            for k, v in row.items():
                if v is None: row[k] = ''
                elif hasattr(v, 'item'): row[k] = float(v)
        conn.close()
        return rows
    except Exception as e:
        return [{"error": str(e)}]


def get_all_data():
    return {
        "kpi":        fetch_kpi(),
        "signals":    fetch_signals(),
        "systems":    fetch_systems(),
        "enrollment": fetch_enrollment(),
        "at_risk":    fetch_at_risk(),
        "licenses":   fetch_licenses(),
        "budget":     fetch_budget(),
        "donors":     fetch_donors(),
        "refreshed":  datetime.now().strftime('%I:%M:%S %p'),
        "date":       datetime.now().strftime('%A · %B %d, %Y')
    }


class Handler(BaseHTTPRequestHandler):

    def log_message(self, fmt, *args):
        print(f"  {args[1]} {args[0]}")

    def send_json(self, data, status=200):
        body = json.dumps(data, default=str).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Length', len(body))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed = urlparse(self.path)

        if parsed.path == '/api/all':
            self.send_json(get_all_data())
        elif parsed.path == '/api/kpi':
            self.send_json(fetch_kpi())
        elif parsed.path == '/api/signals':
            self.send_json(fetch_signals())
        elif parsed.path == '/api/enrollment':
            self.send_json(fetch_enrollment())
        elif parsed.path == '/api/at-risk':
            self.send_json(fetch_at_risk())
        elif parsed.path == '/api/licenses':
            self.send_json(fetch_licenses())
        elif parsed.path == '/api/budget':
            self.send_json(fetch_budget())
        elif parsed.path == '/api/donors':
            self.send_json(fetch_donors())
        elif parsed.path == '/api/systems':
            self.send_json(fetch_systems())
        elif parsed.path == '/health':
            self.send_json({"status": "ok", "server": SQL_SERVER, "db": DATABASE})
        else:
            self.send_response(404)
            self.end_headers()


if __name__ == '__main__':
    print('=' * 52)
    print('SIGNAL Platform — Data Server')
    print(f'  http://localhost:{PORT}/api/all')
    print(f'  http://localhost:{PORT}/api/kpi')
    print(f'  http://localhost:{PORT}/api/signals')
    print(f'  Server: {SQL_SERVER} / {DATABASE}')
    print('=' * 52)
    server = HTTPServer(('0.0.0.0', PORT), Handler)
    print(f'Listening on port {PORT} — Ctrl+C to stop\n')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nServer stopped.')

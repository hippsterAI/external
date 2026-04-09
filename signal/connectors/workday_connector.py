"""
SIGNAL Connector — Workday HCM
================================
Pulls Staff/Position data from Workday REST API
into Luminara_SIGNAL.dbo.StaffPosition

Sandbox: developer.workday.com
Auth: OAuth 2.0 Bearer Token
"""

import requests
import pyodbc
from datetime import datetime

WORKDAY_BASE_URL = 'https://wd2-impl-services1.workday.com/ccx/api'
WORKDAY_TENANT   = 'your_tenant'
CLIENT_ID        = 'your_client_id'
CLIENT_SECRET    = 'your_client_secret'
TOKEN_URL        = f'{WORKDAY_BASE_URL}/v1/{WORKDAY_TENANT}/token'

SQL_SERVER = 'localhost'
DATABASE   = 'Luminara_SIGNAL'
CONN_STR   = f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={SQL_SERVER};DATABASE={DATABASE};Trusted_Connection=yes;'


def get_token():
    resp = requests.post(TOKEN_URL, data={
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    })
    return resp.json()['access_token']


def pull_workers(token):
    url     = f'{WORKDAY_BASE_URL}/v1/{WORKDAY_TENANT}/workers'
    headers = {'Authorization': f'Bearer {token}'}
    resp    = requests.get(url, headers=headers, params={'limit': 100})
    return resp.json().get('data', [])


def upsert_staff(workers):
    conn   = pyodbc.connect(CONN_STR)
    cursor = conn.cursor()
    count  = 0
    for w in workers:
        cursor.execute("""
            MERGE dbo.StaffPosition AS t
            USING (SELECT ? AS WorkdayPositionID) AS s ON t.WorkdayPositionID = s.WorkdayPositionID
            WHEN MATCHED THEN UPDATE SET Title=?, Department=?, EmploymentStatus=?, StaffType=?
            WHEN NOT MATCHED THEN INSERT (WorkdayPositionID,Title,Department,EmploymentStatus,StaffType,SourceSystem)
            VALUES (?,?,?,?,?,'Workday HCM');
        """, w.get('id'), w.get('jobTitle'),
             w.get('department',{}).get('descriptor'),
             'Active' if w.get('active') else 'Inactive',
             w.get('workerType',{}).get('descriptor'),
             w.get('id'), w.get('jobTitle'),
             w.get('department',{}).get('descriptor'),
             'Active' if w.get('active') else 'Inactive',
             w.get('workerType',{}).get('descriptor'))
        count += 1
    conn.commit()
    cursor.execute("UPDATE dbo.SourceSystems SET LastSyncUTC=GETUTCDATE(),SyncStatus='OK',RecordCount=? WHERE SystemName='Workday HCM'", count)
    conn.commit()
    conn.close()
    return count


if __name__ == '__main__':
    print('SIGNAL — Workday HCM connector')
    token   = get_token()
    workers = pull_workers(token)
    count   = upsert_staff(workers)
    print(f'Synced {count} workers → StaffPosition · {datetime.now().strftime("%I:%M %p")}')

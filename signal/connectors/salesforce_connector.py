"""
SIGNAL Connector — Salesforce CRM
===================================
Pulls Opportunity/Donor data from Salesforce REST API
into Luminara_SIGNAL.dbo.DonorPipeline

Sandbox: developer.salesforce.com/signup (free, 5 min)
Auth: OAuth 2.0 password flow
"""

import requests
import pyodbc
from datetime import datetime

SF_BASE_URL    = 'https://your-instance.salesforce.com'
CLIENT_ID      = 'your_connected_app_client_id'
CLIENT_SECRET  = 'your_client_secret'
USERNAME       = 'your_username'
PASSWORD       = 'your_password'
SECURITY_TOKEN = 'your_security_token'

SQL_SERVER = 'localhost'
DATABASE   = 'Luminara_SIGNAL'
CONN_STR   = f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={SQL_SERVER};DATABASE={DATABASE};Trusted_Connection=yes;'


def get_token():
    resp = requests.post(f'{SF_BASE_URL}/services/oauth2/token', data={
        'grant_type':    'password',
        'client_id':     CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'username':      USERNAME,
        'password':      PASSWORD + SECURITY_TOKEN
    })
    d = resp.json()
    return d['access_token'], d['instance_url']


def pull_opportunities(token, instance_url):
    url  = f'{instance_url}/services/data/v58.0/query'
    soql = "SELECT Id,Name,Account.Name,StageName,Amount,LastActivityDate,Owner.Name FROM Opportunity WHERE IsClosed=false ORDER BY Amount DESC LIMIT 200"
    resp = requests.get(url, headers={'Authorization': f'Bearer {token}'}, params={'q': soql})
    return resp.json().get('records', [])


def upsert_donors(opps):
    conn   = pyodbc.connect(CONN_STR)
    cursor = conn.cursor()
    count  = 0
    for o in opps:
        name = o.get('Account', {}).get('Name') or o.get('Name', '')
        cursor.execute("""
            MERGE dbo.DonorPipeline AS t
            USING (SELECT ? AS RE7ConstituentID) AS s ON t.RE7ConstituentID = s.RE7ConstituentID
            WHEN MATCHED THEN UPDATE SET DonorName=?,Stage=?,AskAmount=?,LastContactDate=?,AssignedTo=?
            WHEN NOT MATCHED THEN INSERT (RE7ConstituentID,DonorName,Stage,AskAmount,LastContactDate,AssignedTo,SourceSystem)
            VALUES (?,?,?,?,?,?,'Salesforce CRM');
        """, o['Id'], name, o.get('StageName'), o.get('Amount',0), o.get('LastActivityDate'),
             o.get('Owner',{}).get('Name'),
             o['Id'], name, o.get('StageName'), o.get('Amount',0), o.get('LastActivityDate'),
             o.get('Owner',{}).get('Name'))
        count += 1
    conn.commit()
    cursor.execute("UPDATE dbo.SourceSystems SET LastSyncUTC=GETUTCDATE(),SyncStatus='OK',RecordCount=? WHERE SystemName='Salesforce CRM'", count)
    conn.commit()
    conn.close()
    return count


if __name__ == '__main__':
    print('SIGNAL — Salesforce CRM connector')
    token, instance_url = get_token()
    opps  = pull_opportunities(token, instance_url)
    count = upsert_donors(opps)
    print(f'Synced {count} opportunities → DonorPipeline · {datetime.now().strftime("%I:%M %p")}')

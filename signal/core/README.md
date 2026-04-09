# SIGNAL Core — Database Schema

## Files
- `create_luminara_db.sql` — Full database, all 12 tables, 3 views, 11 source systems

## CEDS / HEDM Mapping
| Table | CEDS | HEDM | Source |
|-------|------|------|--------|
| Person | Person | persons | Banner |
| StudentAcademic | StudentAcademic | student-academic-credentials | Banner |
| ProgramEnrollment | ProgramParticipation | course-offerings | Banner |
| StaffPosition | Staff/PositionTitle | employment-classifications | Workday |
| BudgetLedger | FinancialAccount | — | Workday |
| DonorPipeline | OrgFinancialTransaction | — | Raiser's Edge |
| CourseSection | CourseSection | sections | ODS |
| SoftwareLicense | SIGNAL proprietary | — | ServiceNow |
| ToolInventory | SIGNAL proprietary | — | Internal |
| VOLTSession | SIGNAL proprietary | — | Internal |

-- ============================================================
-- LUMINARA SIGNAL DATABASE
-- CEDS / HEDM / HERM Aligned Data Model
-- builtindays.co · Senior DBA Portfolio
-- ============================================================

USE master;
GO

IF EXISTS (SELECT name FROM sys.databases WHERE name = 'Luminara_SIGNAL')
    DROP DATABASE Luminara_SIGNAL;
GO

CREATE DATABASE Luminara_SIGNAL;
GO

USE Luminara_SIGNAL;
GO

-- ============================================================
-- META: SOURCE SYSTEMS REGISTRY
-- Maps to HERM Application Reference Model
-- ============================================================
CREATE TABLE dbo.SourceSystems (
    SystemID        INT IDENTITY PRIMARY KEY,
    SystemName      NVARCHAR(50)  NOT NULL,
    SystemType      NVARCHAR(30)  NOT NULL,  -- SIS, HR, LMS, CRM, ITSM, Foundation, Internal
    Vendor          NVARCHAR(50),
    HERMDomain      NVARCHAR(50),            -- HERM Application Domain
    LastSyncUTC     DATETIME DEFAULT GETUTCDATE(),
    SyncStatus      NVARCHAR(10) DEFAULT 'OK', -- OK, WARN, ERROR
    RecordCount     INT DEFAULT 0,
    APIEndpoint     NVARCHAR(200),
    Notes           NVARCHAR(300)
);

INSERT INTO dbo.SourceSystems (SystemName,SystemType,Vendor,HERMDomain,LastSyncUTC,SyncStatus,RecordCount,Notes) VALUES
('Ellucian Banner',   'SIS',        'Ellucian',    'Student Management',    DATEADD(MINUTE,-6, GETUTCDATE()),  'OK',   4847, 'HEDM v6 API · Student, Enrollment, Courses'),
('Workday HCM',       'HR',         'Workday',     'Human Resources',       DATEADD(MINUTE,-14,GETUTCDATE()),  'OK',    482, 'REST API · Staff, Positions, Payroll'),
('Brightspace LMS',   'LMS',        'D2L',         'Learning Management',   DATEADD(HOUR,-1,  GETUTCDATE()),   'OK',   4612, '1EdTech/IMS · Courses, Grades, Engagement'),
('Salesforce CRM',    'CRM',        'Salesforce',  'Enrollment Management', DATEADD(HOUR,-4,  GETUTCDATE()),   'WARN', 1203, 'REST API · Prospects, Leads, Campaigns'),
('Raiser''s Edge NXT','Foundation', 'Blackbaud',   'Advancement',           DATEADD(HOUR,-4,  GETUTCDATE()),   'WARN',  847, 'SKY API · Donors, Pledges, Gifts'),
('ServiceNow',        'ITSM',       'ServiceNow',  'IT Service Management', DATEADD(MINUTE,-8, GETUTCDATE()),  'OK',    312, 'REST API · Tickets, Assets, Licenses'),
('ODS Curriculum',    'Academic',   'Internal',    'Academic Planning',     DATEADD(HOUR,-2,  GETUTCDATE()),   'OK',     47, 'Internal · Programs, Courses, Sections'),
('LicenseControl',    'Internal',   'BuiltInDays', 'IT Operations',         DATEADD(MINUTE,-30,GETUTCDATE()),  'OK',    171, 'SIGNAL Internal · Software License Intelligence'),
('ToolLibrary',       'Internal',   'BuiltInDays', 'Workforce Development', DATEADD(MINUTE,-45,GETUTCDATE()),  'OK',    160, 'SIGNAL Internal · Tool Checkout Tracking'),
('VOLT',              'Internal',   'BuiltInDays', 'Student Success',       DATEADD(HOUR,-1,  GETUTCDATE()),   'OK',    284, 'SIGNAL Internal · AI Apprentice Mentor'),
('IPEDS',             'Reporting',  'US Dept Ed',  'Compliance',            DATEADD(DAY,-1,   GETUTCDATE()),   'OK',      0, 'CEDS Aligned · Federal Reporting');
GO

-- ============================================================
-- DOMAIN 1: STUDENTS
-- CEDS: Person, StudentAcademic, StudentEnrollment
-- HEDM: persons, student-academic-credentials
-- ============================================================
CREATE TABLE dbo.Person (
    PersonID            INT IDENTITY PRIMARY KEY,
    BannerID            NVARCHAR(20) NOT NULL,      -- HEDM: credentials.credentialId
    CEDSPersonID        NVARCHAR(36),               -- CEDS: Person.PersonIdentifier
    FirstName           NVARCHAR(50),
    LastName            NVARCHAR(50),
    Email               NVARCHAR(100),
    PersonType          NVARCHAR(20),               -- Student, Staff, Faculty, Admin
    SourceSystem        NVARCHAR(30) DEFAULT 'Ellucian Banner',
    CreatedUTC          DATETIME DEFAULT GETUTCDATE()
);

CREATE TABLE dbo.StudentAcademic (
    StudentAcademicID   INT IDENTITY PRIMARY KEY,
    PersonID            INT NOT NULL REFERENCES dbo.Person(PersonID),
    Program             NVARCHAR(100),              -- CEDS: Program.ProgramName
    EnrollmentStatus    NVARCHAR(20),               -- CEDS: EnrollmentStatus
    EnrollmentType      NVARCHAR(20),               -- Full-Time, Part-Time
    GPA                 DECIMAL(4,2),               -- CEDS: GradePointAverage
    CreditHoursAttempted INT,
    CreditHoursEarned   INT,
    AbsenceCount        INT DEFAULT 0,
    FinancialHold       BIT DEFAULT 0,
    AdvisorAssigned     BIT DEFAULT 1,
    AtRiskScore         INT DEFAULT 0,              -- 0-100, SIGNAL calculated
    AtRiskFlag          BIT DEFAULT 0,              -- SIGNAL generated
    AtRiskReason        NVARCHAR(200),
    Term                NVARCHAR(20),
    SourceSystem        NVARCHAR(30) DEFAULT 'Ellucian Banner'
);

-- Insert sample persons
INSERT INTO dbo.Person (BannerID,FirstName,LastName,Email,PersonType) VALUES
('LCC-2001','Maria',   'Gonzalez', 'mgonzalez@luminara.edu', 'Student'),
('LCC-2002','James',   'Williams', 'jwilliams@luminara.edu', 'Student'),
('LCC-2003','Ashley',  'Thompson', 'athompson@luminara.edu', 'Student'),
('LCC-2004','Carlos',  'Martinez', 'cmartinez@luminara.edu', 'Student'),
('LCC-2005','Taylor',  'Johnson',  'tjohnson@luminara.edu',  'Student'),
('LCC-2006','Jordan',  'Davis',    'jdavis@luminara.edu',    'Student'),
('LCC-2007','Morgan',  'Wilson',   'mwilson@luminara.edu',   'Student'),
('LCC-2008','Riley',   'Anderson', 'randerson@luminara.edu', 'Student'),
('LCC-2009','Avery',   'Jackson',  'ajackson@luminara.edu',  'Student'),
('LCC-2010','Quinn',   'White',    'qwhite@luminara.edu',    'Student'),
('LCC-S001','Dr. Sarah','Mitchell','smitchell@luminara.edu', 'Faculty'),
('LCC-S002','Prof. James','Carter','jcarter@luminara.edu',   'Faculty'),
('LCC-S003','Maria',   'Lopez',    'mlopez@luminara.edu',    'Staff'),
('LCC-S004','Dr. Robert','Kim',    'rkim@luminara.edu',      'Admin'),
('LCC-S005','Angela',  'Torres',   'atorres@luminara.edu',   'Staff');
GO

INSERT INTO dbo.StudentAcademic (PersonID,Program,EnrollmentStatus,EnrollmentType,GPA,CreditHoursAttempted,CreditHoursEarned,AbsenceCount,FinancialHold,AtRiskScore,AtRiskFlag,AtRiskReason,Term) VALUES
(1, 'Nursing',             'Full-Time', 'Full-Time', 3.8, 15, 15, 0, 0,  5, 0, NULL,                                    'Spring 2026'),
(2, 'Cybersecurity',       'Full-Time', 'Full-Time', 3.2, 12, 12, 1, 0, 12, 0, NULL,                                    'Spring 2026'),
(3, 'Nursing',             'Part-Time', 'Part-Time', 1.7,  6,  4, 4, 1, 87, 1, 'GPA below 2.0, absences, financial hold','Spring 2026'),
(4, 'Welding Technology',  'Full-Time', 'Full-Time', 2.9, 15, 15, 0, 0, 18, 0, NULL,                                    'Spring 2026'),
(5, 'Liberal Arts',        'Full-Time', 'Full-Time', 1.4,  9,  6, 5, 0, 91, 1, 'GPA 1.4, 5 absences, academic warning', 'Spring 2026'),
(6, 'Medical Assisting',   'Full-Time', 'Full-Time', 3.5, 15, 15, 0, 0,  8, 0, NULL,                                    'Spring 2026'),
(7, 'Criminal Justice',    'Part-Time', 'Part-Time', 1.8,  6,  4, 3, 1, 79, 1, 'GPA 1.8, financial hold',               'Spring 2026'),
(8, 'Business Admin',      'Full-Time', 'Full-Time', 2.1, 12, 11, 2, 0, 34, 0, NULL,                                    'Spring 2026'),
(9, 'HVAC Technology',     'Full-Time', 'Full-Time', 3.1, 15, 15, 0, 0, 11, 0, NULL,                                    'Spring 2026'),
(10,'Nursing',             'Full-Time', 'Full-Time', 1.6,  9,  6, 4, 0, 83, 1, 'GPA 1.6, 4 absences',                   'Spring 2026');
GO

-- ============================================================
-- DOMAIN 2: ENROLLMENT & PROGRAMS
-- CEDS: CourseSection, ProgramParticipation
-- HEDM: sections, course-offerings
-- ============================================================
CREATE TABLE dbo.ProgramEnrollment (
    ProgramID           INT IDENTITY PRIMARY KEY,
    ProgramName         NVARCHAR(100),              -- CEDS: Program.ProgramName
    ProgramType         NVARCHAR(50),               -- Certificate, AAS, AA, AS
    Division            NVARCHAR(50),
    Term                NVARCHAR(20),
    Enrolled            INT DEFAULT 0,
    Capacity            INT DEFAULT 0,
    FillRatePct         AS CAST(Enrolled * 100.0 / NULLIF(Capacity,0) AS DECIMAL(5,1)),
    YOYChangePct        DECIMAL(5,1) DEFAULT 0,
    InstructorVacancies INT DEFAULT 0,
    Waitlisted          INT DEFAULT 0,
    IPEDSCode           NVARCHAR(10),               -- CEDS: IPEDS CIP Code
    Status              NVARCHAR(10) DEFAULT 'OK',  -- OK, WARN, RISK
    SourceSystem        NVARCHAR(30) DEFAULT 'Ellucian Banner'
);

INSERT INTO dbo.ProgramEnrollment (ProgramName,ProgramType,Division,Term,Enrolled,Capacity,YOYChangePct,InstructorVacancies,Waitlisted,IPEDSCode,Status) VALUES
('Cybersecurity',        'AAS', 'Information Technology', 'Spring 2026', 312, 350,  31.0, 0,  0, '11.1003', 'OK'),
('Medical Assisting',    'AAS', 'Health Sciences',        'Spring 2026', 198, 200,  12.0, 0, 12, '51.0710', 'OK'),
('Welding Technology',   'AAS', 'Workforce Development',  'Spring 2026', 145, 160,   8.0, 0,  8, '48.0508', 'OK'),
('Business Admin',       'AAS', 'Business',               'Spring 2026', 420, 500,   0.0, 0,  0, '52.0101', 'OK'),
('HVAC Technology',      'AAS', 'Workforce Development',  'Spring 2026',  89, 100,   3.0, 0,  5, '47.0201', 'OK'),
('Liberal Arts',         'AA',  'General Education',      'Spring 2026', 890,1000,  -4.0, 0,  0, '24.0101', 'WARN'),
('Criminal Justice',     'AAS', 'Public Safety',          'Spring 2026', 178, 220,  -9.0, 1,  0, '43.0107', 'WARN'),
('Nursing',              'AAS', 'Health Sciences',        'Spring 2026', 203, 280, -14.0, 3, 47, '51.3801', 'RISK'),
('Early Childhood Ed',   'AAS', 'Education',              'Spring 2026', 134, 150,  -2.0, 0,  3, '13.1210', 'OK'),
('Computer Science',     'AAS', 'Information Technology', 'Spring 2026', 267, 300,   7.0, 0, 14, '11.0701', 'OK');
GO

-- ============================================================
-- DOMAIN 3: STAFF & HR
-- CEDS: Staff, PositionTitle, Employment
-- HEDM: persons (staff type), employment-classifications
-- Workday HCM source
-- ============================================================
CREATE TABLE dbo.StaffPosition (
    PositionID          INT IDENTITY PRIMARY KEY,
    PersonID            INT REFERENCES dbo.Person(PersonID),
    WorkdayPositionID   NVARCHAR(20),
    Title               NVARCHAR(100),              -- CEDS: PositionTitle
    Department          NVARCHAR(100),
    StaffType           NVARCHAR(20),               -- Faculty, Staff, Admin
    EmploymentStatus    NVARCHAR(20),               -- Active, Vacant, On Leave
    HireDate            DATE,
    VacancyOpenDate     DATE,
    VacancyDays         AS CASE WHEN EmploymentStatus='Vacant' THEN DATEDIFF(DAY, VacancyOpenDate, GETDATE()) ELSE 0 END,
    CriticalVacancy     BIT DEFAULT 0,
    FTEValue            DECIMAL(4,2) DEFAULT 1.0,   -- CEDS: PositionFTE
    AnnualSalary        DECIMAL(18,2),
    SourceSystem        NVARCHAR(30) DEFAULT 'Workday HCM'
);

INSERT INTO dbo.StaffPosition (PersonID,WorkdayPositionID,Title,Department,StaffType,EmploymentStatus,HireDate,VacancyOpenDate,CriticalVacancy,AnnualSalary) VALUES
(11, 'WD-F001', 'Nursing Program Director',    'Health Sciences',        'Faculty', 'Active',  '2018-08-01', NULL,         0, 94000),
(12, 'WD-F002', 'Cybersecurity Lead Instructor','Information Technology', 'Faculty', 'Active',  '2020-01-15', NULL,         0, 82000),
(NULL,'WD-F003','Clinical Instructor - Nursing','Health Sciences',        'Faculty', 'Vacant',  NULL,         '2026-02-20', 1, 78000),
(NULL,'WD-F004','Clinical Instructor - Nursing','Health Sciences',        'Faculty', 'Vacant',  NULL,         '2026-02-07', 1, 78000),
(NULL,'WD-S001','Systems Administrator',        'Information Technology', 'Staff',   'Vacant',  NULL,         '2026-03-08', 1, 68000),
(NULL,'WD-F005','Welding Instructor',           'Workforce Development',  'Faculty', 'Vacant',  NULL,         '2026-03-11', 1, 72000),
(13, 'WD-S002', 'Financial Aid Director',       'Student Services',       'Staff',   'Active',  '2015-03-01', NULL,         0, 88000),
(NULL,'WD-F006','Criminal Justice Instructor',  'Public Safety',          'Faculty', 'Vacant',  NULL,         '2026-03-20', 0, 70000),
(14, 'WD-A001', 'VP Academic Affairs',          'Academic Affairs',       'Admin',   'Active',  '2012-06-01', NULL,         0,142000),
(15, 'WD-S003', 'Student Success Advisor',      'Student Services',       'Staff',   'Active',  '2021-09-01', NULL,         0, 54000);
GO

-- ============================================================
-- DOMAIN 4: FINANCE & BUDGET
-- CEDS: FinancialAccount, OrganizationFinancialTransaction
-- Workday Finance source
-- ============================================================
CREATE TABLE dbo.BudgetLedger (
    BudgetID            INT IDENTITY PRIMARY KEY,
    FiscalYear          NVARCHAR(10) DEFAULT 'FY26',
    Department          NVARCHAR(100),
    FundType            NVARCHAR(30),               -- Operating, Grant, Capital
    BudgetAmount        DECIMAL(18,2),
    Encumbered          DECIMAL(18,2) DEFAULT 0,
    Expended            DECIMAL(18,2) DEFAULT 0,
    Available           AS BudgetAmount - Encumbered - Expended,
    UtilizationPct      AS CAST((Encumbered + Expended) * 100.0 / NULLIF(BudgetAmount,0) AS DECIMAL(5,1)),
    AlertStatus         AS CASE
        WHEN (Encumbered + Expended) / NULLIF(BudgetAmount,0) > 0.90 THEN 'CRITICAL'
        WHEN (Encumbered + Expended) / NULLIF(BudgetAmount,0) > 0.75 THEN 'WARNING'
        ELSE 'OK' END,
    SourceSystem        NVARCHAR(30) DEFAULT 'Workday HCM'
);

INSERT INTO dbo.BudgetLedger (Department,FundType,BudgetAmount,Encumbered,Expended) VALUES
('Academic Affairs',     'Operating', 8400000, 420000, 3612000),
('Student Services',     'Operating', 2100000,  94000,  882000),
('Information Technology','Operating',3200000, 288000, 1824000),
('Facilities',           'Operating', 4100000, 246000, 1640000),
('Human Resources',      'Operating',  980000,  44000,  392000),
('Marketing/Enrollment', 'Operating',  640000,  64000,  384000),
('Foundation/Grants',    'Grant',     2800000, 112000,  896000),
('Workforce Development','Operating', 1600000,  80000,  544000),
('Administration',       'Operating', 4580000, 320000, 2290000),
('Capital Projects',     'Capital',   1200000, 800000,  240000);
GO

-- ============================================================
-- DOMAIN 5: ADVANCEMENT & DONORS
-- CEDS: OrganizationFinancialTransaction (gift mapping)
-- Raiser's Edge NXT / SKY API source
-- ============================================================
CREATE TABLE dbo.DonorPipeline (
    DonorID             INT IDENTITY PRIMARY KEY,
    RE7ConstituentID    NVARCHAR(20),               -- RE7 Constituent ID
    DonorName           NVARCHAR(100),
    DonorType           NVARCHAR(30),               -- Individual, Foundation, Corporate
    Stage               NVARCHAR(30),               -- Prospect, Cultivation, Warm, Pledged, Closed
    AskAmount           DECIMAL(18,2) DEFAULT 0,
    PledgeAmount        DECIMAL(18,2) DEFAULT 0,
    GiftYTD             DECIMAL(18,2) DEFAULT 0,
    LastContactDate     DATE,
    DaysSinceContact    AS DATEDIFF(DAY, LastContactDate, GETDATE()),
    NextAction          NVARCHAR(200),
    AssignedTo          NVARCHAR(100),
    Priority            NVARCHAR(10) DEFAULT 'MED', -- HIGH, MED, LOW
    FundDesignation     NVARCHAR(100),
    SourceSystem        NVARCHAR(30) DEFAULT 'Raiser''s Edge NXT'
);

INSERT INTO dbo.DonorPipeline (RE7ConstituentID,DonorName,DonorType,Stage,AskAmount,PledgeAmount,GiftYTD,LastContactDate,NextAction,AssignedTo,Priority,FundDesignation) VALUES
('RE-001','Martha & David Chen',      'Individual',  'Warm',       200000, 150000,  50000, '2026-03-17', 'Call this week — nursing scholarship', 'Chancellor',     'HIGH', 'Nursing Scholarship Fund'),
('RE-002','Luminara Education Trust', 'Foundation',  'Pledged',         0, 250000,      0, '2026-04-01', 'Pledge paperwork in progress',         'Foundation Dir', 'HIGH', 'General Endowment'),
('RE-003','Robert Westfield',         'Individual',  'Warm',       100000,  75000,  25000, '2026-03-28', 'Site visit scheduled April 15',        'VP Advancement', 'HIGH', 'Workforce Development'),
('RE-004','Sunrise Family Fund',      'Foundation',  'Prospect',    50000,      0,      0, '2026-02-14', 'Overdue — follow up immediately',      'Foundation Dir', 'MED',  'Student Emergency Fund'),
('RE-005','Tech Industry Partners',   'Corporate',   'Pledged',         0, 200000,      0, '2026-04-05', 'Contract review pending legal',        'Chancellor',     'HIGH', 'Cybersecurity Lab'),
('RE-006','Anonymous Donor',          'Individual',  'Pledged',         0, 172000,      0, '2026-04-06', 'Gift processing this week',            'Foundation Dir', 'HIGH', 'General Scholarship'),
('RE-007','Maria Sandoval Estate',    'Individual',  'Prospect',    30000,      0,      0, '2026-01-20', 'Research estate capacity',             'VP Advancement', 'LOW',  'TBD'),
('RE-008','Lakeview Business Assoc',  'Corporate',   'Warm',        25000,      0,      0, '2026-03-10', 'Meeting requested — pending confirm',   'Foundation Dir', 'MED',  'Welding Program');
GO

-- ============================================================
-- DOMAIN 6: SOFTWARE LICENSES
-- No CEDS standard — SIGNAL proprietary
-- ServiceNow CMDB / LicenseControl source
-- ============================================================
CREATE TABLE dbo.SoftwareLicense (
    LicenseID           INT IDENTITY PRIMARY KEY,
    SoftwareName        NVARCHAR(100) NOT NULL,
    Vendor              NVARCHAR(100),
    Category            NVARCHAR(50),               -- ERP, LMS, Security, Communication, Database
    ITSContact          NVARCHAR(100),
    FunctionalOwner     NVARCHAR(100),
    FY26Budget          DECIMAL(18,2) DEFAULT 0,
    FY26Actual          DECIMAL(18,2) DEFAULT 0,
    FY27Forecast        DECIMAL(18,2) DEFAULT 0,
    Seats               INT,
    ContractStart       DATE,
    ContractEnd         DATE,
    DaysUntilExpiry     AS DATEDIFF(DAY, GETDATE(), ContractEnd),
    AlertStatus         AS CASE
        WHEN ContractEnd IS NULL THEN 'NO DATE'
        WHEN DATEDIFF(DAY,GETDATE(),ContractEnd) < 0   THEN 'EXPIRED'
        WHEN DATEDIFF(DAY,GETDATE(),ContractEnd) <= 30  THEN 'WARNING'
        WHEN DATEDIFF(DAY,GETDATE(),ContractEnd) <= 90  THEN 'NOTICE'
        ELSE 'CURRENT' END,
    AutoRenew           BIT DEFAULT 0,
    PONumber            NVARCHAR(50),
    SourceSystem        NVARCHAR(30) DEFAULT 'ServiceNow'
);

INSERT INTO dbo.SoftwareLicense (SoftwareName,Vendor,Category,ITSContact,FunctionalOwner,FY26Budget,FY26Actual,FY27Forecast,Seats,ContractStart,ContractEnd,AutoRenew) VALUES
('Ellucian Banner',       'Ellucian',    'ERP',           'CIO',            'VP Academic',   185000, 185000, 192000, NULL, '2025-01-01','2026-12-31',1),
('Workday HCM',           'Workday',     'ERP',           'HR Director',    'HR Director',   124000, 124000, 128000, NULL, '2025-01-01','2026-11-30',1),
('Brightspace LMS',       'D2L',         'LMS',           'VP Academic',    'VP Academic',    48000,  48000,  50000, NULL, '2025-08-01','2026-08-31',1),
('Salesforce CRM',        'Salesforce',  'CRM',           'Enrollment Dir', 'Enrollment Dir', 36000,  36000,  38000, NULL, '2025-07-01','2026-06-30',0),
('WEBex Contact Center',  'Cisco',       'Communication', 'IT Director',    'IT Director',   188277, 188277, 195000, NULL, '2024-01-24','2026-06-20',0),
('Microsoft ELA',         'Microsoft',   'Productivity',  'CIO',            'CIO',                0,      0,  85000, NULL, '2025-07-01','2026-06-30',1),
('Infoblox',              'Infoblox',    'Network',       'Network Admin',  'IT Director',    41577,  41577,  43000, NULL, '2024-01-22','2026-04-22',0),
('Zoom Education',        'Zoom',        'Communication', 'IT Director',    'VP Academic',    18400,  18400,  19000,  500, '2025-09-15','2026-09-15',1),
('Adobe Creative Cloud',  'Adobe',       'Productivity',  'Marketing Dir',  'Marketing Dir',  12800,  12800,  13500,   25, '2025-07-01','2026-07-01',1),
('CrowdStrike AV',        'CrowdStrike', 'Security',      'Security Admin', 'IT Director',    22400,  22400,  24000, NULL, '2025-10-31','2026-10-31',1),
('Oracle Database',       'Oracle',      'Database',      'DBA',            'IT Director',        0,      0,      0, NULL, '2024-01-01','2025-12-31',0),
('Raiser''s Edge NXT',    'Blackbaud',   'Foundation',    'Foundation Dir', 'Foundation Dir', 34200,  34200,  36000, NULL, '2025-01-01','2026-12-31',1);
GO

-- ============================================================
-- DOMAIN 7: CURRICULUM
-- CEDS: Course, CourseSection, ProgramCourse
-- ODS Academic source
-- ============================================================
CREATE TABLE dbo.CourseSection (
    SectionID           INT IDENTITY PRIMARY KEY,
    CourseCode          NVARCHAR(20),               -- CEDS: CourseCode
    CourseName          NVARCHAR(100),              -- CEDS: CourseName
    ProgramName         NVARCHAR(100),
    CreditHours         INT,                        -- CEDS: CourseCreditUnits
    Term                NVARCHAR(20),
    SectionNumber       NVARCHAR(10),
    Capacity            INT,
    Enrolled            INT,
    FillRatePct         AS CAST(Enrolled * 100.0 / NULLIF(Capacity,0) AS DECIMAL(5,1)),
    InstructorPersonID  INT REFERENCES dbo.Person(PersonID),
    InstructorAssigned  BIT DEFAULT 1,
    DeliveryMode        NVARCHAR(20),               -- Online, In-Person, Hybrid
    Location            NVARCHAR(50),
    IPEDSCIPCode        NVARCHAR(10),
    SourceSystem        NVARCHAR(30) DEFAULT 'ODS Curriculum'
);

INSERT INTO dbo.CourseSection (CourseCode,CourseName,ProgramName,CreditHours,Term,SectionNumber,Capacity,Enrolled,InstructorPersonID,InstructorAssigned,DeliveryMode,IPEDSCIPCode) VALUES
('CYB-101','Intro to Cybersecurity',        'Cybersecurity',      3,'Spring 2026','001',30,29,12,1,'Online',   '11.1003'),
('CYB-101','Intro to Cybersecurity',        'Cybersecurity',      3,'Spring 2026','002',30,30,12,1,'Online',   '11.1003'),
('CYB-201','Network Security',              'Cybersecurity',      3,'Spring 2026','001',30,29,12,1,'Hybrid',   '11.1003'),
('NUR-101','Fundamentals of Nursing',       'Nursing',            4,'Spring 2026','001',30,26,11,1,'In-Person','51.3801'),
('NUR-101','Fundamentals of Nursing',       'Nursing',            4,'Spring 2026','002',30,24,NULL,0,'In-Person','51.3801'),
('NUR-201','Clinical Practice I',           'Nursing',            4,'Spring 2026','001',30,20,NULL,0,'In-Person','51.3801'),
('WLD-101','Welding Fundamentals',          'Welding Technology', 3,'Spring 2026','001',20,19,NULL,1,'In-Person','48.0508'),
('BUS-101','Business Communications',       'Business Admin',     3,'Spring 2026','001',30,29,NULL,1,'Online',   '52.0101'),
('MED-101','Medical Terminology',           'Medical Assisting',  3,'Spring 2026','001',30,29,NULL,1,'Online',   '51.0710'),
('HVAC-101','HVAC Fundamentals',            'HVAC Technology',    3,'Spring 2026','001',25,24,NULL,1,'In-Person','47.0201'),
('ENG-101','English Composition',           'Liberal Arts',       3,'Spring 2026','001',30,28,NULL,1,'Online',   '24.0101');
GO

-- ============================================================
-- DOMAIN 8: TOOL LIBRARY
-- SIGNAL Proprietary — No CEDS equivalent
-- Maps to HERM: Workforce Development Domain
-- ============================================================
CREATE TABLE dbo.ToolInventory (
    ToolID              INT IDENTITY PRIMARY KEY,
    ToolCode            NVARCHAR(20) NOT NULL,
    ToolName            NVARCHAR(100),
    Category            NVARCHAR(50),
    Program             NVARCHAR(50),
    Manufacturer        NVARCHAR(50),
    ModelNumber         NVARCHAR(50),
    Condition           NVARCHAR(20) DEFAULT 'Good', -- Good, Fair, Poor, Retired
    Status              NVARCHAR(10) DEFAULT 'In',   -- In, Out, Overdue, Maintenance
    CheckedOutToPersonID INT REFERENCES dbo.Person(PersonID),
    CheckoutDate        DATE,
    DueDate             DATE,
    DaysOut             AS CASE WHEN Status IN ('Out','Overdue') THEN DATEDIFF(DAY, CheckoutDate, GETDATE()) ELSE 0 END,
    OverdueDays         AS CASE WHEN Status='Overdue' THEN DATEDIFF(DAY, DueDate, GETDATE()) ELSE 0 END,
    SourceSystem        NVARCHAR(30) DEFAULT 'ToolLibrary'
);

INSERT INTO dbo.ToolInventory (ToolCode,ToolName,Category,Program,Manufacturer,Condition,Status,CheckedOutToPersonID,CheckoutDate,DueDate) VALUES
('WLD-001','Lincoln Electric Welder 180',  'Welding Equipment','Welding','Lincoln Electric','Good',    'In',    NULL, NULL,         NULL),
('WLD-002','Miller MIG Welder 211',        'Welding Equipment','Welding','Miller',          'Good',    'Out',   4,    '2026-04-06', '2026-04-13'),
('WLD-003','Angle Grinder Set 4.5"',       'Welding Equipment','Welding','DeWalt',          'Fair',    'Overdue',7,  '2026-03-31', '2026-04-07'),
('HVAC-001','Manifold Gauge Set Digital',  'HVAC Equipment',   'HVAC',  'Yellow Jacket',   'Good',    'In',    NULL, NULL,         NULL),
('HVAC-002','Refrigerant Recovery Unit',   'HVAC Equipment',   'HVAC',  'Robinair',        'Good',    'Out',   6,    '2026-04-05', '2026-04-12'),
('IT-001', 'Network Protocol Analyzer',    'IT Equipment',     'IT',    'Fluke',           'Good',    'In',    NULL, NULL,         NULL),
('IT-002', 'Cisco Lab Kit Complete',       'IT Equipment',     'IT',    'Cisco',           'Good',    'Out',   2,    '2026-04-01', '2026-04-08'),
('MED-001','Clinical Simulation Mannequin','Medical Equipment','Medical','Laerdal',        'Good',    'In',    NULL, NULL,         NULL),
('MED-002','Vital Signs Monitor',          'Medical Equipment','Medical','Welch Allyn',    'Good',    'In',    NULL, NULL,         NULL),
('WLD-004','Welding Helmet Auto-Darkening','Safety Equipment', 'Welding','Lincoln Electric','Good',   'In',    NULL, NULL,         NULL);
GO

-- ============================================================
-- DOMAIN 9: VOLT AI MENTOR SESSIONS
-- SIGNAL Proprietary
-- Maps to HERM: Student Success, Workforce Development
-- ============================================================
CREATE TABLE dbo.VOLTSession (
    SessionID           INT IDENTITY PRIMARY KEY,
    SessionDateUTC      DATETIME DEFAULT GETUTCDATE(),
    PersonID            INT REFERENCES dbo.Person(PersonID),
    Program             NVARCHAR(50),
    TopicArea           NVARCHAR(100),
    SubTopic            NVARCHAR(100),
    DurationMinutes     INT,
    CompletionScore     INT,                        -- 0-100
    MasteryAchieved     BIT DEFAULT 0,
    Outcome             NVARCHAR(200),
    AIModel             NVARCHAR(50) DEFAULT 'Claude',
    DeliveryMode        NVARCHAR(20) DEFAULT 'Voice', -- Voice, Text, Hybrid
    SourceSystem        NVARCHAR(30) DEFAULT 'VOLT'
);

INSERT INTO dbo.VOLTSession (SessionDateUTC,PersonID,Program,TopicArea,SubTopic,DurationMinutes,CompletionScore,MasteryAchieved,Outcome,DeliveryMode) VALUES
(DATEADD(HOUR,-2, GETUTCDATE()), 4, 'Welding',  'Arc Welding Safety',       'PPE Requirements',        22, 94, 1, 'Passed safety module — cleared for lab',    'Voice'),
(DATEADD(HOUR,-3, GETUTCDATE()), 9, 'HVAC',     'Refrigerant Handling',     'EPA 608 Prep',            18, 88, 1, 'Completed certification prep module',       'Voice'),
(DATEADD(HOUR,-4, GETUTCDATE()), 2, 'IT',       'Network Fundamentals',     'Subnetting',              31, 76, 0, 'Needs review — subnetting concepts weak',   'Hybrid'),
(DATEADD(HOUR,-5, GETUTCDATE()), 8, 'Welding',  'MIG Welding Technique',    'Wire Speed Settings',     25, 91, 1, 'Ready for lab assessment',                  'Voice'),
(DATEADD(DAY,-1,  GETUTCDATE()), 9, 'HVAC',     'Electrical Systems',       'Series vs Parallel',      20, 83, 1, 'Passed module with distinction',            'Voice'),
(DATEADD(DAY,-1,  GETUTCDATE()), 7, 'Welding',  'Blueprint Reading',        'Weld Symbols',            15, 62, 0, 'Struggling — advisor flagged for support',  'Text'),
(DATEADD(DAY,-2,  GETUTCDATE()), 2, 'IT',       'Linux Administration',     'File Permissions',        28, 71, 0, 'In progress — moderate understanding',      'Voice'),
(DATEADD(DAY,-2,  GETUTCDATE()), 6, 'Medical',  'Medical Terminology',      'Anatomy Prefixes',        19, 97, 1, 'Excellent — top performer this week',       'Voice'),
(DATEADD(DAY,-3,  GETUTCDATE()), 4, 'Welding',  'Metallurgy Basics',        'Steel Properties',        24, 85, 1, 'Strong conceptual understanding',           'Voice'),
(DATEADD(DAY,-3,  GETUTCDATE()), 9, 'HVAC',     'Load Calculations',        'Manual J Basics',         33, 79, 0, 'Needs one more session before assessment',  'Hybrid');
GO

-- ============================================================
-- DOMAIN 10: SERVICE INTAKE
-- Maps to ServiceNow ITSM
-- HERM: IT Service Management Domain
-- ============================================================
CREATE TABLE dbo.ServiceRequest (
    RequestID           INT IDENTITY PRIMARY KEY,
    TicketNumber        NVARCHAR(20) NOT NULL,
    CreatedDateUTC      DATETIME DEFAULT GETUTCDATE(),
    Category            NVARCHAR(50),               -- Software, Hardware, Access, Database, Network
    Priority            NVARCHAR(10),               -- CRITICAL, HIGH, MED, LOW
    Status              NVARCHAR(20),               -- Open, In Progress, Resolved, Closed
    RequestedByPersonID INT REFERENCES dbo.Person(PersonID),
    AssignedTo          NVARCHAR(100),
    Subject             NVARCHAR(200),
    Description         NVARCHAR(500),
    DaysOpen            AS DATEDIFF(DAY, CreatedDateUTC, GETDATE()),
    SLABreached         BIT DEFAULT 0,
    SourceSystem        NVARCHAR(30) DEFAULT 'ServiceNow'
);

INSERT INTO dbo.ServiceRequest (TicketNumber,CreatedDateUTC,Category,Priority,Status,AssignedTo,Subject,SLABreached) VALUES
('LCC-4421',DATEADD(DAY,-1, GETDATE()),'Software',  'HIGH',     'Open',        'DBA Team',     'License renewal PO needed — Infoblox expires April 22',0),
('LCC-4418',DATEADD(DAY,-2, GETDATE()),'Access',    'MED',      'In Progress', 'IT Help Desk', 'New hire onboarding — Workday access request',         0),
('LCC-4415',DATEADD(DAY,-3, GETDATE()),'Hardware',  'LOW',      'Open',        'Facilities',   'Projector replacement needed — Welding Lab 3',         0),
('LCC-4410',DATEADD(DAY,-5, GETDATE()),'Software',  'HIGH',     'Open',        'DBA Team',     'Raiser''s Edge sync failure — foundation data stale',  1),
('LCC-4405',DATEADD(DAY,-7, GETDATE()),'Network',   'MED',      'Resolved',    'Network Team', 'WiFi dead zones in Nursing building — resolved',        0),
('LCC-4398',DATEADD(DAY,-8, GETDATE()),'Database',  'HIGH',     'Resolved',    'DBA Team',     'Banner slow query during registration peak — fixed',    0),
('LCC-4391',DATEADD(DAY,-12,GETDATE()),'Software',  'MED',      'Open',        'IT Help Desk', 'Adobe CC — need 4 additional seats for Marketing',      1),
('LCC-4388',DATEADD(DAY,-14,GETDATE()),'Access',    'CRITICAL', 'Resolved',    'Security Team','Unauthorized access attempt — Banner admin portal',     0),
('LCC-4380',DATEADD(DAY,-18,GETDATE()),'Database',  'MED',      'In Progress', 'DBA Team',     'Data warehouse refresh — adding enrollment analytics',  0),
('LCC-4372',DATEADD(DAY,-21,GETDATE()),'Hardware',  'LOW',      'Open',        'Facilities',   'Ergonomic workstation request — Financial Aid office',  1);
GO

-- ============================================================
-- DOMAIN 11: SIGNAL INTELLIGENCE LOG
-- SIGNAL Proprietary — Daily automated signal output
-- ============================================================
CREATE TABLE dbo.SignalLog (
    LogID               INT IDENTITY PRIMARY KEY,
    LogDateUTC          DATETIME DEFAULT GETUTCDATE(),
    Domain              NVARCHAR(30),               -- Enrollment, StudentSuccess, HR, Finance, etc
    Severity            NVARCHAR(10),               -- CRITICAL, WARNING, INFO, OK
    SignalText          NVARCHAR(500),
    DataSource          NVARCHAR(50),
    RecommendedAction   NVARCHAR(200),
    Acknowledged        BIT DEFAULT 0,
    AcknowledgedBy      NVARCHAR(100),
    AcknowledgedDate    DATETIME
);

INSERT INTO dbo.SignalLog (LogDateUTC,Domain,Severity,SignalText,DataSource,RecommendedAction) VALUES
(DATEADD(MINUTE,-6, GETUTCDATE()), 'Enrollment',     'CRITICAL', 'Nursing enrollment down 14% — 47 waitlisted, 3 sections cancelled, 2 instructor vacancies open 50+ days', 'Ellucian Banner', 'Emergency hire or adjunct recruitment this week'),
(DATEADD(MINUTE,-8, GETUTCDATE()), 'StudentSuccess', 'CRITICAL', '127 students flagged at-risk — GPA, absences, or financial holds. Intervention window closing.',          'Brightspace + Banner','Advisor outreach within 48 hours'),
(DATEADD(HOUR,-1,   GETUTCDATE()), 'HR',             'WARNING',  '14 open positions — 4 critical programs (Nursing x2, IT x1, Welding x1). Avg vacancy: 47 days.',         'Workday HCM',         'Post positions + contact staffing agency'),
(DATEADD(HOUR,-2,   GETUTCDATE()), 'Licenses',       'WARNING',  'WEBex ($188K) expires June 20 — 73 days. No PO initiated. Infoblox ($42K) expires April 22 — 14 days.',  'ServiceNow',          'Start PO process immediately for both'),
(DATEADD(HOUR,-3,   GETUTCDATE()), 'Advancement',    'WARNING',  'Salesforce CRM sync 4hr delayed — 3 prospect follow-ups overdue. Martha Chen last contact 22 days ago.',  'Salesforce CRM',      'Manual sync + schedule Chen call this week'),
(DATEADD(HOUR,-4,   GETUTCDATE()), 'Finance',        'WARNING',  'IT budget 66% utilized in first half of FY26 — on pace to overspend by $180K without adjustment.',       'Workday Finance',     'Review IT discretionary spend this month'),
(DATEADD(HOUR,-5,   GETUTCDATE()), 'Enrollment',     'INFO',     'Cybersecurity enrollment up 31% YOY — highest growth program. Instructor at full capacity.',              'Ellucian Banner',     'Consider adding 1 section Spring + new hire for Fall'),
(DATEADD(HOUR,-6,   GETUTCDATE()), 'Advancement',    'INFO',     '$847K active donor pledges — Tech Industry Partners ($200K) contract in legal review.',                  'Raiser''s Edge',      'Follow up with legal on timeline'),
(DATEADD(HOUR,-8,   GETUTCDATE()), 'Licenses',       'CRITICAL', 'Oracle Database license expired Dec 31 2025 — currently running unlicensed. Legal risk.',                'ServiceNow',          'Immediate: determine if Oracle still in use'),
(DATEADD(DAY,-1,    GETUTCDATE()), 'StudentSuccess', 'INFO',     'VOLT AI Mentor: 10 sessions this week, 70% mastery rate. Morgan Wilson flagged for advisor support.',     'VOLT',                'Advisor follow-up for Wilson today');
GO

-- ============================================================
-- VIEWS — SIGNAL READS THESE
-- ============================================================

-- At-Risk Student Summary
CREATE VIEW dbo.vw_AtRiskStudents AS
SELECT
    p.FirstName + ' ' + p.LastName AS StudentName,
    p.BannerID,
    sa.Program,
    sa.EnrollmentType,
    sa.GPA,
    sa.AbsenceCount,
    sa.FinancialHold,
    sa.AtRiskScore,
    sa.AtRiskReason,
    sa.Term
FROM dbo.StudentAcademic sa
JOIN dbo.Person p ON sa.PersonID = p.PersonID
WHERE sa.AtRiskFlag = 1;
GO

-- Enrollment Health Summary
CREATE VIEW dbo.vw_EnrollmentHealth AS
SELECT
    ProgramName,
    Division,
    Term,
    Enrolled,
    Capacity,
    FillRatePct,
    YOYChangePct,
    InstructorVacancies,
    Waitlisted,
    Status,
    CASE
        WHEN YOYChangePct >= 10 THEN 'Growing'
        WHEN YOYChangePct >= 0  THEN 'Stable'
        WHEN YOYChangePct >= -5 THEN 'Declining'
        ELSE 'At Risk'
    END AS Trend
FROM dbo.ProgramEnrollment;
GO

-- KPI Summary for SIGNAL Portal
CREATE VIEW dbo.vw_SignalKPI AS
SELECT
    (SELECT COUNT(*) FROM dbo.StudentAcademic WHERE Term = 'Spring 2026') AS TotalEnrollment,
    (SELECT COUNT(*) FROM dbo.StudentAcademic WHERE AtRiskFlag = 1)        AS AtRiskCount,
    (SELECT COUNT(*) FROM dbo.StaffPosition WHERE EmploymentStatus = 'Vacant') AS VacancyCount,
    (SELECT COUNT(*) FROM dbo.StaffPosition WHERE EmploymentStatus = 'Vacant' AND CriticalVacancy = 1) AS CriticalVacancies,
    (SELECT ISNULL(SUM(PledgeAmount),0) FROM dbo.DonorPipeline WHERE Stage IN ('Warm','Pledged')) AS DonorPipeline,
    (SELECT COUNT(*) FROM dbo.SoftwareLicense WHERE AlertStatus IN ('EXPIRED','WARNING')) AS LicensesAtRisk,
    (SELECT ISNULL(SUM(FY26Budget),0) FROM dbo.SoftwareLicense WHERE AlertStatus IN ('EXPIRED','WARNING','NOTICE')) AS LicenseBudgetAtRisk,
    (SELECT COUNT(*) FROM dbo.SignalLog WHERE Severity = 'CRITICAL' AND Acknowledged = 0) AS CriticalSignals,
    (SELECT COUNT(*) FROM dbo.SignalLog WHERE Severity = 'WARNING' AND Acknowledged = 0)  AS WarningSignals,
    (SELECT COUNT(*) FROM dbo.SourceSystems WHERE SyncStatus = 'WARN') AS SystemsWithWarnings,
    GETDATE() AS GeneratedAt;
GO

PRINT '====================================================';
PRINT 'LUMINARA SIGNAL DATABASE — BUILD COMPLETE';
PRINT '====================================================';
PRINT 'CEDS Aligned: Person, StudentAcademic, CourseSection';
PRINT 'HEDM Aligned: persons, sections, course-offerings';
PRINT 'HERM Domains: Student, HR, Finance, IT, Advancement';
PRINT '----------------------------------------------------';
PRINT 'Tables created: 12';
PRINT 'Views created:  3';
PRINT 'Source systems: 11';
PRINT '----------------------------------------------------';
PRINT 'Domains covered:';
PRINT '  Students        — Ellucian Banner / CEDS';
PRINT '  Enrollment      — Ellucian Banner / HEDM';
PRINT '  Staff           — Workday HCM';
PRINT '  Finance         — Workday Finance';
PRINT '  Donors          — Raiser Edge NXT';
PRINT '  Licenses        — ServiceNow / LicenseControl';
PRINT '  Curriculum      — ODS / 1EdTech';
PRINT '  Tool Library    — SIGNAL Internal';
PRINT '  VOLT Mentor     — SIGNAL Internal';
PRINT '  Service Intake  — ServiceNow';
PRINT '  Signal Log      — SIGNAL Internal';
PRINT '====================================================';
PRINT 'Ready for Python portal connection.';
PRINT '====================================================';
GO

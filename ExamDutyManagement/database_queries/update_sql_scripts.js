const fs = require('fs');
const path = require('path');

const masterSql = fs.readFileSync(path.join(__dirname, 'master_cities_and_centers_insert.sql'), 'utf8');

// The exams, roles, and shifts section
const examsRolesShifts = `
-- 3. Insert Exams
IF NOT EXISTS (SELECT 1 FROM dbo.exams WHERE name = 'NEET')
    INSERT INTO dbo.exams (id, name, code, type) VALUES (NEWID(), 'NEET', 'NEET', 'Exam');
IF NOT EXISTS (SELECT 1 FROM dbo.exams WHERE name = 'JEE Main')
    INSERT INTO dbo.exams (id, name, code, type) VALUES (NEWID(), 'JEE Main', 'JEE', 'Exam');
IF NOT EXISTS (SELECT 1 FROM dbo.exams WHERE name = 'JEE Main 2026 Session 2')
    INSERT INTO dbo.exams (id, name, code, type) VALUES (NEWID(), 'JEE Main 2026 Session 2', 'JEE-M-S2', 'Exam');
IF NOT EXISTS (SELECT 1 FROM dbo.exams WHERE name = 'UGC NET')
    INSERT INTO dbo.exams (id, name, code, type) VALUES (NEWID(), 'UGC NET', 'NET', 'Exam');
IF NOT EXISTS (SELECT 1 FROM dbo.exams WHERE name = 'TCS')
    INSERT INTO dbo.exams (id, name, code, type) VALUES (NEWID(), 'TCS', 'TCS', 'Exam');
IF NOT EXISTS (SELECT 1 FROM dbo.exams WHERE name = 'IBPS PO Mains 2026')
    INSERT INTO dbo.exams (id, name, code, type) VALUES (NEWID(), 'IBPS PO Mains 2026', 'IBPS-PO-M', 'Exam');
IF NOT EXISTS (SELECT 1 FROM dbo.exams WHERE name = 'SSC CGL Tier 1 2026')
    INSERT INTO dbo.exams (id, name, code, type) VALUES (NEWID(), 'SSC CGL Tier 1 2026', 'SSC-CGL-26', 'Exam');
IF NOT EXISTS (SELECT 1 FROM dbo.exams WHERE name = 'RRB NTPC Phase 1')
    INSERT INTO dbo.exams (id, name, code, type) VALUES (NEWID(), 'RRB NTPC Phase 1', 'RRB-NTPC-01', 'Exam');
IF NOT EXISTS (SELECT 1 FROM dbo.exams WHERE name = 'UPSC NDA 2026')
    INSERT INTO dbo.exams (id, name, code, type) VALUES (NEWID(), 'UPSC NDA 2026', 'UPSC-NDA', 'Exam');
IF NOT EXISTS (SELECT 1 FROM dbo.exams WHERE name = 'AIIMS Mock')
    INSERT INTO dbo.exams (id, name, code, type) VALUES (NEWID(), 'AIIMS Mock', 'AIIMS', 'Mock');
IF NOT EXISTS (SELECT 1 FROM dbo.exams WHERE name = 'GATE Mock')
    INSERT INTO dbo.exams (id, name, code, type) VALUES (NEWID(), 'GATE Mock', 'GATE', 'Mock');
IF NOT EXISTS (SELECT 1 FROM dbo.exams WHERE name = 'Mock Drill 2026')
    INSERT INTO dbo.exams (id, name, code, type) VALUES (NEWID(), 'Mock Drill 2026', 'MOCK-DR-26', 'Mock');
IF NOT EXISTS (SELECT 1 FROM dbo.exams WHERE name = 'National Mock Exam 2026')
    INSERT INTO dbo.exams (id, name, code, type) VALUES (NEWID(), 'National Mock Exam 2026', 'NAT-MOCK', 'Mock');

PRINT '>>> Master Exams seeded.';
GO

-- 4. Insert Roles (Matching portal: M OT, SO, HOT, CCTV, Equity Lab Supervisior_ ssc)
IF NOT EXISTS (SELECT 1 FROM dbo.roles WHERE code = 'MOT')
    INSERT INTO dbo.roles (id, name, code) VALUES (NEWID(), 'M OT', 'MOT');
IF NOT EXISTS (SELECT 1 FROM dbo.roles WHERE code = 'SO')
    INSERT INTO dbo.roles (id, name, code) VALUES (NEWID(), 'SO', 'SO');
IF NOT EXISTS (SELECT 1 FROM dbo.roles WHERE code = 'HOT')
    INSERT INTO dbo.roles (id, name, code) VALUES (NEWID(), 'HOT(IT Manager)', 'HOT');
IF NOT EXISTS (SELECT 1 FROM dbo.roles WHERE code = 'CCTV')
    INSERT INTO dbo.roles (id, name, code) VALUES (NEWID(), 'CCTV', 'CCTV');
IF NOT EXISTS (SELECT 1 FROM dbo.roles WHERE code = 'ELS_SSC')
    INSERT INTO dbo.roles (id, name, code) VALUES (NEWID(), 'Equity Lab Supervisior_ ssc', 'ELS_SSC');

PRINT '>>> Master Roles seeded (M OT, SO, HOT, CCTV, Equity Lab Supervisior_ ssc).';
GO

-- 5. Insert Shifts
IF NOT EXISTS (SELECT 1 FROM dbo.shifts WHERE name = 'Shift 1')
    INSERT INTO dbo.shifts (id, name, defaultReportingTime, defaultEndTime)
    VALUES (NEWID(), 'Shift 1', '07:30 AM', '01:30 PM');
IF NOT EXISTS (SELECT 1 FROM dbo.shifts WHERE name = 'Shift 2')
    INSERT INTO dbo.shifts (id, name, defaultReportingTime, defaultEndTime)
    VALUES (NEWID(), 'Shift 2', '12:30 PM', '06:30 PM');
IF NOT EXISTS (SELECT 1 FROM dbo.shifts WHERE name = 'Shift 3')
    INSERT INTO dbo.shifts (id, name, defaultReportingTime, defaultEndTime)
    VALUES (NEWID(), 'Shift 3', '05:30 PM', '10:00 PM');

PRINT '>>> Master Shifts seeded.';
GO
`;

// Build 02_insert_master_data.sql
const full02 = `-- =================================================================================
-- Exam Duty Management System - Master Data Seed Script
-- Script: 02_insert_master_data.sql
-- Description: Inserts standard 25 Cities, 113 Centers, Exams, Roles, and Shifts from AWIGNA Excel
-- Target RDBMS: Microsoft SQL Server (ExamDutyDB2)
-- =================================================================================

USE [ExamDutyDB2];
GO

${masterSql}
${examsRolesShifts}
`;

fs.writeFileSync(path.join(__dirname, '02_insert_master_data.sql'), full02, 'utf8');
console.log('Updated 02_insert_master_data.sql');

// Update 04_all_in_one_run_me.sql
const original04 = fs.readFileSync(path.join(__dirname, '04_all_in_one_run_me.sql'), 'utf8');
const step3Marker = '-- STEP 3: INSERT MASTER DATA';
const examsMarker = '-- Exams (All 12 Exams & Mocks)';

const preStep3 = original04.substring(0, original04.indexOf(step3Marker) + step3Marker.length);
const postExams = original04.substring(original04.indexOf(examsMarker));

const new04 = `${preStep3}
-- 25 Cities and 113 Centers from Excel
${masterSql}
${postExams}`;

fs.writeFileSync(path.join(__dirname, '04_all_in_one_run_me.sql'), new04, 'utf8');
console.log('Updated 04_all_in_one_run_me.sql');

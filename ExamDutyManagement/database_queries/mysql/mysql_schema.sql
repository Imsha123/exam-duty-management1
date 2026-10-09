-- Exam Duty Management - MySQL schema (tables only)
-- Import in hPanel -> Databases -> phpMyAdmin -> select your database -> Import.
-- Master data and the default employee (17655) are seeded automatically
-- by the backend on first start.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS employees (
  id CHAR(36) NOT NULL,
  resourceId VARCHAR(50) NOT NULL,
  name VARCHAR(150) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  email VARCHAR(150) NULL,
  aadhaarNumber VARCHAR(20) NULL,
  panNumber VARCHAR(20) NULL,
  city VARCHAR(100) NULL,
  isIdentityVerified TINYINT(1) NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'Active',
  passwordHash VARCHAR(255) NULL,
  createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY UQ_employees_resourceId (resourceId),
  UNIQUE KEY UQ_employees_mobile (mobile)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cities (
  id CHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL DEFAULT 'Karnataka',
  createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY UQ_cities_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS centers (
  id CHAR(36) NOT NULL,
  centerCode VARCHAR(50) NOT NULL,
  centerName VARCHAR(200) NOT NULL,
  cityId CHAR(36) NOT NULL,
  address VARCHAR(255) NULL,
  createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY UQ_centers_code (centerCode),
  CONSTRAINT FK_centers_cities FOREIGN KEY (cityId) REFERENCES cities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS exams (
  id CHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'Exam',
  createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY UQ_exams_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS roles (
  id CHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) NOT NULL,
  createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY UQ_roles_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS shifts (
  id CHAR(36) NOT NULL,
  name VARCHAR(50) NOT NULL,
  defaultReportingTime VARCHAR(20) NOT NULL DEFAULT '07:30 AM',
  defaultEndTime VARCHAR(20) NOT NULL DEFAULT '01:30 PM',
  createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY UQ_shifts_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS attendance_files (
  id CHAR(36) NOT NULL,
  originalName VARCHAR(255) NOT NULL,
  fileName VARCHAR(255) NOT NULL,
  mimeType VARCHAR(100) NOT NULL,
  size BIGINT NOT NULL,
  filePath VARCHAR(500) NOT NULL,
  uploadedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS duties (
  id CHAR(36) NOT NULL,
  employeeId CHAR(36) NOT NULL,
  dutyDate VARCHAR(30) NOT NULL,
  cityId CHAR(36) NOT NULL,
  centerId CHAR(36) NOT NULL,
  dutyType VARCHAR(20) NOT NULL DEFAULT 'Exam',
  examId CHAR(36) NOT NULL,
  roleId CHAR(36) NOT NULL,
  shiftId CHAR(36) NOT NULL,
  reportingTime VARCHAR(30) NULL,
  shiftEndTime VARCHAR(30) NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Pending',
  attendanceFileId CHAR(36) NULL,
  createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY UQ_duties_duplicate_check (employeeId, dutyDate, centerId, shiftId),
  CONSTRAINT FK_duties_employees FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
  CONSTRAINT FK_duties_cities FOREIGN KEY (cityId) REFERENCES cities(id),
  CONSTRAINT FK_duties_centers FOREIGN KEY (centerId) REFERENCES centers(id),
  CONSTRAINT FK_duties_exams FOREIGN KEY (examId) REFERENCES exams(id),
  CONSTRAINT FK_duties_roles FOREIGN KEY (roleId) REFERENCES roles(id),
  CONSTRAINT FK_duties_shifts FOREIGN KEY (shiftId) REFERENCES shifts(id),
  CONSTRAINT FK_duties_attendance FOREIGN KEY (attendanceFileId) REFERENCES attendance_files(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- Human-readable view
CREATE OR REPLACE VIEW vw_duties AS
SELECT e.resourceId AS `Resource ID`, e.name AS `Employee Name`, e.mobile AS `Contact Number`,
       d.dutyDate AS `Duty Date`, d.dutyType AS `Duty Type`, ex.name AS `Exam Name`,
       c.centerName AS `Exam Center`, c.centerCode AS `Center Code`, ci.name AS `City`,
       r.name AS `Duty Role`, s.name AS `Shift`, d.reportingTime AS `Reporting Time`,
       d.shiftEndTime AS `Shift End Time`, d.status AS `Status`, d.createdAt AS `Created At`
FROM duties d
LEFT JOIN employees e ON d.employeeId = e.id
LEFT JOIN exams ex ON d.examId = ex.id
LEFT JOIN centers c ON d.centerId = c.id
LEFT JOIN cities ci ON d.cityId = ci.id
LEFT JOIN roles r ON d.roleId = r.id
LEFT JOIN shifts s ON d.shiftId = s.id;

-- =================================================================================
-- Exam Duty Management System - Master Data Seed Script
-- Script: 02_insert_master_data.sql
-- Description: Inserts standard 25 Cities, 113 Centers, Exams, Roles, and Shifts from AWIGNA Excel
-- Target RDBMS: Microsoft SQL Server (ExamDutyDB2)
-- =================================================================================

USE [ExamDutyDB2];
GO

-- =================================================================================
-- Master data for 25 Cities and 113 Centers from Excel
-- =================================================================================

-- 1. Seed 25 Cities
IF NOT EXISTS (SELECT 1 FROM dbo.cities WHERE name = 'Bagalkot')
    INSERT INTO dbo.cities (id, name, state) VALUES (NEWID(), 'Bagalkot', 'Karnataka');
IF NOT EXISTS (SELECT 1 FROM dbo.cities WHERE name = 'Ballari(Bellary)')
    INSERT INTO dbo.cities (id, name, state) VALUES (NEWID(), 'Ballari(Bellary)', 'Karnataka');
IF NOT EXISTS (SELECT 1 FROM dbo.cities WHERE name = 'Belagavi(Belgaum)')
    INSERT INTO dbo.cities (id, name, state) VALUES (NEWID(), 'Belagavi(Belgaum)', 'Karnataka');
IF NOT EXISTS (SELECT 1 FROM dbo.cities WHERE name = 'Bengaluru')
    INSERT INTO dbo.cities (id, name, state) VALUES (NEWID(), 'Bengaluru', 'Karnataka');
IF NOT EXISTS (SELECT 1 FROM dbo.cities WHERE name = 'Bidar')
    INSERT INTO dbo.cities (id, name, state) VALUES (NEWID(), 'Bidar', 'Karnataka');
IF NOT EXISTS (SELECT 1 FROM dbo.cities WHERE name = 'Chikballapur')
    INSERT INTO dbo.cities (id, name, state) VALUES (NEWID(), 'Chikballapur', 'Karnataka');
IF NOT EXISTS (SELECT 1 FROM dbo.cities WHERE name = 'Chikkamagaluru')
    INSERT INTO dbo.cities (id, name, state) VALUES (NEWID(), 'Chikkamagaluru', 'Karnataka');
IF NOT EXISTS (SELECT 1 FROM dbo.cities WHERE name = 'Davanagere')
    INSERT INTO dbo.cities (id, name, state) VALUES (NEWID(), 'Davanagere', 'Karnataka');
IF NOT EXISTS (SELECT 1 FROM dbo.cities WHERE name = 'Dharwad')
    INSERT INTO dbo.cities (id, name, state) VALUES (NEWID(), 'Dharwad', 'Karnataka');
IF NOT EXISTS (SELECT 1 FROM dbo.cities WHERE name = 'Gadag')
    INSERT INTO dbo.cities (id, name, state) VALUES (NEWID(), 'Gadag', 'Karnataka');
IF NOT EXISTS (SELECT 1 FROM dbo.cities WHERE name = 'HOSPET')
    INSERT INTO dbo.cities (id, name, state) VALUES (NEWID(), 'HOSPET', 'Karnataka');
IF NOT EXISTS (SELECT 1 FROM dbo.cities WHERE name = 'Hassan')
    INSERT INTO dbo.cities (id, name, state) VALUES (NEWID(), 'Hassan', 'Karnataka');
IF NOT EXISTS (SELECT 1 FROM dbo.cities WHERE name = 'Haveri')
    INSERT INTO dbo.cities (id, name, state) VALUES (NEWID(), 'Haveri', 'Karnataka');
IF NOT EXISTS (SELECT 1 FROM dbo.cities WHERE name = 'Hubballi(Hubli)')
    INSERT INTO dbo.cities (id, name, state) VALUES (NEWID(), 'Hubballi(Hubli)', 'Karnataka');
IF NOT EXISTS (SELECT 1 FROM dbo.cities WHERE name = 'Kalaburagi(Gulbarga)')
    INSERT INTO dbo.cities (id, name, state) VALUES (NEWID(), 'Kalaburagi(Gulbarga)', 'Karnataka');
IF NOT EXISTS (SELECT 1 FROM dbo.cities WHERE name = 'Kolar')
    INSERT INTO dbo.cities (id, name, state) VALUES (NEWID(), 'Kolar', 'Karnataka');
IF NOT EXISTS (SELECT 1 FROM dbo.cities WHERE name = 'Mandya')
    INSERT INTO dbo.cities (id, name, state) VALUES (NEWID(), 'Mandya', 'Karnataka');
IF NOT EXISTS (SELECT 1 FROM dbo.cities WHERE name = 'Mangaluru(Mangalore)')
    INSERT INTO dbo.cities (id, name, state) VALUES (NEWID(), 'Mangaluru(Mangalore)', 'Karnataka');
IF NOT EXISTS (SELECT 1 FROM dbo.cities WHERE name = 'Mysuru(Mysore)')
    INSERT INTO dbo.cities (id, name, state) VALUES (NEWID(), 'Mysuru(Mysore)', 'Karnataka');
IF NOT EXISTS (SELECT 1 FROM dbo.cities WHERE name = 'Puttur')
    INSERT INTO dbo.cities (id, name, state) VALUES (NEWID(), 'Puttur', 'Karnataka');
IF NOT EXISTS (SELECT 1 FROM dbo.cities WHERE name = 'Shivamogga(Shimoga)')
    INSERT INTO dbo.cities (id, name, state) VALUES (NEWID(), 'Shivamogga(Shimoga)', 'Karnataka');
IF NOT EXISTS (SELECT 1 FROM dbo.cities WHERE name = 'Tumkur')
    INSERT INTO dbo.cities (id, name, state) VALUES (NEWID(), 'Tumkur', 'Karnataka');
IF NOT EXISTS (SELECT 1 FROM dbo.cities WHERE name = 'Udupi')
    INSERT INTO dbo.cities (id, name, state) VALUES (NEWID(), 'Udupi', 'Karnataka');
IF NOT EXISTS (SELECT 1 FROM dbo.cities WHERE name = 'Uttara Kannada')
    INSERT INTO dbo.cities (id, name, state) VALUES (NEWID(), 'Uttara Kannada', 'Karnataka');
IF NOT EXISTS (SELECT 1 FROM dbo.cities WHERE name = 'Vijayapura(Bijapur)')
    INSERT INTO dbo.cities (id, name, state) VALUES (NEWID(), 'Vijayapura(Bijapur)', 'Karnataka');

PRINT '>>> 25 Master Cities seeded.';
GO

-- 2. Seed 113 Centers
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '963')
BEGIN
    DECLARE @cId_963_0 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bagalkot');
    IF @cId_963_0 IS NULL
        SET @cId_963_0 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '963', 'Basaveshwar Engineering College', @cId_963_0, 'Basaveshwar Engineering College, Bagalkot');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '42236')
BEGIN
    DECLARE @cId_42236_1 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bagalkot');
    IF @cId_42236_1 IS NULL
        SET @cId_42236_1 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '42236', 'Biluru Gurubasava Mahaswamiji Institute of Technology', @cId_42236_1, 'Biluru Gurubasava Mahaswamiji Institute of Technology, Bagalkot');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '1435')
BEGIN
    DECLARE @cId_1435_2 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Ballari(Bellary)');
    IF @cId_1435_2 IS NULL
        SET @cId_1435_2 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '1435', 'Ballari Institute of Technology & Management', @cId_1435_2, 'Ballari Institute of Technology & Management, Ballari(Bellary)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '294')
BEGIN
    DECLARE @cId_294_3 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Ballari(Bellary)');
    IF @cId_294_3 IS NULL
        SET @cId_294_3 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '294', 'Rao Bahadur Y.Mahabaleshwarappa Engineering College', @cId_294_3, 'Rao Bahadur Y.Mahabaleshwarappa Engineering College, Ballari(Bellary)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '11398')
BEGIN
    DECLARE @cId_11398_4 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Belagavi(Belgaum)');
    IF @cId_11398_4 IS NULL
        SET @cId_11398_4 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '11398', 'iON Digital Zone iDZ Airport Road', @cId_11398_4, 'iON Digital Zone iDZ Airport Road, Belagavi(Belgaum)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '37505')
BEGIN
    DECLARE @cId_37505_5 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Belagavi(Belgaum)');
    IF @cId_37505_5 IS NULL
        SET @cId_37505_5 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '37505', 'Infojiva IT Services LLP', @cId_37505_5, 'Infojiva IT Services LLP, Belagavi(Belgaum)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '9090')
BEGIN
    DECLARE @cId_9090_6 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Belagavi(Belgaum)');
    IF @cId_9090_6 IS NULL
        SET @cId_9090_6 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '9090', 'SJPN Trusts BCA College', @cId_9090_6, 'SJPN Trusts BCA College, Belagavi(Belgaum)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '979')
BEGIN
    DECLARE @cId_979_7 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Belagavi(Belgaum)');
    IF @cId_979_7 IS NULL
        SET @cId_979_7 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '979', 'Jain College of Engineering', @cId_979_7, 'Jain College of Engineering, Belagavi(Belgaum)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '42238')
BEGIN
    DECLARE @cId_42238_8 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Belagavi(Belgaum)');
    IF @cId_42238_8 IS NULL
        SET @cId_42238_8 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '42238', 'Anuvartik Mirji Bharatesh Institute of Technology', @cId_42238_8, 'Anuvartik Mirji Bharatesh Institute of Technology, Belagavi(Belgaum)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '1417')
BEGIN
    DECLARE @cId_1417_9 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Belagavi(Belgaum)');
    IF @cId_1417_9 IS NULL
        SET @cId_1417_9 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '1417', 'K.L.E. Dr. M.S. Sheshgiri College of Engineering and Technology', @cId_1417_9, 'K.L.E. Dr. M.S. Sheshgiri College of Engineering and Technology, Belagavi(Belgaum)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '2450')
BEGIN
    DECLARE @cId_2450_10 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Belagavi(Belgaum)');
    IF @cId_2450_10 IS NULL
        SET @cId_2450_10 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '2450', 'Hirasugar Institute of Technology', @cId_2450_10, 'Hirasugar Institute of Technology, Belagavi(Belgaum)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '42057')
BEGIN
    DECLARE @cId_42057_11 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_42057_11 IS NULL
        SET @cId_42057_11 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '42057', 'iON Digital Zone iDZ Harohalli', @cId_42057_11, 'iON Digital Zone iDZ Harohalli, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '7974')
BEGIN
    DECLARE @cId_7974_12 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_7974_12 IS NULL
        SET @cId_7974_12 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '7974', 'iON Digital Zone iDZ Rajarajeswari Medical College and Hospital', @cId_7974_12, 'iON Digital Zone iDZ Rajarajeswari Medical College and Hospital, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '37272')
BEGIN
    DECLARE @cId_37272_13 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_37272_13 IS NULL
        SET @cId_37272_13 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '37272', 'eMerit', @cId_37272_13, 'eMerit, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '163')
BEGIN
    DECLARE @cId_163_14 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_163_14 IS NULL
        SET @cId_163_14 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '163', 'HKBK College of Engineering', @cId_163_14, 'HKBK College of Engineering, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '40086')
BEGIN
    DECLARE @cId_40086_15 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_40086_15 IS NULL
        SET @cId_40086_15 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '40086', 'eTalent', @cId_40086_15, 'eTalent, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '40071')
BEGIN
    DECLARE @cId_40071_16 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_40071_16 IS NULL
        SET @cId_40071_16 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '40071', 'Techxcellence Digital Solutions', @cId_40071_16, 'Techxcellence Digital Solutions, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '9345')
BEGIN
    DECLARE @cId_9345_17 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_9345_17 IS NULL
        SET @cId_9345_17 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '9345', 'Rain Cloud Technologies', @cId_9345_17, 'Rain Cloud Technologies, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '7814')
BEGIN
    DECLARE @cId_7814_18 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_7814_18 IS NULL
        SET @cId_7814_18 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '7814', 'Reverend Technologies', @cId_7814_18, 'Reverend Technologies, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '40168')
BEGIN
    DECLARE @cId_40168_19 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_40168_19 IS NULL
        SET @cId_40168_19 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '40168', 'Digimetrics', @cId_40168_19, 'Digimetrics, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '33958')
BEGIN
    DECLARE @cId_33958_20 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_33958_20 IS NULL
        SET @cId_33958_20 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '33958', 'Milestone Technologies', @cId_33958_20, 'Milestone Technologies, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '8210')
BEGIN
    DECLARE @cId_8210_21 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_8210_21 IS NULL
        SET @cId_8210_21 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '8210', 'Dayananda Sagar University', @cId_8210_21, 'Dayananda Sagar University, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '8349')
BEGIN
    DECLARE @cId_8349_22 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_8349_22 IS NULL
        SET @cId_8349_22 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '8349', 'M.S.Ramaiah University of Applied Sciences', @cId_8349_22, 'M.S.Ramaiah University of Applied Sciences, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '35699')
BEGIN
    DECLARE @cId_35699_23 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_35699_23 IS NULL
        SET @cId_35699_23 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '35699', 'BITBYTECH Solutions', @cId_35699_23, 'BITBYTECH Solutions, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '3015')
BEGIN
    DECLARE @cId_3015_24 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_3015_24 IS NULL
        SET @cId_3015_24 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '3015', 'K S School of Engineering and Management Bengaluru', @cId_3015_24, 'K S School of Engineering and Management Bengaluru, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '8361')
BEGIN
    DECLARE @cId_8361_25 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_8361_25 IS NULL
        SET @cId_8361_25 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '8361', 'BMS College of Engineering', @cId_8361_25, 'BMS College of Engineering, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '772')
BEGIN
    DECLARE @cId_772_26 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_772_26 IS NULL
        SET @cId_772_26 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '772', 'Cambridge Institute Of Technology', @cId_772_26, 'Cambridge Institute Of Technology, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '250')
BEGIN
    DECLARE @cId_250_27 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_250_27 IS NULL
        SET @cId_250_27 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '250', 'M S Engineering College', @cId_250_27, 'M S Engineering College, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '632')
BEGIN
    DECLARE @cId_632_28 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_632_28 IS NULL
        SET @cId_632_28 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '632', 'ACS College of Engineering', @cId_632_28, 'ACS College of Engineering, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '531')
BEGIN
    DECLARE @cId_531_29 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_531_29 IS NULL
        SET @cId_531_29 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '531', 'Vemana Institute of Technology', @cId_531_29, 'Vemana Institute of Technology, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '2744')
BEGIN
    DECLARE @cId_2744_30 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_2744_30 IS NULL
        SET @cId_2744_30 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '2744', 'AMC Engineering College', @cId_2744_30, 'AMC Engineering College, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '41880')
BEGIN
    DECLARE @cId_41880_31 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_41880_31 IS NULL
        SET @cId_41880_31 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '41880', 'Four Tune Tech Solutions', @cId_41880_31, 'Four Tune Tech Solutions, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '532')
BEGIN
    DECLARE @cId_532_32 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_532_32 IS NULL
        SET @cId_532_32 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '532', 'B.N.M Institute of Technology', @cId_532_32, 'B.N.M Institute of Technology, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '150')
BEGIN
    DECLARE @cId_150_33 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_150_33 IS NULL
        SET @cId_150_33 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '150', 'Reva University', @cId_150_33, 'Reva University, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '714')
BEGIN
    DECLARE @cId_714_34 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_714_34 IS NULL
        SET @cId_714_34 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '714', 'Dayananda Sagar Academy of Technology and Management', @cId_714_34, 'Dayananda Sagar Academy of Technology and Management, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '8261')
BEGIN
    DECLARE @cId_8261_35 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_8261_35 IS NULL
        SET @cId_8261_35 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '8261', 'RNS Institute of Technology', @cId_8261_35, 'RNS Institute of Technology, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '8218')
BEGIN
    DECLARE @cId_8218_36 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_8218_36 IS NULL
        SET @cId_8218_36 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '8218', 'Gopalan College of Engineering & Management', @cId_8218_36, 'Gopalan College of Engineering & Management, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '2945')
BEGIN
    DECLARE @cId_2945_37 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_2945_37 IS NULL
        SET @cId_2945_37 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '2945', 'SJB Institute of Technology', @cId_2945_37, 'SJB Institute of Technology, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '533')
BEGIN
    DECLARE @cId_533_38 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_533_38 IS NULL
        SET @cId_533_38 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '533', 'BMS Institute of Technology and Management', @cId_533_38, 'BMS Institute of Technology and Management, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '646')
BEGIN
    DECLARE @cId_646_39 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_646_39 IS NULL
        SET @cId_646_39 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '646', 'Rajarajeswari College of Engineering', @cId_646_39, 'Rajarajeswari College of Engineering, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '42240')
BEGIN
    DECLARE @cId_42240_40 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_42240_40 IS NULL
        SET @cId_42240_40 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '42240', 'Harsha Institute of Technology', @cId_42240_40, 'Harsha Institute of Technology, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '193')
BEGIN
    DECLARE @cId_193_41 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_193_41 IS NULL
        SET @cId_193_41 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '193', 'Amruta Institute of Engineering and Management Sciences', @cId_193_41, 'Amruta Institute of Engineering and Management Sciences, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '2180')
BEGIN
    DECLARE @cId_2180_42 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_2180_42 IS NULL
        SET @cId_2180_42 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '2180', 'Don Bosco Institute of Technology', @cId_2180_42, 'Don Bosco Institute of Technology, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '972')
BEGIN
    DECLARE @cId_972_43 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_972_43 IS NULL
        SET @cId_972_43 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '972', 'Jyothy Institute of Technology', @cId_972_43, 'Jyothy Institute of Technology, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '506')
BEGIN
    DECLARE @cId_506_44 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_506_44 IS NULL
        SET @cId_506_44 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '506', 'Global Academy of Technology', @cId_506_44, 'Global Academy of Technology, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '3424')
BEGIN
    DECLARE @cId_3424_45 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_3424_45 IS NULL
        SET @cId_3424_45 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '3424', 'Dayananda Sagar Institutions', @cId_3424_45, 'Dayananda Sagar Institutions, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '42241')
BEGIN
    DECLARE @cId_42241_46 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_42241_46 IS NULL
        SET @cId_42241_46 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '42241', 'Akash Institute of Engineering and Technology', @cId_42241_46, 'Akash Institute of Engineering and Technology, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '755')
BEGIN
    DECLARE @cId_755_47 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_755_47 IS NULL
        SET @cId_755_47 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '755', 'JSS Academy of Technical Education', @cId_755_47, 'JSS Academy of Technical Education, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '596')
BEGIN
    DECLARE @cId_596_48 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_596_48 IS NULL
        SET @cId_596_48 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '596', 'K S Institute of Technology', @cId_596_48, 'K S Institute of Technology, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '986')
BEGIN
    DECLARE @cId_986_49 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_986_49 IS NULL
        SET @cId_986_49 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '986', 'R.L.Jalappa Institute of Technology', @cId_986_49, 'R.L.Jalappa Institute of Technology, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '4553')
BEGIN
    DECLARE @cId_4553_50 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_4553_50 IS NULL
        SET @cId_4553_50 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '4553', 'Alliance University', @cId_4553_50, 'Alliance University, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '42242')
BEGIN
    DECLARE @cId_42242_51 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_42242_51 IS NULL
        SET @cId_42242_51 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '42242', 'Aditya College of Engineering and Technology Bengaluru', @cId_42242_51, 'Aditya College of Engineering and Technology Bengaluru, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '2035')
BEGIN
    DECLARE @cId_2035_52 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_2035_52 IS NULL
        SET @cId_2035_52 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '2035', 'Nagarjuna College of Engineering & Technology', @cId_2035_52, 'Nagarjuna College of Engineering & Technology, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '3620')
BEGIN
    DECLARE @cId_3620_53 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_3620_53 IS NULL
        SET @cId_3620_53 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '3620', 'M S Ramaiah Institute of Technology', @cId_3620_53, 'M S Ramaiah Institute of Technology, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '7856')
BEGIN
    DECLARE @cId_7856_54 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_7856_54 IS NULL
        SET @cId_7856_54 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '7856', 'Sir M Visvesvaraya Institute Of Technology', @cId_7856_54, 'Sir M Visvesvaraya Institute Of Technology, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '29030')
BEGIN
    DECLARE @cId_29030_55 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_29030_55 IS NULL
        SET @cId_29030_55 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '29030', 'RV Institute of Technology and Management', @cId_29030_55, 'RV Institute of Technology and Management, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '1577')
BEGIN
    DECLARE @cId_1577_56 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_1577_56 IS NULL
        SET @cId_1577_56 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '1577', 'Sri Sairam College of Engineering', @cId_1577_56, 'Sri Sairam College of Engineering, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '42239')
BEGIN
    DECLARE @cId_42239_57 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bengaluru');
    IF @cId_42239_57 IS NULL
        SET @cId_42239_57 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '42239', 'Dr. H N National College of Engineering', @cId_42239_57, 'Dr. H N National College of Engineering, Bengaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '40800')
BEGIN
    DECLARE @cId_40800_58 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Bidar');
    IF @cId_40800_58 IS NULL
        SET @cId_40800_58 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '40800', 'Lingarajappa Engineering College', @cId_40800_58, 'Lingarajappa Engineering College, Bidar');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '195')
BEGIN
    DECLARE @cId_195_59 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Chikballapur');
    IF @cId_195_59 IS NULL
        SET @cId_195_59 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '195', 'Sri Jagadguru Chandrashekaranatha Swamiji Institute of Technology', @cId_195_59, 'Sri Jagadguru Chandrashekaranatha Swamiji Institute of Technology, Chikballapur');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '1074')
BEGIN
    DECLARE @cId_1074_60 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Chikkamagaluru');
    IF @cId_1074_60 IS NULL
        SET @cId_1074_60 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '1074', 'Adichunchanagiri Institute of Technology', @cId_1074_60, 'Adichunchanagiri Institute of Technology, Chikkamagaluru');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '201')
BEGIN
    DECLARE @cId_201_61 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Davanagere');
    IF @cId_201_61 IS NULL
        SET @cId_201_61 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '201', 'Bapuji Institute of Engineering & Technology', @cId_201_61, 'Bapuji Institute of Engineering & Technology, Davanagere');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '7844')
BEGIN
    DECLARE @cId_7844_62 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Davanagere');
    IF @cId_7844_62 IS NULL
        SET @cId_7844_62 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '7844', 'Jain Institute of Technology', @cId_7844_62, 'Jain Institute of Technology, Davanagere');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '974')
BEGIN
    DECLARE @cId_974_63 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Davanagere');
    IF @cId_974_63 IS NULL
        SET @cId_974_63 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '974', 'GM Institute of Technology', @cId_974_63, 'GM Institute of Technology, Davanagere');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '1575')
BEGIN
    DECLARE @cId_1575_64 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Dharwad');
    IF @cId_1575_64 IS NULL
        SET @cId_1575_64 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '1575', 'Global Business School', @cId_1575_64, 'Global Business School, Dharwad');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '1208')
BEGIN
    DECLARE @cId_1208_65 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Dharwad');
    IF @cId_1208_65 IS NULL
        SET @cId_1208_65 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '1208', 'Sri Dharmasthala Manjunatheshwara College of Engineering and Technology', @cId_1208_65, 'Sri Dharmasthala Manjunatheshwara College of Engineering and Technology, Dharwad');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '985')
BEGIN
    DECLARE @cId_985_66 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Gadag');
    IF @cId_985_66 IS NULL
        SET @cId_985_66 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '985', 'Smt. Kamala and Sri Venkappa M. Agadi College of Engineering and Technology', @cId_985_66, 'Smt. Kamala and Sri Venkappa M. Agadi College of Engineering and Technology, Gadag');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '8152')
BEGIN
    DECLARE @cId_8152_67 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Hassan');
    IF @cId_8152_67 IS NULL
        SET @cId_8152_67 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '8152', 'Rajeev Polytechnic', @cId_8152_67, 'Rajeev Polytechnic, Hassan');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '1026')
BEGIN
    DECLARE @cId_1026_68 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Hassan');
    IF @cId_1026_68 IS NULL
        SET @cId_1026_68 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '1026', 'Malnad College of Engineering', @cId_1026_68, 'Malnad College of Engineering, Hassan');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '2670')
BEGIN
    DECLARE @cId_2670_69 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Hassan');
    IF @cId_2670_69 IS NULL
        SET @cId_2670_69 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '2670', 'NAVKIS College of Engineering', @cId_2670_69, 'NAVKIS College of Engineering, Hassan');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '950')
BEGIN
    DECLARE @cId_950_70 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Haveri');
    IF @cId_950_70 IS NULL
        SET @cId_950_70 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '950', 'Sri Taralabalu Jagadguru Institute of Technology', @cId_950_70, 'Sri Taralabalu Jagadguru Institute of Technology, Haveri');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '2630')
BEGIN
    DECLARE @cId_2630_71 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'HOSPET');
    IF @cId_2630_71 IS NULL
        SET @cId_2630_71 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '2630', 'Proudadevaraya Institute of Technology', @cId_2630_71, 'Proudadevaraya Institute of Technology, HOSPET');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '8030')
BEGIN
    DECLARE @cId_8030_72 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Hubballi(Hubli)');
    IF @cId_8030_72 IS NULL
        SET @cId_8030_72 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '8030', 'iON Digital Zone iDZ Akshay Colony', @cId_8030_72, 'iON Digital Zone iDZ Akshay Colony, Hubballi(Hubli)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '9687')
BEGIN
    DECLARE @cId_9687_73 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Hubballi(Hubli)');
    IF @cId_9687_73 IS NULL
        SET @cId_9687_73 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '9687', 'Chetan Business School', @cId_9687_73, 'Chetan Business School, Hubballi(Hubli)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '4521')
BEGIN
    DECLARE @cId_4521_74 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Hubballi(Hubli)');
    IF @cId_4521_74 IS NULL
        SET @cId_4521_74 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '4521', 'AGMR College of Engineering and Technology', @cId_4521_74, 'AGMR College of Engineering and Technology, Hubballi(Hubli)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '9558')
BEGIN
    DECLARE @cId_9558_75 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Hubballi(Hubli)');
    IF @cId_9558_75 IS NULL
        SET @cId_9558_75 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '9558', 'Jain College Of Engineering And Technology Hubballi', @cId_9558_75, 'Jain College Of Engineering And Technology Hubballi, Hubballi(Hubli)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '40041')
BEGIN
    DECLARE @cId_40041_76 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Kalaburagi(Gulbarga)');
    IF @cId_40041_76 IS NULL
        SET @cId_40041_76 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '40041', 'Sharanabasaweshwar Vidya Vardhak Sangha', @cId_40041_76, 'Sharanabasaweshwar Vidya Vardhak Sangha, Kalaburagi(Gulbarga)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '26845')
BEGIN
    DECLARE @cId_26845_77 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Kalaburagi(Gulbarga)');
    IF @cId_26845_77 IS NULL
        SET @cId_26845_77 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '26845', 'Godutai Engineering College For Women', @cId_26845_77, 'Godutai Engineering College For Women, Kalaburagi(Gulbarga)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '3194')
BEGIN
    DECLARE @cId_3194_78 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Kalaburagi(Gulbarga)');
    IF @cId_3194_78 IS NULL
        SET @cId_3194_78 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '3194', 'Appa Institute Of Engineering & Technology', @cId_3194_78, 'Appa Institute Of Engineering & Technology, Kalaburagi(Gulbarga)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '920')
BEGIN
    DECLARE @cId_920_79 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Kolar');
    IF @cId_920_79 IS NULL
        SET @cId_920_79 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '920', 'Dr T Thimmaiah Institute of Technology', @cId_920_79, 'Dr T Thimmaiah Institute of Technology, Kolar');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '3348')
BEGIN
    DECLARE @cId_3348_80 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Kolar');
    IF @cId_3348_80 IS NULL
        SET @cId_3348_80 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '3348', 'C Byre Gowda Institute of Technology', @cId_3348_80, 'C Byre Gowda Institute of Technology, Kolar');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '973')
BEGIN
    DECLARE @cId_973_81 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Mandya');
    IF @cId_973_81 IS NULL
        SET @cId_973_81 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '973', 'P.E.S College of Engineering', @cId_973_81, 'P.E.S College of Engineering, Mandya');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '1045')
BEGIN
    DECLARE @cId_1045_82 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Mandya');
    IF @cId_1045_82 IS NULL
        SET @cId_1045_82 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '1045', 'BGS Institute of Technology', @cId_1045_82, 'BGS Institute of Technology, Mandya');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '8972')
BEGIN
    DECLARE @cId_8972_83 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Mandya');
    IF @cId_8972_83 IS NULL
        SET @cId_8972_83 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '8972', 'Cauvery Institute and Technology', @cId_8972_83, 'Cauvery Institute and Technology, Mandya');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '1013')
BEGIN
    DECLARE @cId_1013_84 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Mandya');
    IF @cId_1013_84 IS NULL
        SET @cId_1013_84 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '1013', 'Maharaja Institute of Technology', @cId_1013_84, 'Maharaja Institute of Technology, Mandya');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '8154')
BEGIN
    DECLARE @cId_8154_85 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Mandya');
    IF @cId_8154_85 IS NULL
        SET @cId_8154_85 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '8154', 'G.Madegowda Institute of Technology', @cId_8154_85, 'G.Madegowda Institute of Technology, Mandya');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '8594')
BEGIN
    DECLARE @cId_8594_86 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Mangaluru(Mangalore)');
    IF @cId_8594_86 IS NULL
        SET @cId_8594_86 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '8594', 'iON Digital Zone Bondel', @cId_8594_86, 'iON Digital Zone Bondel, Mangaluru(Mangalore)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '37202')
BEGIN
    DECLARE @cId_37202_87 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Mangaluru(Mangalore)');
    IF @cId_37202_87 IS NULL
        SET @cId_37202_87 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '37202', 'Shri Sharada Niketana Exam and Training Institute', @cId_37202_87, 'Shri Sharada Niketana Exam and Training Institute, Mangaluru(Mangalore)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '192')
BEGIN
    DECLARE @cId_192_88 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Mangaluru(Mangalore)');
    IF @cId_192_88 IS NULL
        SET @cId_192_88 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '192', 'St Joseph Engineering College', @cId_192_88, 'St Joseph Engineering College, Mangaluru(Mangalore)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '841')
BEGIN
    DECLARE @cId_841_89 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Mangaluru(Mangalore)');
    IF @cId_841_89 IS NULL
        SET @cId_841_89 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '841', 'Sahyadri College of Engineering and Management', @cId_841_89, 'Sahyadri College of Engineering and Management, Mangaluru(Mangalore)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '784')
BEGIN
    DECLARE @cId_784_90 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Mangaluru(Mangalore)');
    IF @cId_784_90 IS NULL
        SET @cId_784_90 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '784', 'Mangalore Institute of Technology and Engineering', @cId_784_90, 'Mangalore Institute of Technology and Engineering, Mangaluru(Mangalore)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '8975')
BEGIN
    DECLARE @cId_8975_91 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Mangaluru(Mangalore)');
    IF @cId_8975_91 IS NULL
        SET @cId_8975_91 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '8975', 'Yenepoya Institute of Technology', @cId_8975_91, 'Yenepoya Institute of Technology, Mangaluru(Mangalore)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '8362')
BEGIN
    DECLARE @cId_8362_92 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Mangaluru(Mangalore)');
    IF @cId_8362_92 IS NULL
        SET @cId_8362_92 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '8362', 'Shree Devi Institue of Technology', @cId_8362_92, 'Shree Devi Institue of Technology, Mangaluru(Mangalore)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '8743')
BEGIN
    DECLARE @cId_8743_93 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Mysuru(Mysore)');
    IF @cId_8743_93 IS NULL
        SET @cId_8743_93 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '8743', 'iON Digital Zone iDZ Hebbal', @cId_8743_93, 'iON Digital Zone iDZ Hebbal, Mysuru(Mysore)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '11674')
BEGIN
    DECLARE @cId_11674_94 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Mysuru(Mysore)');
    IF @cId_11674_94 IS NULL
        SET @cId_11674_94 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '11674', 'Chandana Resource Centre', @cId_11674_94, 'Chandana Resource Centre, Mysuru(Mysore)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '984')
BEGIN
    DECLARE @cId_984_95 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Mysuru(Mysore)');
    IF @cId_984_95 IS NULL
        SET @cId_984_95 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '984', 'Vidya Vardhaka College Of Engineering', @cId_984_95, 'Vidya Vardhaka College Of Engineering, Mysuru(Mysore)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '42237')
BEGIN
    DECLARE @cId_42237_96 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Mysuru(Mysore)');
    IF @cId_42237_96 IS NULL
        SET @cId_42237_96 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '42237', 'Cauvery College of Engineering', @cId_42237_96, 'Cauvery College of Engineering, Mysuru(Mysore)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '2678')
BEGIN
    DECLARE @cId_2678_97 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Mysuru(Mysore)');
    IF @cId_2678_97 IS NULL
        SET @cId_2678_97 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '2678', 'GSSS Institute of Engineering and Technology for Women', @cId_2678_97, 'GSSS Institute of Engineering and Technology for Women, Mysuru(Mysore)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '16702')
BEGIN
    DECLARE @cId_16702_98 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Mysuru(Mysore)');
    IF @cId_16702_98 IS NULL
        SET @cId_16702_98 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '16702', 'MIT Thandavapura', @cId_16702_98, 'MIT Thandavapura, Mysuru(Mysore)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '1465')
BEGIN
    DECLARE @cId_1465_99 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Puttur');
    IF @cId_1465_99 IS NULL
        SET @cId_1465_99 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '1465', 'Vivekananda College of Engineering & Technology', @cId_1465_99, 'Vivekananda College of Engineering & Technology, Puttur');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '8560')
BEGIN
    DECLARE @cId_8560_100 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Shivamogga(Shimoga)');
    IF @cId_8560_100 IS NULL
        SET @cId_8560_100 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '8560', 'iON Digital Zone iDZ Machenahalli', @cId_8560_100, 'iON Digital Zone iDZ Machenahalli, Shivamogga(Shimoga)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '971')
BEGIN
    DECLARE @cId_971_101 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Shivamogga(Shimoga)');
    IF @cId_971_101 IS NULL
        SET @cId_971_101 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '971', 'PES Institute of Technology and Management', @cId_971_101, 'PES Institute of Technology and Management, Shivamogga(Shimoga)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '356')
BEGIN
    DECLARE @cId_356_102 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Shivamogga(Shimoga)');
    IF @cId_356_102 IS NULL
        SET @cId_356_102 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '356', 'Jawaharlal Nehru National College of Engineering', @cId_356_102, 'Jawaharlal Nehru National College of Engineering, Shivamogga(Shimoga)');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '207')
BEGIN
    DECLARE @cId_207_103 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Tumkur');
    IF @cId_207_103 IS NULL
        SET @cId_207_103 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '207', 'Siddaganga Institute of Technology', @cId_207_103, 'Siddaganga Institute of Technology, Tumkur');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '1014')
BEGIN
    DECLARE @cId_1014_104 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Tumkur');
    IF @cId_1014_104 IS NULL
        SET @cId_1014_104 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '1014', 'Channabasaveshwara Institute of Technology', @cId_1014_104, 'Channabasaveshwara Institute of Technology, Tumkur');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '2077')
BEGIN
    DECLARE @cId_2077_105 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Tumkur');
    IF @cId_2077_105 IS NULL
        SET @cId_2077_105 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '2077', 'Shridevi Institute of Engineering & Technology', @cId_2077_105, 'Shridevi Institute of Engineering & Technology, Tumkur');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '7975')
BEGIN
    DECLARE @cId_7975_106 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Udupi');
    IF @cId_7975_106 IS NULL
        SET @cId_7975_106 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '7975', 'iON Digital Zone iDZ Milk Diary Road', @cId_7975_106, 'iON Digital Zone iDZ Milk Diary Road, Udupi');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '1449')
BEGIN
    DECLARE @cId_1449_107 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Udupi');
    IF @cId_1449_107 IS NULL
        SET @cId_1449_107 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '1449', 'Shri Madhwa Vadiraja Institute of Technology & Management', @cId_1449_107, 'Shri Madhwa Vadiraja Institute of Technology & Management, Udupi');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '15832')
BEGIN
    DECLARE @cId_15832_108 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Udupi');
    IF @cId_15832_108 IS NULL
        SET @cId_15832_108 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '15832', 'Sri Bhuvanendra College', @cId_15832_108, 'Sri Bhuvanendra College, Udupi');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '1655')
BEGIN
    DECLARE @cId_1655_109 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Udupi');
    IF @cId_1655_109 IS NULL
        SET @cId_1655_109 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '1655', 'Mahatma Gandhi Memorial College', @cId_1655_109, 'Mahatma Gandhi Memorial College, Udupi');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '15019')
BEGIN
    DECLARE @cId_15019_110 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Udupi');
    IF @cId_15019_110 IS NULL
        SET @cId_15019_110 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '15019', 'Manipal Institute Of Technology', @cId_15019_110, 'Manipal Institute Of Technology, Udupi');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '2548')
BEGIN
    DECLARE @cId_2548_111 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Uttara Kannada');
    IF @cId_2548_111 IS NULL
        SET @cId_2548_111 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '2548', 'K L S Vishwanathrao Deshpande Rural Institute of Technology', @cId_2548_111, 'K L S Vishwanathrao Deshpande Rural Institute of Technology, Uttara Kannada');
END;
IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '970')
BEGIN
    DECLARE @cId_970_112 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = 'Vijayapura(Bijapur)');
    IF @cId_970_112 IS NULL
        SET @cId_970_112 = (SELECT TOP 1 id FROM dbo.cities);
    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)
    VALUES (NEWID(), '970', 'Dr P G Halakatti College of Engineering and Technology', @cId_970_112, 'Dr P G Halakatti College of Engineering and Technology, Vijayapura(Bijapur)');
END;

PRINT '>>> 113 Master Centers seeded.';
GO


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


import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Loader2,
  X,
  FileText,
  Trash2,
  School,
  MapPin,
} from 'lucide-react';
import * as XLSX from 'xlsx-js-style';
import masterService, { Center, City } from '../services/master.service';

interface ParsedCenterRow {
  centerCode: string;
  centerName: string;
  cityName: string;
  cityId: string;
  address?: string;
  status: 'valid' | 'duplicate' | 'invalid';
  validationMessage?: string;
}

interface BulkUploadCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  existingCenters: Center[];
  existingCities: City[];
}

export const BulkUploadCenterModal: React.FC<BulkUploadCenterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  existingCenters,
  existingCities,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [parsedRows, setParsedRows] = useState<ParsedCenterRow[]>([]);
  const [removedDuplicatesCount, setRemovedDuplicatesCount] = useState<number>(0);
  const [parseError, setParseError] = useState<string | null>(null);

  // Upload status state
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [uploadResult, setUploadResult] = useState<{
    successCount: number;
    failureCount: number;
    errors: string[];
  } | null>(null);

  if (!isOpen) return null;

  // 1. Download Sample Excel Template
  const handleDownloadTemplate = () => {
    const sampleCity1 = existingCities.length > 0 ? existingCities[0].name : 'Mysore';
    const sampleCity2 = existingCities.length > 1 ? existingCities[1].name : sampleCity1;

    // Suggest next available numeric center code
    const numericCodes = existingCenters
      .map((c) => parseInt(c.centerCode, 10))
      .filter((n) => !isNaN(n) && n > 1000);
    const nextCode = numericCodes.length > 0 ? Math.max(...numericCodes) + 1 : 8412;

    const sampleData = [
      {
        'Center Code': String(nextCode),
        'Center Name': 'National Public School',
        'City': sampleCity1,
        'Address': 'Vijayanagar 2nd Stage, Main Ring Road',
      },
      {
        'Center Code': String(nextCode + 1),
        'Center Name': 'Vidya Vardhaka College of Engineering',
        'City': sampleCity1,
        'Address': 'Gokulam 3rd Stage',
      },
      {
        'Center Code': String(nextCode + 2),
        'Center Name': 'St. Joseph Central School',
        'City': sampleCity2,
        'Address': 'Jayalakshmipuram',
      },
      {
        'Center Code': String(nextCode + 3),
        'Center Name': 'Government PU College',
        'City': sampleCity1,
        'Address': 'Kuvempunagar',
      },
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);

    // Apply header styling
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '1D4ED8' } },
      alignment: { horizontal: 'center', vertical: 'center' },
    };

    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:D5');
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (ws[cellAddress]) {
        ws[cellAddress].s = headerStyle;
      }
    }

    ws['!cols'] = [
      { wch: 16 }, // Center Code
      { wch: 38 }, // Center Name
      { wch: 18 }, // City
      { wch: 42 }, // Address
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Exam Center Template');
    XLSX.writeFile(wb, 'Exam_Center_Bulk_Upload_Template.xlsx');
  };

  // Helper to safely get field values by alternative headers
  const getFieldValue = (row: any, possibleKeys: string[]): string => {
    for (const key of possibleKeys) {
      if (row[key] !== undefined && row[key] !== null) {
        return String(row[key]).trim();
      }
      const foundKey = Object.keys(row).find((k) => k.toLowerCase().trim() === key.toLowerCase().trim());
      if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null) {
        return String(row[foundKey]).trim();
      }
    }
    return '';
  };

  // 2. Process and Parse File
  const processFile = (file: File) => {
    setSelectedFile(file);
    setParseError(null);
    setUploadResult(null);

    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileName = file.name.toLowerCase();
    const isValidExtension = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValidExtension) {
      setParseError('Please upload a valid Excel spreadsheet (.xlsx, .xls) or CSV (.csv) file.');
      setParsedRows([]);
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });

        if (!wb.SheetNames || wb.SheetNames.length === 0) {
          throw new Error('The uploaded spreadsheet contains no sheets.');
        }

        const ws = wb.Sheets[wb.SheetNames[0]];
        const rawJson: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          throw new Error('The file appears to be empty. Please fill in center rows before uploading.');
        }

        // City map for matching
        const cityMapByName = new Map<string, City>();
        existingCities.forEach((city) => {
          cityMapByName.set(city.name.toLowerCase().trim(), city);
        });

        const defaultCity = existingCities.length > 0 ? existingCities[0] : null;

        // Existing Center codes for duplicate detection
        const existingCodeSet = new Set(existingCenters.map((c) => c.centerCode.toLowerCase().trim()));

        const parsed: ParsedCenterRow[] = rawJson.map((row) => {
          const centerCode = getFieldValue(row, [
            'Center Code',
            'Centre Code',
            'Code',
            'CenterCode',
            'CentreCode',
            'Exam Center Code',
            'ID',
          ]);
          const centerName = getFieldValue(row, [
            'Center Name',
            'Centre Name',
            'Name',
            'CenterName',
            'CentreName',
            'Exam Center Name',
            'School Name',
            'College Name',
            'Institution',
          ]);
          const cityName = getFieldValue(row, ['City', 'Assigned City', 'City Name', 'Location', 'Place']);
          const address = getFieldValue(row, ['Address', 'Center Address', 'Location Details', 'Street', 'Area']);

          // Match city
          let matchedCity = cityName ? cityMapByName.get(cityName.toLowerCase()) : null;
          if (!matchedCity && cityName) {
            // Try fuzzy matching (e.g. "Mysuru" vs "Mysore")
            const found = existingCities.find(
              (c) =>
                c.name.toLowerCase().includes(cityName.toLowerCase()) ||
                cityName.toLowerCase().includes(c.name.toLowerCase()),
            );
            if (found) matchedCity = found;
          }

          if (!matchedCity && defaultCity) {
            matchedCity = defaultCity;
          }

          let status: 'valid' | 'duplicate' | 'invalid' = 'valid';
          let validationMessage = '';

          if (!centerCode || !centerName) {
            status = 'invalid';
            const missing = [];
            if (!centerCode) missing.push('Center Code');
            if (!centerName) missing.push('Center Name');
            validationMessage = `Missing: ${missing.join(', ')}`;
          } else if (existingCodeSet.has(centerCode.toLowerCase())) {
            status = 'duplicate';
            validationMessage = `Center Code "${centerCode}" already exists in database.`;
          } else if (!matchedCity) {
            status = 'invalid';
            validationMessage = `City "${cityName || 'unspecified'}" not recognized. Please add city first.`;
          }

          return {
            centerCode,
            centerName,
            cityName: matchedCity?.name || cityName || 'Unassigned',
            cityId: matchedCity?.id || '',
            address: address || undefined,
            status,
            validationMessage,
          };
        });

        // Check duplicates within the file itself
        const seenInFile = new Set<string>();
        parsed.forEach((item) => {
          if (item.status === 'valid') {
            const key = item.centerCode.toLowerCase();
            if (seenInFile.has(key)) {
              item.status = 'duplicate';
              item.validationMessage = `Duplicate Center Code in this file.`;
            } else {
              seenInFile.add(key);
            }
          }
        });

        // Automatically filter out duplicates
        const duplicates = parsed.filter((r) => r.status === 'duplicate');
        const nonDuplicates = parsed.filter((r) => r.status !== 'duplicate');

        setRemovedDuplicatesCount(duplicates.length);

        if (nonDuplicates.length === 0 && duplicates.length > 0) {
          setParseError(
            `All ${duplicates.length} exam center record(s) in this file already exist in the database or are duplicates.`,
          );
        }

        setParsedRows(nonDuplicates);
      } catch (err: any) {
        console.error('File parsing error:', err);
        setParseError(err.message || 'Failed to parse file. Please upload a valid .xlsx or .csv file.');
        setParsedRows([]);
        setRemovedDuplicatesCount(0);
      }
    };

    reader.onerror = () => {
      setParseError('Failed to read file from local disk.');
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setParsedRows([]);
    setRemovedDuplicatesCount(0);
    setParseError(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 3. Submit Valid Rows
  const validRows = parsedRows.filter((r) => r.status === 'valid');

  const handleUploadSubmit = async () => {
    if (validRows.length === 0) return;

    setUploading(true);
    setUploadProgress({ current: 0, total: validRows.length });
    const errors: string[] = [];
    let successCount = 0;

    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i];
      setUploadProgress({ current: i + 1, total: validRows.length });

      try {
        await masterService.createCenter({
          centerCode: row.centerCode,
          centerName: row.centerName,
          cityId: row.cityId,
          address: row.address,
        });
        successCount++;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message || err.message || `Failed to create center ${row.centerName} (${row.centerCode})`;
        errors.push(`${row.centerName} (${row.centerCode}): ${errorMsg}`);
      }
    }

    setUploadResult({
      successCount,
      failureCount: errors.length,
      errors,
    });
    setUploading(false);

    if (successCount > 0) {
      onSuccess();
    }
  };

  return createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <div
        className="modal-content-card animate-fade-in"
        style={{
          maxWidth: '820px',
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          padding: '28px 26px',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748B',
            transition: 'background-color 0.2s',
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <School size={24} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>
              Bulk Upload Exam Centers
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#64748B' }}>
              Upload an Excel (.xlsx, .xls) or CSV (.csv) file to register multiple exam centers across cities at once.
            </p>
          </div>
        </div>

        {/* Download Template Action Bar */}
        <div
          style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileSpreadsheet size={20} color="#2563EB" />
            <span style={{ fontSize: '14px', color: '#334155', fontWeight: 500 }}>
              Need the format? Download our pre-formatted spreadsheet template:
            </span>
          </div>
          <button
            type="button"
            onClick={handleDownloadTemplate}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#1E293B',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = '#2563EB')}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = '#CBD5E1')}
          >
            <Download size={15} color="#2563EB" />
            <span>Download Template (.xlsx)</span>
          </button>
        </div>

        {/* Upload Zone */}
        {!selectedFile ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? '#2563EB' : '#CBD5E1'}`,
              backgroundColor: isDragging ? '#EFF6FF' : '#FAFAFA',
              borderRadius: '14px',
              padding: '36px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Upload size={24} />
            </div>
            <div>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>
                Click to browse or drag &amp; drop your spreadsheet here
              </span>
              <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#64748B' }}>
                Supports Microsoft Excel (.xlsx, .xls) and Comma-Separated Values (.csv)
              </p>
            </div>
          </div>
        ) : (
          /* File Uploaded Header & Info */
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#F1F5F9',
              padding: '12px 16px',
              borderRadius: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FileSpreadsheet size={24} color="#059669" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{selectedFile.name}</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  {(selectedFile.size / 1024).toFixed(1)} KB • {parsedRows.length} center(s) found
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleReset}
              disabled={uploading}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#EF4444',
                fontSize: '13px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
              }}
            >
              <Trash2 size={15} />
              <span>Change File</span>
            </button>
          </div>
        )}

        {/* Parse Error Banner */}
        {parseError && (
          <div
            style={{
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '10px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#B91C1C',
              fontSize: '13.5px',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{parseError}</span>
          </div>
        )}

        {/* Removed Duplicates Notice */}
        {removedDuplicatesCount > 0 && (
          <div
            style={{
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: '10px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#92400E',
              fontSize: '13px',
            }}
          >
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>
              <strong>{removedDuplicatesCount} duplicate center code(s)</strong> already existed in the database and were automatically excluded.
            </span>
          </div>
        )}

        {/* Parsed Rows Preview Table */}
        {parsedRows.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>
                Preview Upload Entries ({validRows.length} Valid of {parsedRows.length})
              </span>
              <span style={{ fontSize: '12px', color: '#64748B' }}>
                Review before submitting to database
              </span>
            </div>

            <div
              style={{
                maxHeight: '220px',
                overflowY: 'auto',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead style={{ background: '#F8FAFC', position: 'sticky', top: 0, zIndex: 1, borderBottom: '1px solid #E2E8F0' }}>
                  <tr>
                    <th style={{ padding: '9px 12px', fontWeight: 600, color: '#475569' }}>#</th>
                    <th style={{ padding: '9px 12px', fontWeight: 600, color: '#475569' }}>CODE</th>
                    <th style={{ padding: '9px 12px', fontWeight: 600, color: '#475569' }}>CENTER NAME</th>
                    <th style={{ padding: '9px 12px', fontWeight: 600, color: '#475569' }}>CITY</th>
                    <th style={{ padding: '9px 12px', fontWeight: 600, color: '#475569' }}>ADDRESS</th>
                    <th style={{ padding: '9px 12px', fontWeight: 600, color: '#475569' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.map((row, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        background: row.status === 'valid' ? '#FFFFFF' : '#FEF2F2',
                      }}
                    >
                      <td style={{ padding: '8px 12px', color: '#64748B' }}>{idx + 1}</td>
                      <td style={{ padding: '8px 12px', fontWeight: 700, color: '#2563EB' }}>{row.centerCode}</td>
                      <td style={{ padding: '8px 12px', fontWeight: 600, color: '#0F172A' }}>{row.centerName}</td>
                      <td style={{ padding: '8px 12px', color: '#334155' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <MapPin size={12} color="#64748B" /> {row.cityName}
                        </span>
                      </td>
                      <td style={{ padding: '8px 12px', color: '#64748B' }}>{row.address || '—'}</td>
                      <td style={{ padding: '8px 12px' }}>
                        {row.status === 'valid' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#16A34A', fontWeight: 600, fontSize: '12px' }}>
                            <CheckCircle2 size={14} /> Ready
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#DC2626', fontWeight: 600, fontSize: '12px' }} title={row.validationMessage}>
                            <AlertCircle size={14} /> {row.validationMessage || 'Invalid'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Upload Progress Bar */}
        {uploading && (
          <div style={{ background: '#EFF6FF', padding: '14px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, color: '#1E40AF' }}>
              <span>Uploading exam centers to database...</span>
              <span>{uploadProgress.current} of {uploadProgress.total}</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#DBEAFE', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background: '#2563EB',
                  width: `${(uploadProgress.current / (uploadProgress.total || 1)) * 100}%`,
                  transition: 'width 0.2s ease',
                }}
              />
            </div>
          </div>
        )}

        {/* Upload Results Summary Banner */}
        {uploadResult && (
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              background: uploadResult.failureCount === 0 ? '#F0FDF4' : '#FEF2F2',
              border: `1px solid ${uploadResult.failureCount === 0 ? '#BBF7D0' : '#FECACA'}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: uploadResult.failureCount === 0 ? '#166534' : '#991B1B' }}>
              {uploadResult.failureCount === 0 ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>
                Upload Complete: {uploadResult.successCount} center(s) successfully registered
                {uploadResult.failureCount > 0 && `, ${uploadResult.failureCount} failed`}.
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#334155',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {uploadResult ? 'Done / Close' : 'Cancel'}
          </button>

          {!uploadResult && (
            <button
              type="button"
              onClick={handleUploadSubmit}
              disabled={uploading || validRows.length === 0}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: validRows.length === 0 ? '#94A3B8' : '#2563EB',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 700,
                cursor: validRows.length === 0 ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.15s ease',
              }}
            >
              {uploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={16} />
                  <span>Register {validRows.length} Center(s)</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default BulkUploadCenterModal;

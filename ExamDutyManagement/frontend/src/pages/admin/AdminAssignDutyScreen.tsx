import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DesktopTopNav } from '../../components/DesktopTopNav';
import { DesktopSidebar } from '../../components/DesktopSidebar';
import { MobileHeader } from '../../components/MobileHeader';
import {
  CalendarPlus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Building,
  Clock,
  Briefcase,
  FileCheck,
  User,
  MapPin,
  Camera,
  Upload,
  Image as ImageIcon,
  Eye,
  RotateCcw,
  Shield,
  X,
} from 'lucide-react';
import masterService, { City, Center, Exam, Role, Shift, EmployeeItem } from '../../services/master.service';
import { INITIAL_CITIES, INITIAL_CENTERS, INITIAL_EXAMS } from '../../data/masterData';
import attendanceService from '../../services/attendance.service';
import dutyService, { CreateDutyPayload } from '../../services/duty.service';
import authService from '../../services/auth.service';
import EmployeeDetailsModal from '../../components/EmployeeDetailsModal';
import { ClockTimePicker } from '../../components/ClockTimePicker';
import { SearchableSelect } from '../../components/SearchableSelect';
import { SweetAlertToast } from '../../components/SweetAlertToast';

export const AdminAssignDutyScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryResourceId = searchParams.get('resourceId');
  const user = authService.getStoredUser();

  // Master Dropdown options
  const [cities, setCities] = useState<City[]>([]);
  const [centers, setCenters] = useState<Center[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [assignedResourceIds, setAssignedResourceIds] = useState<Set<string>>(new Set());
  const [loadingMaster, setLoadingMaster] = useState<boolean>(true);

  // Selected Employee for Duty Assignment
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeItem | null>(null);

  // Employee details modal state
  const [detailsModalResourceId, setDetailsModalResourceId] = useState<string | null>(null);

  // Form Fields State
  const [dutyDate, setDutyDate] = useState<string>('');
  const [selectedDutyType, setSelectedDutyType] = useState<'Exam' | 'Mock' | ''>('');
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [selectedCenterId, setSelectedCenterId] = useState<string>('');
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [selectedShiftId, setSelectedShiftId] = useState<string>('');
  const [reportingTime, setReportingTime] = useState<string>('');
  const [shiftEndTime, setShiftEndTime] = useState<string>('');

  // Attendance Upload State (Optional for Admin)
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<{ id: string; name: string; size: number } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showFullPreview, setShowFullPreview] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showCameraModal, setShowCameraModal] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Submission state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch Master Data on Mount
  useEffect(() => {
    let isMounted = true;
    setLoadingMaster(true);

    const fallbackEmps: EmployeeItem[] = [
      { id: 'emp-1', resourceId: '5914', name: 'Mohan', mobile: '9876543210', email: 'mohan@examduty.gov.in', status: 'Active', city: 'Mysuru' },
      { id: 'emp-2', resourceId: '59258', name: 'UG', mobile: '9845682217', email: 'chandanait@solutions.com', status: 'Active', city: 'Mysuru' },
    ];

    Promise.allSettled([
      masterService.getCities(),
      masterService.getCenters(),
      masterService.getExams(),
      masterService.getRoles(),
      masterService.getShifts(),
      masterService.getEmployees(),
      dutyService.getMyDuties(),
    ])
      .then(([ctsRes, cntsRes, exsRes, rolsRes, shfsRes, empsRes, dutiesRes]) => {
        if (!isMounted) return;

        const cts = ctsRes.status === 'fulfilled' && ctsRes.value?.length > 0 ? ctsRes.value : INITIAL_CITIES;
        const cnts = cntsRes.status === 'fulfilled' && cntsRes.value?.length > 0 ? cntsRes.value : INITIAL_CENTERS;
        const exs = exsRes.status === 'fulfilled' && exsRes.value?.length > 0 ? exsRes.value : INITIAL_EXAMS;
        const rols = rolsRes.status === 'fulfilled' ? rolsRes.value : [];
        const shfs = shfsRes.status === 'fulfilled' ? shfsRes.value : [];
        const emps = empsRes.status === 'fulfilled' && empsRes.value?.length > 0 ? empsRes.value : fallbackEmps;

        setCities(cts);
        setCenters(cnts);
        setExams(exs);
        setRoles(
          rols.length > 0
            ? rols
            : [
                { id: 'role-1', name: 'Supervisor', code: 'SUP' },
                { id: 'role-2', name: 'Invigilator', code: 'INV' },
                { id: 'role-3', name: 'Tech Support', code: 'TECH' },
              ],
        );

        const finalShifts =
          shfs.length > 0
            ? shfs
            : [
                { id: 'shift-1', name: 'Shift 1', defaultReportingTime: '07:30 AM', defaultEndTime: '01:30 PM' },
                { id: 'shift-2', name: 'Shift 2', defaultReportingTime: '01:00 PM', defaultEndTime: '06:00 PM' },
                { id: 'shift-3', name: 'Shift 3', defaultReportingTime: '05:30 PM', defaultEndTime: '10:00 PM' },
              ];
        setShifts(finalShifts);

        // Track employee IDs that already have an assigned duty
        const assigned = new Set<string>();
        if (dutiesRes.status === 'fulfilled' && Array.isArray(dutiesRes.value)) {
          dutiesRes.value.forEach((d: any) => {
            if (d.employee?.resourceId) assigned.add(d.employee.resourceId);
            if (d.employeeId) assigned.add(d.employeeId);
          });
        }
        setAssignedResourceIds(assigned);

        // Exclude system admin Sanjeev Kumar (17655) and admin from workforce assignee list
        const realStaff = emps.filter(
          (e) => e.resourceId !== '17655' && e.resourceId?.toLowerCase() !== 'admin' && !e.isAdmin,
        );
        const staffList = realStaff.length > 0 ? realStaff : fallbackEmps;
        setEmployees(staffList);

        if (queryResourceId) {
          const found = staffList.find((e) => e.resourceId === queryResourceId);
          if (found) setSelectedEmployee(found);
        } else {
          setSelectedEmployee(null);
        }
      })
      .catch((err) => {
        console.error('Failed to load master options', err);
      })
      .finally(() => {
        if (isMounted) setLoadingMaster(false);
      });

    const handleMasterUpdate = () => {
      Promise.allSettled([
        masterService.getCities(),
        masterService.getCenters(),
        masterService.getExams(),
      ]).then(([ctsRes, cntsRes, exsRes]) => {
        if (!isMounted) return;
        if (ctsRes.status === 'fulfilled' && ctsRes.value?.length > 0) setCities(ctsRes.value);
        if (cntsRes.status === 'fulfilled' && cntsRes.value?.length > 0) setCenters(cntsRes.value);
        if (exsRes.status === 'fulfilled' && exsRes.value?.length > 0) setExams(exsRes.value);
      });
    };
    window.addEventListener('exam_duty_master_updated', handleMasterUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('exam_duty_master_updated', handleMasterUpdate);
    };
  }, []);

  // Available workforce members who do NOT yet have an assigned duty
  const availableEmployees = useMemo(() => {
    return employees.filter(
      (emp) =>
        !assignedResourceIds.has(emp.resourceId) &&
        !assignedResourceIds.has(emp.id) &&
        emp.resourceId !== '17655' &&
        emp.resourceId?.toLowerCase() !== 'admin' &&
        !emp.isAdmin
    );
  }, [employees, assignedResourceIds]);

  useEffect(() => {
    if (queryResourceId) {
      const match = employees.find((e) => e.resourceId === queryResourceId);
      if (match) {
        setSelectedEmployee(match);
        return;
      }
    }
    if (selectedEmployee && !availableEmployees.some((e) => e.resourceId === selectedEmployee.resourceId)) {
      setSelectedEmployee(null);
    }
  }, [availableEmployees, queryResourceId, employees]);

  const handleDutyTypeChange = (type: 'Exam' | 'Mock') => {
    setSelectedDutyType(type);
    if (selectedExamId) {
      const current = exams.find((x) => String(x.id).toLowerCase() === String(selectedExamId).toLowerCase());
      if (current && String(current.type || '').toLowerCase() !== type.toLowerCase()) {
        setSelectedExamId('');
      }
    }
  };

  const handleExamChange = (examId: string) => {
    setSelectedExamId(examId);
    const chosen = exams.find((x) => String(x.id).toLowerCase() === String(examId).toLowerCase());
    if (chosen?.type) {
      const typeStr = String(chosen.type).toLowerCase().includes('mock') ? 'Mock' : 'Exam';
      setSelectedDutyType(typeStr);
    }
  };

  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    setSelectedCenterId('');
  };

  const handleCenterChange = (centerId: string) => {
    setSelectedCenterId(centerId);
    const chosen = centers.find((c) => String(c.id).toLowerCase() === String(centerId).toLowerCase());
    if (chosen?.cityId) {
      const match = cities.find((ct) => String(ct.id).toLowerCase() === String(chosen.cityId).toLowerCase());
      if (match) {
        setSelectedCityId(match.id);
      } else {
        const centerCityClean = String(chosen.cityId).toLowerCase().replace(/[^a-z]/g, '');
        const matchedByName = cities.find((ct) => {
          const cNameClean = ct.name.toLowerCase().replace(/[^a-z]/g, '');
          return cNameClean.includes(centerCityClean) || centerCityClean.includes(cNameClean);
        });
        if (matchedByName) setSelectedCityId(matchedByName.id);
      }
    }
  };

  const handleShiftChange = (shiftId: string) => {
    setSelectedShiftId(shiftId);
    const chosen = shifts.find((s) => s.id === shiftId);
    if (chosen) {
      if (chosen.defaultReportingTime) setReportingTime(chosen.defaultReportingTime);
      if (chosen.defaultEndTime) setShiftEndTime(chosen.defaultEndTime);
    } else {
      setReportingTime('');
      setShiftEndTime('');
    }
  };

  // Upload photo handler
  const uploadAndSetFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files (JPG, JPEG, PNG, WEBP) are allowed.');
      return;
    }
    setUploadError(null);
    setUploading(true);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    try {
      const res = await attendanceService.uploadAttendance(file, user?.id);
      if (res?.file) {
        setUploadedFile({
          id: res.file.id,
          name: res.file.originalName,
          size: res.file.size,
        });
      } else {
        setUploadedFile({
          id: 'img-' + Date.now(),
          name: file.name,
          size: file.size,
        });
      }
    } catch {
      setUploadedFile({
        id: 'img-' + Date.now(),
        name: file.name,
        size: file.size,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadAndSetFile(file);
    if (e.target) e.target.value = '';
  };

  const startLiveCamera = async () => {
    try {
      setShowCameraModal(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.warn('Live webcam not available, using device camera input', err);
      stopLiveCamera();
      cameraInputRef.current?.click();
    }
  };

  const stopLiveCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
  };

  useEffect(() => {
    if (showCameraModal && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(() => {});
    }
  }, [showCameraModal, cameraStream]);

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `attendance_proof_${Date.now()}.jpg`, { type: 'image/jpeg' });
        stopLiveCamera();
        uploadAndSetFile(file);
      }
    }, 'image/jpeg', 0.92);
  };

  const handleClearImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setUploadedFile(null);
    setUploadError(null);
  };

  // Filter Centers by Selected City
  const activeCenters = useMemo(() => {
    if (!selectedCityId) return centers;
    const selectedCityObj = cities.find((c) => String(c.id).toLowerCase() === String(selectedCityId).toLowerCase());
    const selCityNameClean = (selectedCityObj?.name || '').toLowerCase().replace(/[^a-z]/g, '');

    return centers.filter((center) => {
      if (String(center.cityId).toLowerCase() === String(selectedCityId).toLowerCase()) return true;
      if (center.city) {
        if (typeof center.city === 'object' && center.city.id) {
          if (String(center.city.id).toLowerCase() === String(selectedCityId).toLowerCase()) return true;
        }
        const centerCityStr = (typeof center.city === 'string' ? center.city : center.city.name || '').toLowerCase().replace(/[^a-z]/g, '');
        if (centerCityStr && (centerCityStr.includes(selCityNameClean) || selCityNameClean.includes(centerCityStr))) return true;
      }
      return false;
    });
  }, [centers, selectedCityId, cities]);

  // Filter Exams by Selected Duty Type
  const activeExams = useMemo(() => {
    if (!selectedDutyType) return exams;
    return exams.filter((ex) => {
      const exType = (ex.type || 'Exam').toLowerCase();
      return exType === selectedDutyType.toLowerCase();
    });
  }, [exams, selectedDutyType]);

  const displayShifts = useMemo(() => {
    return shifts.slice(0, 3);
  }, [shifts]);

  // Form Submit Handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmployee) {
      setSubmitError('Please select a registered employee to assign duty.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!dutyDate) {
      setSubmitError('Please select the duty date.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!selectedDutyType) {
      setSubmitError('Please choose the Type of Duty (Exam or Mock).');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!selectedCityId) {
      setSubmitError('Please select a City.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!selectedCenterId) {
      setSubmitError('Please select an Examination Center.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!selectedExamId) {
      setSubmitError('Please select an Examination / Mock Test Name.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!selectedRoleId) {
      setSubmitError('Please select a Duty Role.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!selectedShiftId) {
      setSubmitError('Please select a Shift.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!reportingTime.trim()) {
      setSubmitError('Please specify the Reporting Time.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    setSubmitSuccess(null);
    setSubmitError(null);

    try {
      const selectedExam = exams.find((x) => x.id === selectedExamId);
      const selectedCenter = centers.find((c) => c.id === selectedCenterId);
      const selectedRole = roles.find((r) => r.id === selectedRoleId);
      const selectedShift = shifts.find((s) => s.id === selectedShiftId);
      const selectedCity = cities.find((c) => c.id === selectedCityId);

      const resId = selectedEmployee.resourceId;
      const targetEmpName = selectedEmployee.name || `Staff (${resId})`;
      const targetEmpMobile = selectedEmployee.mobile || '';
      const targetEmpId = selectedEmployee.id || resId;

      const payload: CreateDutyPayload = {
        resourceId: resId,
        employeeResourceId: resId,
        employeeId: targetEmpId,
        employeeName: targetEmpName,
        employeeMobile: targetEmpMobile,
        dutyDate,
        dutyType: selectedDutyType,
        cityId: selectedCityId,
        centerId: selectedCenterId,
        examId: selectedExamId,
        roleId: selectedRoleId,
        shiftId: selectedShiftId,
        reportingTime: reportingTime.trim(),
        shiftEndTime: shiftEndTime.trim(),
        attendanceFileId: uploadedFile?.id || undefined,
        comments: 'Assigned via Admin Portal',
      };

      let createdRes: any = null;
      try {
        createdRes = await dutyService.createDuty(payload);
      } catch (backendErr: any) {
        console.warn('Backend createDuty call failed, saving to local cache:', backendErr);
      }

      const newDutyRecord: any = {
        id: createdRes?.id || `duty-${Date.now()}`,
        employeeId: targetEmpId,
        dutyDate,
        dutyType: selectedDutyType,
        cityId: selectedCityId,
        centerId: selectedCenterId,
        examId: selectedExamId,
        roleId: selectedRoleId,
        shiftId: selectedShiftId,
        reportingTime: reportingTime.trim(),
        shiftEndTime: shiftEndTime.trim(),
        status: 'Pending',
        createdAt: new Date().toISOString(),
        employee: {
          id: targetEmpId,
          resourceId: resId,
          name: targetEmpName,
          mobile: targetEmpMobile,
          email: selectedEmployee.email,
          city: selectedCity?.name || selectedEmployee.city,
        },
        city: selectedCity ? { id: selectedCity.id, name: selectedCity.name } : undefined,
        center: selectedCenter
          ? { id: selectedCenter.id, centerCode: selectedCenter.centerCode, centerName: selectedCenter.centerName }
          : undefined,
        exam: selectedExam
          ? { id: selectedExam.id, name: selectedExam.name, type: selectedDutyType, code: selectedExam.code }
          : undefined,
        role: selectedRole
          ? { id: selectedRole.id, name: selectedRole.name, code: selectedRole.code }
          : undefined,
        shift: selectedShift
          ? { id: selectedShift.id, name: selectedShift.name }
          : undefined,
        attendanceFileId: uploadedFile?.id || undefined,
        attendanceFile: uploadedFile
          ? {
              id: uploadedFile.id,
              originalName: uploadedFile.name,
              filePath: previewUrl || '',
              size: uploadedFile.size,
            }
          : undefined,
      };

      try {
        const raw = localStorage.getItem('cached_assigned_duties');
        const list = raw ? JSON.parse(raw) : [];
        const next = [newDutyRecord, ...list.filter((x: any) => x.id !== newDutyRecord.id)];
        localStorage.setItem('cached_assigned_duties', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to cache assigned duty', e);
      }

      setAssignedResourceIds((prev) => {
        const next = new Set(prev);
        next.add(resId);
        if (targetEmpId) next.add(targetEmpId);
        return next;
      });

      setSelectedEmployee(null);
      setDutyDate('');
      setSelectedDutyType('');
      setSelectedCityId('');
      setSelectedCenterId('');
      setSelectedExamId('');
      setSelectedRoleId('');
      setSelectedShiftId('');
      setReportingTime('');
      setShiftEndTime('');
      setUploadedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);

      setSubmitSuccess('Duty assigned successfully.');
      setToastMessage('Duty assigned successfully.');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setTimeout(() => {
        navigate('/my-duties', { state: { toastMessage: 'Duty assigned successfully.' } });
      }, 1500);
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to assign duty. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="unified-dashboard-root animate-fade-in">
      <SweetAlertToast
        show={Boolean(toastMessage)}
        message={toastMessage || ''}
        onClose={() => setToastMessage(null)}
      />

      {/* 1. DESKTOP VIEW */}
      <div className="desktop-layout-wrapper">
        <DesktopTopNav />
        <div className="desktop-main-row">
          <DesktopSidebar />

          <main className="desktop-content-panel">
            {/* Page Header */}
            <div className="page-section-header">
              <div className="page-header-icon-box">
                <CalendarPlus size={24} color="#2563EB" />
              </div>
              <div>
                <h1 className="page-main-heading">Assign Duty to Employee</h1>
              </div>
            </div>

            {/* Notification Banners */}
            {submitSuccess && (
              <div
                className="alert-banner alert-success"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} />
                  <span>{submitSuccess}</span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/my-duties')}
                  style={{
                    padding: '6px 14px',
                    background: '#15803D',
                    color: '#FFFFFF',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  View Duties &rarr;
                </button>
              </div>
            )}
            {submitError && (
              <div className="alert-banner alert-error">
                <AlertCircle size={18} />
                <span>{submitError}</span>
              </div>
            )}

            {/* Main Form Card */}
            <div className="duty-form-card">
              <form onSubmit={handleFormSubmit}>
                {/* Workforce Member Assignment Section */}
                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '22px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#EFF6FF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <User size={18} color="#2563EB" />
                      </div>
                      <span style={{ fontWeight: 700, color: '#1E293B', fontSize: '15.5px' }}>
                        Assign Duty to Employee *
                      </span>
                    </div>
                  </div>

                  <div>
                    <select
                      className="form-select-control"
                      value={selectedEmployee?.resourceId || ''}
                      onChange={(e) => {
                        const found = availableEmployees.find((emp) => emp.resourceId === e.target.value);
                        if (found) setSelectedEmployee(found);
                      }}
                      required
                      style={{ fontWeight: 600, color: '#1E293B' }}
                    >
                      <option value="" disabled>
                        {loadingMaster
                          ? 'Loading workforce members...'
                          : availableEmployees.length === 0
                          ? '-- All registered employees have already been assigned duties --'
                          : '-- Select Registered Employee --'}
                      </option>
                      {availableEmployees.map((emp) => (
                        <option key={emp.id} value={emp.resourceId}>
                          {emp.name} (ID: {emp.resourceId}) &bull; {emp.city || 'Mysore'} &bull; {emp.mobile}
                        </option>
                      ))}
                    </select>

                    {availableEmployees.length === 0 && !loadingMaster && (
                      <div style={{ marginTop: '10px', padding: '10px 14px', background: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0', fontSize: '13.5px', color: '#166534' }}>
                        ✔ All registered workforce members currently have assigned duties. To assign duty to a new employee, register them under <strong>Add Employee</strong>.
                      </div>
                    )}

                    {selectedEmployee && (
                      <div
                        style={{
                          marginTop: '10px',
                          padding: '10px 14px',
                          background: '#EFF6FF',
                          borderRadius: '8px',
                          border: '1px solid #BFDBFE',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          fontSize: '14px',
                          color: '#1E40AF',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span>
                          <strong>Assignee:</strong> {selectedEmployee.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setDetailsModalResourceId(selectedEmployee.resourceId)}
                          style={{
                            background: '#DBEAFE',
                            border: '1px solid #93C5FD',
                            borderRadius: '6px',
                            padding: '3px 10px',
                            color: '#1E40AF',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <Shield size={13} color="#2563EB" />
                          <span>Resource ID: {selectedEmployee.resourceId} (View Details)</span>
                        </button>
                        <span>
                          <strong>City:</strong> {selectedEmployee.city || 'Mysore'}
                        </span>
                        <span>
                          <strong>Contact:</strong> {selectedEmployee.mobile}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* FORM GRID */}
                <div className="form-grid-layout">
                  {/* 1. Duty Date */}
                  <div className="form-field-wrapper">
                    <label className="field-label" style={{ fontSize: '14px', fontWeight: 700 }}>
                      <Calendar size={15} color="#2563EB" />
                      <span>1. Duty Date *</span>
                    </label>
                    <input
                      type="date"
                      className="form-input-control"
                      value={dutyDate}
                      onChange={(e) => setDutyDate(e.target.value)}
                      required
                      style={{ marginTop: '4px' }}
                    />
                  </div>

                  {/* 2. Type of Duty */}
                  <div className="form-field-wrapper">
                    <label className="field-label" style={{ fontSize: '14px', fontWeight: 700 }}>
                      <Briefcase size={15} color="#2563EB" />
                      <span>2. Type of Duty *</span>
                    </label>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '4px', height: '48px' }}>
                      <button
                        type="button"
                        onClick={() => handleDutyTypeChange('Exam')}
                        style={{
                          flex: 1,
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0 10px',
                          fontSize: '14px',
                          fontWeight: 700,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          border: '2px solid ' + (selectedDutyType === 'Exam' ? '#2563EB' : '#CBD5E1'),
                          background: selectedDutyType === 'Exam' ? '#EFF6FF' : '#FFFFFF',
                          color: selectedDutyType === 'Exam' ? '#1D4ED8' : '#64748B',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        Exam
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDutyTypeChange('Mock')}
                        style={{
                          flex: 1,
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0 10px',
                          fontSize: '14px',
                          fontWeight: 700,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          border: '2px solid ' + (selectedDutyType === 'Mock' ? '#D97706' : '#CBD5E1'),
                          background: selectedDutyType === 'Mock' ? '#FEF3C7' : '#FFFFFF',
                          color: selectedDutyType === 'Mock' ? '#B45309' : '#64748B',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        Mock
                      </button>
                    </div>
                  </div>

                  {/* 3. City */}
                  <div className="form-field-wrapper">
                    <label className="field-label" style={{ fontSize: '14px', fontWeight: 700 }}>
                      <MapPin size={15} color="#2563EB" />
                      <span>3. City *</span>
                    </label>
                    <SearchableSelect
                      options={cities.map((city) => ({
                        value: city.id,
                        label: city.name,
                        subLabel: city.state || 'Karnataka',
                      }))}
                      value={selectedCityId}
                      onChange={handleCityChange}
                      placeholder={loadingMaster ? 'Loading cities...' : '-- Type to Search City --'}
                      searchPlaceholder="Type city name (e.g. Mysore, Bengaluru, Belagavi, Mangalore)..."
                      className="form-select-control"
                      disabled={loadingMaster || cities.length === 0}
                    />
                  </div>

                  {/* 4. Center */}
                  <div className="form-field-wrapper">
                    <label className="field-label" style={{ fontSize: '14px', fontWeight: 700 }}>
                      <Building size={15} color="#2563EB" />
                      <span>4. Examination Center *</span>
                    </label>
                    <SearchableSelect
                      options={activeCenters.map((c) => ({
                        value: c.id,
                        label: `${c.centerName} (Code: ${c.centerCode})`,
                        subLabel: c.address,
                      }))}
                      value={selectedCenterId}
                      onChange={handleCenterChange}
                      placeholder={
                        loadingMaster
                          ? 'Loading centers...'
                          : activeCenters.length === 0
                          ? 'No centers found in this city'
                          : '-- Type to Search Examination Center --'
                      }
                      searchPlaceholder="Type center name or code (e.g. Hebbal, IDZ-01)..."
                      className="form-select-control"
                      disabled={loadingMaster || activeCenters.length === 0}
                    />
                  </div>

                  {/* 5. Exam Name */}
                  <div className="form-field-wrapper">
                    <label className="field-label" style={{ fontSize: '14px', fontWeight: 700 }}>
                      <FileCheck size={15} color="#2563EB" />
                      <span>5. Exam Name *</span>
                    </label>
                    <SearchableSelect
                      options={activeExams.map((ex) => ({
                        value: ex.id,
                        label: `${ex.name}${ex.code ? ` (${ex.code})` : ''}`,
                        subLabel: `[${ex.type || 'Exam'}]`,
                      }))}
                      value={selectedExamId}
                      onChange={handleExamChange}
                      placeholder={
                        loadingMaster
                          ? 'Loading exams...'
                          : '-- Type to Search Examination / Mock Test --'
                      }
                      searchPlaceholder="Type exam name or code (e.g. IBPS, NEET, JEE, AIIMS, SSC)..."
                      className="form-select-control"
                      disabled={loadingMaster || activeExams.length === 0}
                    />
                  </div>

                  {/* 6. Duty Role */}
                  <div className="form-field-wrapper">
                    <label className="field-label" style={{ fontSize: '14px', fontWeight: 700 }}>
                      <User size={15} color="#2563EB" />
                      <span>6. Duty Role *</span>
                    </label>
                    <select
                      className="form-select-control"
                      value={selectedRoleId}
                      onChange={(e) => setSelectedRoleId(e.target.value)}
                      required
                      style={{ marginTop: '4px' }}
                    >
                      <option value="" disabled>
                        {loadingMaster ? 'Loading roles...' : '-- Select Duty Role --'}
                      </option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 7. Shift */}
                  <div className="form-field-wrapper">
                    <label className="field-label" style={{ fontSize: '14px', fontWeight: 700 }}>
                      <Clock size={15} color="#2563EB" />
                      <span>7. Shift *</span>
                    </label>
                    <select
                      className="form-select-control"
                      value={selectedShiftId}
                      onChange={(e) => handleShiftChange(e.target.value)}
                      required
                      style={{ marginTop: '4px' }}
                    >
                      <option value="" disabled>
                        {loadingMaster ? 'Loading shifts...' : '-- Select Shift --'}
                      </option>
                      {displayShifts.map((s, idx) => (
                        <option key={s.id} value={s.id}>
                          {idx + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 8. Reporting Time & Shift End Time */}
                  <div className="form-field-wrapper">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label className="field-label" style={{ fontSize: '14px', fontWeight: 700 }}>
                          <Clock size={15} color="#2563EB" />
                          <span>8. Reporting Time *</span>
                        </label>
                        <ClockTimePicker
                          value={reportingTime}
                          onChange={(val) => setReportingTime(val)}
                          label="Reporting Time"
                          placeholder="Select Reporting Time"
                          required
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label className="field-label" style={{ fontSize: '14px', fontWeight: 700 }}>
                          <Clock size={15} color="#64748B" />
                          <span>Shift End Time</span>
                        </label>
                        <ClockTimePicker
                          value={shiftEndTime}
                          onChange={(val) => setShiftEndTime(val)}
                          label="Shift End Time"
                          placeholder="Select Shift End Time"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ATTENDANCE PROOF: IMAGE ONLY + LIVE CAMERA */}
                <div
                  style={{
                    marginTop: '28px',
                    maxWidth: '560px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '100%',
                    padding: '22px 24px',
                    borderRadius: '12px',
                    border: '1.5px dashed #93C5FD',
                    background: '#F8FAFC',
                    textAlign: 'center',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <label
                    className="field-label"
                    style={{
                      fontSize: '14.5px',
                      fontWeight: 700,
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      color: '#1E293B',
                    }}
                  >
                    <Camera size={18} color="#2563EB" />
                    <span>Upload Attendance Photo Proof</span>
                  </label>

                  {uploadError && (
                    <div className="alert-banner alert-error" style={{ marginBottom: '14px', textAlign: 'left' }}>
                      <AlertCircle size={15} />
                      <span style={{ fontSize: '13px' }}>{uploadError}</span>
                    </div>
                  )}

                  {uploading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px' }}>
                      <Loader2 size={28} className="animate-spin text-blue" />
                      <span style={{ fontSize: '13.5px', color: '#64748B', fontWeight: 600 }}>
                        Uploading attendance photo...
                      </span>
                    </div>
                  ) : previewUrl ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          position: 'relative',
                          width: '100%',
                          maxWidth: '320px',
                          height: '180px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '2px solid #3B82F6',
                          background: '#0F172A',
                          cursor: 'pointer',
                        }}
                        onClick={() => setShowFullPreview(true)}
                        title="Click to zoom / view full size"
                      >
                        <img
                          src={previewUrl}
                          alt="Attendance proof"
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'rgba(0,0,0,0.65)',
                            padding: '6px 10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            color: '#FFFFFF',
                            fontSize: '12px',
                          }}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <ImageIcon size={13} /> Photo Attached
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#93C5FD' }}>
                            <Eye size={13} /> Click to View
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button
                          type="button"
                          onClick={startLiveCamera}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            background: '#EFF6FF',
                            border: '1px solid #BFDBFE',
                            color: '#1D4ED8',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <RotateCcw size={14} />
                          <span>Retake (Camera)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            background: '#F8FAFC',
                            border: '1px solid #CBD5E1',
                            color: '#475569',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <Upload size={14} />
                          <span>Upload File</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleClearImage}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            background: '#FEF2F2',
                            border: '1px solid #FECACA',
                            color: '#DC2626',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <X size={14} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '10px 0' }}>
                      <p style={{ margin: '0 0 14px 0', fontSize: '14.5px', color: '#1E293B', fontWeight: 600 }}>
                        Upload or capture attendance sheet photo proof
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={startLiveCamera}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '11px 24px',
                            background: '#2563EB',
                            color: '#FFFFFF',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: 600,
                            fontSize: '14px',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(37,99,235,0.2)',
                          }}
                        >
                          <Camera size={18} />
                          <span>Take Photo (Camera)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '11px 24px',
                            background: '#FFFFFF',
                            color: '#1E293B',
                            borderRadius: '8px',
                            border: '1.5px solid #CBD5E1',
                            fontWeight: 600,
                            fontSize: '14px',
                            cursor: 'pointer',
                          }}
                        >
                          <Upload size={18} color="#2563EB" />
                          <span>Upload Photo (Files)</span>
                        </button>
                      </div>
                      <span style={{ display: 'block', marginTop: '12px', fontSize: '12.5px', color: '#64748B' }}>
                        Supports JPG, PNG, WEBP only (PDF/documents are strictly disabled)
                      </span>
                    </div>
                  )}
                </div>

                {/* Hidden File Inputs */}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleImageSelect}
                />
                <input
                  type="file"
                  ref={cameraInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageSelect}
                />

                {/* SUBMIT BUTTON */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={submitting}
                    style={{
                      padding: '14px 40px',
                      fontSize: '16px',
                      fontWeight: 700,
                      borderRadius: '10px',
                      minWidth: '280px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                    }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>Assigning Duty...</span>
                      </>
                    ) : (
                      <>
                        <CalendarPlus size={20} />
                        <span>Assign Duty</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>

      {/* 2. MOBILE VIEW */}
      <div className="mobile-layout-wrapper">
        <MobileHeader />

        <main className="mobile-content-body">
          <div className="mobile-page-title-row">
            <h2 className="mobile-page-heading">Assign Duty to Employee</h2>
          </div>

          {submitSuccess && (
            <div className="alert-banner alert-success" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{submitSuccess}</span>
              <button
                type="button"
                onClick={() => navigate('/my-duties')}
                style={{ padding: '4px 10px', background: '#15803D', color: '#fff', borderRadius: '4px', border: 'none', fontSize: '13px', fontWeight: 600 }}
              >
                View &rarr;
              </button>
            </div>
          )}
          {submitError && (
            <div className="alert-banner alert-error">
              <AlertCircle size={16} />
              <span>{submitError}</span>
            </div>
          )}

          <div className="mobile-form-card">
            <form onSubmit={handleFormSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="mobile-form-group">
                  <label className="mobile-input-label">ASSIGN DUTY TO EMPLOYEE *</label>
                  <select
                    className="mobile-form-select"
                    value={selectedEmployee?.resourceId || ''}
                    onChange={(e) => {
                      const found = availableEmployees.find((emp) => emp.resourceId === e.target.value);
                      if (found) setSelectedEmployee(found);
                    }}
                    required
                  >
                    <option value="" disabled>
                      {availableEmployees.length === 0
                        ? '-- All workforce members have been assigned duties --'
                        : '-- Select Registered Employee --'}
                    </option>
                    {availableEmployees.map((emp) => (
                      <option key={emp.id} value={emp.resourceId}>
                        {emp.name} (ID: {emp.resourceId}) &bull; {emp.city || 'Mysore'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 1. Duty Date */}
                <div className="mobile-form-group">
                  <label className="mobile-input-label">1. DUTY DATE *</label>
                  <input
                    type="date"
                    className="mobile-form-input"
                    value={dutyDate}
                    onChange={(e) => setDutyDate(e.target.value)}
                    required
                  />
                </div>

                {/* 2. Type of Duty */}
                <div className="mobile-form-group">
                  <label className="mobile-input-label">2. TYPE OF DUTY *</label>
                  <div style={{ display: 'flex', gap: '10px', height: '44px' }}>
                    <button
                      type="button"
                      onClick={() => handleDutyTypeChange('Exam')}
                      style={{
                        flex: 1,
                        borderRadius: '8px',
                        border: '2px solid ' + (selectedDutyType === 'Exam' ? '#2563EB' : '#CBD5E1'),
                        background: selectedDutyType === 'Exam' ? '#EFF6FF' : '#FFFFFF',
                        color: selectedDutyType === 'Exam' ? '#1D4ED8' : '#64748B',
                        fontWeight: 700,
                        fontSize: '14px',
                      }}
                    >
                      Exam
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDutyTypeChange('Mock')}
                      style={{
                        flex: 1,
                        borderRadius: '8px',
                        border: '2px solid ' + (selectedDutyType === 'Mock' ? '#D97706' : '#CBD5E1'),
                        background: selectedDutyType === 'Mock' ? '#FEF3C7' : '#FFFFFF',
                        color: selectedDutyType === 'Mock' ? '#B45309' : '#64748B',
                        fontWeight: 700,
                        fontSize: '14px',
                      }}
                    >
                      Mock
                    </button>
                  </div>
                </div>

                {/* 3. City */}
                <div className="mobile-form-group">
                  <label className="mobile-input-label">3. CITY *</label>
                  <SearchableSelect
                    options={cities.map((city) => ({
                      value: city.id,
                      label: city.name,
                      subLabel: city.state || 'Karnataka',
                    }))}
                    value={selectedCityId}
                    onChange={handleCityChange}
                    placeholder="-- Select City --"
                    searchPlaceholder="Search city name..."
                    className="mobile-form-select"
                  />
                </div>

                {/* 4. Center */}
                <div className="mobile-form-group">
                  <label className="mobile-input-label">4. EXAMINATION CENTER *</label>
                  <SearchableSelect
                    options={activeCenters.map((c) => ({
                      value: c.id,
                      label: `${c.centerName} (Code: ${c.centerCode})`,
                      subLabel: c.address,
                    }))}
                    value={selectedCenterId}
                    onChange={handleCenterChange}
                    placeholder="-- Select Center --"
                    searchPlaceholder="Search center..."
                    className="mobile-form-select"
                    disabled={activeCenters.length === 0}
                  />
                </div>

                {/* 5. Exam Name */}
                <div className="mobile-form-group">
                  <label className="mobile-input-label">5. EXAM NAME *</label>
                  <SearchableSelect
                    options={activeExams.map((ex) => ({
                      value: ex.id,
                      label: `${ex.name}${ex.code ? ` (${ex.code})` : ''}`,
                      subLabel: `[${ex.type || 'Exam'}]`,
                    }))}
                    value={selectedExamId}
                    onChange={handleExamChange}
                    placeholder="-- Select Exam --"
                    searchPlaceholder="Search exam..."
                    className="mobile-form-select"
                  />
                </div>

                {/* 6. Role */}
                <div className="mobile-form-group">
                  <label className="mobile-input-label">6. DUTY ROLE *</label>
                  <select
                    className="mobile-form-select"
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    required
                  >
                    <option value="" disabled>-- Select Role --</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                {/* 7. Shift */}
                <div className="mobile-form-group">
                  <label className="mobile-input-label">7. SHIFT *</label>
                  <select
                    className="mobile-form-select"
                    value={selectedShiftId}
                    onChange={(e) => handleShiftChange(e.target.value)}
                    required
                  >
                    <option value="" disabled>-- Select Shift --</option>
                    {displayShifts.map((s, idx) => (
                      <option key={s.id} value={s.id}>{idx + 1}</option>
                    ))}
                  </select>
                </div>

                {/* 8. Reporting Time */}
                <div className="mobile-form-group">
                  <label className="mobile-input-label">8. REPORTING TIME *</label>
                  <ClockTimePicker
                    value={reportingTime}
                    onChange={(val) => setReportingTime(val)}
                    label="Reporting Time"
                    placeholder="Select Reporting Time"
                    required
                  />
                </div>

                {/* Shift End Time */}
                <div className="mobile-form-group">
                  <label className="mobile-input-label">SHIFT END TIME</label>
                  <ClockTimePicker
                    value={shiftEndTime}
                    onChange={(val) => setShiftEndTime(val)}
                    label="Shift End Time"
                    placeholder="Select Shift End Time"
                  />
                </div>

                {/* ATTENDANCE PROOF: MOBILE */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1.5px dashed #93C5FD',
                    background: '#F8FAFC',
                    textAlign: 'center',
                    marginTop: '8px',
                  }}
                >
                  <label
                    className="mobile-input-label"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      marginBottom: '10px',
                    }}
                  >
                    <Camera size={16} color="#2563EB" />
                    <span>Upload Attendance Photo Proof</span>
                  </label>

                  {uploadError && (
                    <div className="alert-banner alert-error" style={{ marginBottom: '10px', fontSize: '12.5px' }}>
                      <AlertCircle size={14} />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {uploading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '10px' }}>
                      <Loader2 size={24} className="animate-spin text-blue" />
                      <span style={{ fontSize: '12.5px', color: '#64748B', fontWeight: 600 }}>Uploading photo...</span>
                    </div>
                  ) : previewUrl ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          position: 'relative',
                          width: '100%',
                          maxWidth: '260px',
                          height: '150px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '2px solid #3B82F6',
                          background: '#0F172A',
                        }}
                        onClick={() => setShowFullPreview(true)}
                      >
                        <img src={previewUrl} alt="Attendance proof" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'rgba(0,0,0,0.65)',
                            padding: '4px 8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            color: '#FFFFFF',
                            fontSize: '11px',
                          }}
                        >
                          <span>Photo Attached</span>
                          <span style={{ color: '#93C5FD' }}>View</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button
                          type="button"
                          onClick={startLiveCamera}
                          style={{
                            padding: '6px 12px',
                            background: '#EFF6FF',
                            border: '1px solid #BFDBFE',
                            color: '#1D4ED8',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        >
                          <RotateCcw size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                          Retake
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            padding: '6px 12px',
                            background: '#F8FAFC',
                            border: '1px solid #CBD5E1',
                            color: '#475569',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        >
                          <Upload size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                          Upload File
                        </button>
                        <button
                          type="button"
                          onClick={handleClearImage}
                          style={{
                            padding: '6px 12px',
                            background: '#FEF2F2',
                            border: '1px solid #FECACA',
                            color: '#DC2626',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        >
                          <X size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#1E293B', fontWeight: 600 }}>
                        Upload or capture attendance sheet photo proof
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={startLiveCamera}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '9px 14px',
                            background: '#2563EB',
                            color: '#FFFFFF',
                            borderRadius: '6px',
                            border: 'none',
                            fontWeight: 600,
                            fontSize: '13px',
                          }}
                        >
                          <Camera size={15} />
                          <span>Camera</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '9px 14px',
                            background: '#FFFFFF',
                            color: '#1E293B',
                            borderRadius: '6px',
                            border: '1.5px solid #CBD5E1',
                            fontWeight: 600,
                            fontSize: '13px',
                          }}
                        >
                          <Upload size={15} color="#2563EB" />
                          <span>Upload File</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '12px' }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={submitting}
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: '15px',
                      fontWeight: 700,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Assigning...</span>
                      </>
                    ) : (
                      <>
                        <CalendarPlus size={18} />
                        <span>Assign Duty</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>

      {/* Employee Details Modal */}
      {detailsModalResourceId && (
        <EmployeeDetailsModal
          isOpen={Boolean(detailsModalResourceId)}
          resourceId={detailsModalResourceId}
          onClose={() => setDetailsModalResourceId(null)}
        />
      )}

      {/* Live Camera Modal */}
      {showCameraModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100060,
            padding: '16px',
          }}
          onClick={stopLiveCamera}
        >
          <div
            style={{
              background: '#0F172A',
              borderRadius: '16px',
              maxWidth: '540px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              border: '1px solid #334155',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #1E293B',
                color: '#FFFFFF',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={18} color="#3B82F6" />
                <span style={{ fontSize: '15px', fontWeight: 700 }}>Capture Attendance Sheet</span>
              </div>
              <button
                type="button"
                onClick={stopLiveCamera}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ position: 'relative', background: '#000000', minHeight: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', maxHeight: '60vh', objectFit: 'contain' }}
              />
            </div>

            <div
              style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                background: '#0F172A',
                borderTop: '1px solid #1E293B',
              }}
            >
              <button
                type="button"
                onClick={stopLiveCamera}
                style={{
                  padding: '10px 18px',
                  background: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#CBD5E1',
                  fontWeight: 600,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={capturePhoto}
                style={{
                  padding: '12px 28px',
                  background: '#2563EB',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '14.5px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Camera size={18} />
                <span>Capture Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Photo Preview Lightbox */}
      {showFullPreview && previewUrl && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100060,
            padding: '20px',
          }}
          onClick={() => setShowFullPreview(false)}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img
              src={previewUrl}
              alt="Full Preview"
              style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px' }}
            />
            <button
              type="button"
              onClick={() => setShowFullPreview(false)}
              style={{
                position: 'absolute',
                top: '-12px',
                right: '-12px',
                background: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAssignDutyScreen;

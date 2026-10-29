import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  UserCheck,
  X,
  Shield,
  LayoutDashboard,
  UserPlus,
  CalendarPlus,
  ClipboardList,
  User,
  LogOut,
  ChevronRight,
  MapPin,
  School,
  GraduationCap,
} from 'lucide-react';
import { HealthBadge } from './HealthBadge';
import authService from '../services/auth.service';
import EmployeeDetailsModal from './EmployeeDetailsModal';

export const MobileHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getStoredUser();
  const resIdLower = user?.resourceId?.toLowerCase() || '';
  const isAdmin = Boolean(
    user?.isAdmin ||
    user?.role === 'admin' ||
    user?.resourceId === '17655' ||
    resIdLower === 'admin' ||
    resIdLower === 'mohan' ||
    resIdLower === 'devsupport' ||
    resIdLower === '5914'
  );
  const displayName = user?.name || (isAdmin ? 'Mohan' : 'Staff Member');
  const resourceId = user?.resourceId || (isAdmin ? '5914' : '---');

  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState<boolean>(false);
  const mobileAvatarRef = useRef<HTMLDivElement>(null);

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || (isAdmin ? 'M' : 'SK');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileAvatarRef.current && !mobileAvatarRef.current.contains(event.target as Node)) {
        setAvatarMenuOpen(false);
      }
    };
    if (avatarMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [avatarMenuOpen]);

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    ...(isAdmin
      ? [
          {
            label: 'Add Employee',
            path: '/add-employee',
            icon: <UserPlus size={20} />,
          },
          {
            label: 'Add City',
            path: '/add-city',
            icon: <MapPin size={20} />,
          },
          {
            label: 'Add Exam Center',
            path: '/add-center',
            icon: <School size={20} />,
          },
          {
            label: 'Add Exam Name',
            path: '/add-exam',
            icon: <GraduationCap size={20} />,
          },
          {
            label: 'Assign Duty to Employee',
            path: '/add-duty',
            icon: <CalendarPlus size={20} />,
          },
          {
            label: 'Workforce Assigned Duties',
            path: '/my-duties',
            icon: <ClipboardList size={20} />,
          },
        ]
      : [
          {
            label: 'Add Duty',
            path: '/add-duty',
            icon: <CalendarPlus size={20} />,
          },
          {
            label: 'My Duties',
            path: '/my-duties',
            icon: <ClipboardList size={20} />,
          },
        ]),
    {
      label: isAdmin ? 'My Profile & Account' : 'Profile',
      path: '/profile',
      icon: <User size={20} />,
    },
  ];

  const handleLogout = () => {
    setDrawerOpen(false);
    setAvatarMenuOpen(false);
    authService.logout();
    sessionStorage.clear();
    localStorage.removeItem('exam_duty_user');
    navigate('/login');
  };

  return (
    <div className="mobile-header-section">
      {/* Top Mobile Bar */}
      <div className="mobile-top-bar">
        <button
          type="button"
          className="mobile-menu-btn"
          title="Open Menu"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open Navigation Drawer"
        >
          <Menu size={20} color="#0F172A" strokeWidth={2.2} />
        </button>

        {/* Top Right User Avatar (M Symbol) with Dropdown */}
        <div className="mobile-top-right" ref={mobileAvatarRef} style={{ position: 'relative' }}>
          <div
            className="user-avatar-circle small"
            onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
            style={{ cursor: 'pointer', userSelect: 'none' }}
            title="Account options & Logout"
          >
            <span>{initials}</span>
          </div>

          {/* Avatar Dropdown on Mobile */}
          {avatarMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '230px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                border: '1px solid #E2E8F0',
                padding: '8px',
                zIndex: 3000,
                animation: 'fadeIn 0.15s ease-out',
              }}
            >
              <div style={{ padding: '8px 10px 10px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{displayName}</span>
                  <span
                    style={{
                      fontSize: '10px',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: isAdmin ? '#FEF3C7' : '#EFF6FF',
                      color: isAdmin ? '#92400E' : '#1D4ED8',
                      fontWeight: 800,
                    }}
                  >
                    {isAdmin ? 'ADMIN' : 'STAFF'}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                  Resource ID: {resourceId}
                </div>
              </div>

              <div style={{ padding: '4px 0' }}>
                <button
                  type="button"
                  onClick={() => {
                    setAvatarMenuOpen(false);
                    navigate('/profile');
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'transparent',
                    color: '#334155',
                    fontSize: '13.5px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <User size={16} color="#2563EB" />
                  <span>My Profile</span>
                </button>

                {!isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarMenuOpen(false);
                      setShowDetailsModal(true);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'transparent',
                      color: '#334155',
                      fontSize: '13.5px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <Shield size={16} color="#0D9488" />
                    <span>Personal Details</span>
                  </button>
                )}
              </div>

              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '4px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setAvatarMenuOpen(false);
                    handleLogout();
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#FEF2F2',
                    color: '#DC2626',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <LogOut size={16} color="#DC2626" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Blue Banner with Welcome & Backend Status */}
      <div className="mobile-blue-banner">
        {/* Row 1: Greeting on left, Backend Status on right */}
        <div className="mobile-banner-header-row">
          <span className="welcome-label">Welcome</span>
          <div className="mobile-banner-badge">
            <HealthBadge />
          </div>
        </div>

        {/* Row 2: Resource ID Pill & Role Badge side-by-side */}
        <div className="mobile-banner-pills-row">
          <button
            type="button"
            className="resource-id-pill"
            onClick={() => setShowDetailsModal(true)}
            title="Click to view full personal details (Aadhaar, PAN, etc.)"
          >
            <UserCheck size={14} />
            <span>Resource ID: {resourceId}</span>
          </button>
          {isAdmin ? (
            <span className="mobile-role-badge badge-admin">ADMIN</span>
          ) : (
            <span className="mobile-role-badge badge-staff">STAFF</span>
          )}
        </div>
      </div>

      {/* Slide-out Mobile Navigation Drawer - Portaled directly to document.body */}
      {drawerOpen &&
        createPortal(
          <div className="mobile-drawer-overlay" onClick={() => setDrawerOpen(false)}>
            <aside className={`mobile-drawer-panel ${!isAdmin ? 'employee-compact' : ''}`} onClick={(e) => e.stopPropagation()}>
              {/* Drawer Header */}
              <div className="drawer-header-bar">
                <div className="drawer-brand">
                  <div className="drawer-brand-logo">
                    <Shield size={22} color="#FFFFFF" strokeWidth={2.4} />
                  </div>
                  <div>
                    <span className="drawer-app-title">Exam Duty</span>
                    <span className="drawer-app-sub">Management Portal</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="drawer-close-btn"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close navigation drawer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* User Card */}
              <div
                className="drawer-user-card"
                onClick={() => {
                  setDrawerOpen(false);
                  setShowDetailsModal(true);
                }}
                title="Click to view full profile details"
              >
                <div className="drawer-user-avatar">
                  <span>{initials}</span>
                </div>
                <div className="drawer-user-info">
                  <div className="drawer-user-name">{displayName}</div>
                  <div className="drawer-user-role-row">
                    <span className="drawer-id-badge">ID: {resourceId}</span>
                    <span className={`drawer-role-pill ${isAdmin ? 'admin' : 'staff'}`}>
                      {isAdmin ? 'ADMIN' : 'STAFF'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Navigation Links */}
              <div className="drawer-nav-section">
                <span className="drawer-section-label">QUICK NAVIGATION</span>
                <nav className="drawer-nav-list">
                  {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <button
                        key={item.path}
                        type="button"
                        className={`drawer-nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => {
                          setDrawerOpen(false);
                          navigate(item.path);
                        }}
                      >
                        <div className="drawer-item-left">
                          <span className="drawer-item-icon">{item.icon}</span>
                          <span className="drawer-item-label">{item.label}</span>
                        </div>
                        <ChevronRight size={16} className="drawer-chevron" />
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Footer with Sign Out */}
              <div className="drawer-footer">
                <button
                  type="button"
                  className="drawer-logout-btn"
                  onClick={handleLogout}
                >
                  <LogOut size={17} />
                  <span>Logout</span>
                </button>
                <div className="drawer-version-tag">Exam Duty Management • KEA</div>
              </div>
            </aside>
          </div>,
          document.body
        )}

      {/* Employee Personal Details Modal */}
      <EmployeeDetailsModal
        resourceId={resourceId}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
    </div>
  );
};

export default MobileHeader;

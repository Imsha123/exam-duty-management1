import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { HealthBadge } from './HealthBadge';
import authService from '../services/auth.service';
import EmployeeDetailsModal from './EmployeeDetailsModal';

export const DesktopTopNav: React.FC = () => {
  const navigate = useNavigate();
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
  const displayName = user?.name || (resIdLower === 'mohan' ? 'Mohan' : resIdLower === 'devsupport' ? 'Dev Support' : (isAdmin ? 'Mohan' : 'Staff Member'));
  const resourceId = user?.resourceId || (isAdmin ? '5914' : '17655');
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || (isAdmin ? 'M' : 'SK');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    authService.logout();
    sessionStorage.clear();
    localStorage.removeItem('exam_duty_user');
    navigate('/login');
  };

  return (
    <header className="desktop-top-header">
      {/* Left Branding */}
      <div className="top-nav-left">
        <div className="top-nav-logo-box">
          <Shield size={24} color="#2563EB" strokeWidth={2.4} />
        </div>
        <div className="top-nav-brand-text">
          <h1 className="top-brand-title">Exam Duty Management</h1>
        </div>
      </div>

      {/* Right User & System Meta */}
      <div className="top-nav-right">
        {/* Backend Connected Indicator */}
        <HealthBadge />

        {/* User Profile Pill with M Symbol & Logout Dropdown */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <div
            className="top-nav-user-profile"
            onClick={() => setMenuOpen(!menuOpen)}
            title="Account & Profile options - Click to open menu"
            style={{
              cursor: 'pointer',
              userSelect: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '4px 10px 4px 6px',
              borderRadius: '9999px',
              border: menuOpen ? '1px solid #BFDBFE' : '1px solid transparent',
              background: menuOpen ? '#F1F5F9' : 'transparent',
              transition: 'all 0.15s ease',
            }}
          >
            <div className="user-avatar-circle" style={{ width: '40px', height: '40px', fontSize: '15px' }}>
              <span>{initials}</span>
            </div>
            <div className="user-text-meta">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="user-display-name">{displayName}</span>
                <span
                  style={{
                    padding: '2px 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    borderRadius: '4px',
                    background: isAdmin ? '#FEF3C7' : '#EFF6FF',
                    color: isAdmin ? '#92400E' : '#1D4ED8',
                    border: isAdmin ? '1px solid #FCD34D' : '1px solid #BFDBFE',
                  }}
                >
                  {isAdmin ? 'ADMIN' : 'STAFF'}
                </span>
              </div>
              <span className="user-resource-id" style={{ fontSize: '12px' }}>
                Resource ID: {resourceId}
              </span>
            </div>
            <ChevronDown
              size={15}
              color="#64748B"
              style={{
                transform: menuOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.15s ease',
              }}
            />
          </div>

          {/* Floating Dropdown inside the M symbol profile */}
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '240px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
                border: '1px solid #E2E8F0',
                padding: '8px',
                zIndex: 1000,
                animation: 'fadeIn 0.15s ease-out',
              }}
            >
              {/* User Meta inside dropdown */}
              <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid #F1F5F9' }}>
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

              {/* Menu items */}
              <div style={{ padding: '4px 0' }}>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
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
                    transition: 'background 0.12s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <UserIcon size={16} color="#2563EB" />
                  <span>My Profile</span>
                </button>

                {!isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
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
                      transition: 'background 0.12s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Shield size={16} color="#0D9488" />
                    <span>Personal Details</span>
                  </button>
                )}
              </div>

              {/* Divider and Logout Option inside the M avatar dropdown */}
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '4px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
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
                    background: 'transparent',
                    color: '#DC2626',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.12s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <LogOut size={16} color="#DC2626" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dedicated Quick Logout Icon Button in Top Header */}
        <button
          type="button"
          onClick={handleLogout}
          title="Logout from system"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            backgroundColor: '#FEF2F2',
            color: '#DC2626',
            border: '1px solid #FECACA',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#DC2626';
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.borderColor = '#DC2626';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FEF2F2';
            e.currentTarget.style.color = '#DC2626';
            e.currentTarget.style.borderColor = '#FECACA';
          }}
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>

      {/* Employee Personal Details Modal */}
      <EmployeeDetailsModal
        resourceId={resourceId}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
    </header>
  );
};

export default DesktopTopNav;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DesktopTopNav } from '../components/DesktopTopNav';
import { DesktopSidebar } from '../components/DesktopSidebar';
import { MobileHeader } from '../components/MobileHeader';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import authService, { EmployeeProfile } from '../services/auth.service';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const stored = authService.getStoredUser();
        const resId = stored?.resourceId;
        const fetched = await authService.getMe(resId);
        setProfile(fetched);
      } catch {
        const stored = authService.getStoredUser();
        if (stored) setProfile(stored);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleLogout = () => {
    authService.logout();
    sessionStorage.clear();
    navigate('/login');
  };

  const storedUser = authService.getStoredUser();
  const isAdmin = Boolean(
    storedUser?.isAdmin ||
    storedUser?.role === 'admin' ||
    storedUser?.resourceId === '17655' ||
    storedUser?.resourceId?.toLowerCase() === 'admin' ||
    storedUser?.resourceId?.toLowerCase() === 'mohan' ||
    storedUser?.resourceId?.toLowerCase() === 'devsupport' ||
    storedUser?.resourceId === '5914' ||
    profile?.isAdmin ||
    profile?.role === 'admin' ||
    profile?.resourceId === '17655' ||
    profile?.resourceId?.toLowerCase() === 'admin' ||
    profile?.resourceId?.toLowerCase() === 'mohan' ||
    profile?.resourceId?.toLowerCase() === 'devsupport' ||
    profile?.resourceId === '5914'
  );

  const displayName = isAdmin ? 'Mohan' : (profile?.name || storedUser?.name || 'Sanjeev Kumar N');
  // Inside admin portal, dummy resource ID is 5914
  const resourceId = isAdmin ? '5914' : (profile?.resourceId || storedUser?.resourceId || '5914');
  const mobile = profile?.mobile || storedUser?.mobile || '9876543210';

  // Ensure email format has @gmail.com extension, and when admin portal it is mohan@gmail.com
  let email = (profile?.email || storedUser?.email || '').trim();
  if (isAdmin) {
    email = 'mohan@gmail.com';
  } else if (!email) {
    email = 'mohan@gmail.com';
  } else if (!email.endsWith('@gmail.com')) {
    email = email.replace(/@[^.]+.*$/, '@gmail.com');
  }

  const city = profile?.city || storedUser?.city || 'Mysuru';
  const aadhaarNumber = profile?.aadhaarNumber;
  const panNumber = profile?.panNumber;
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'SK';

  return (
    <div className="unified-dashboard-root animate-fade-in">
      {/* 1. DESKTOP VIEW */}
      <div className="desktop-layout-wrapper">
        <DesktopTopNav />
        <div className="desktop-main-row">
          <DesktopSidebar />

          <main className="desktop-content-panel">
            {/* Page Title */}
            <div className="page-section-header">
              <div className="page-header-icon-box">
                <User size={24} color="#2563EB" />
              </div>
              <div>
                <h1 className="page-main-heading">Employee Profile</h1>
              </div>
            </div>

            {/* Profile Card */}
            <div className="profile-hero-card">
              <div className="profile-hero-left">
                <div className="profile-avatar-large">
                  <span>{initials}</span>
                </div>
                <div className="profile-hero-names">
                  <h2 className="profile-fullname">{displayName}</h2>
                  <div className="profile-badge-row">
                    <span className="profile-res-pill">
                      <Shield size={14} /> Resource ID: {resourceId}
                    </span>
                    <span className="profile-status-pill active">
                      <CheckCircle2 size={13} /> {profile?.status || 'Active'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Profile Info Grid */}
            <div
              className="profile-details-grid"
              style={{
                gridTemplateColumns: 'minmax(0, 680px)',
              }}
            >
              <div className="profile-info-card">
                <h3 className="card-subhead">Workforce Details</h3>
                <div className="info-item-row">
                  <span className="info-label">
                    <Shield size={16} /> Resource ID
                  </span>
                  <span className="info-val bold">{resourceId}</span>
                </div>
                <div className="info-item-row">
                  <span className="info-label">
                    <User size={16} /> Full Name
                  </span>
                  <span className="info-val">{displayName}</span>
                </div>
                <div className="info-item-row">
                  <span className="info-label">
                    <Phone size={16} /> Mobile Number
                  </span>
                  <span className="info-val">{mobile}</span>
                </div>
                <div className="info-item-row">
                  <span className="info-label">
                    <Mail size={16} /> Official Email
                  </span>
                  <span className="info-val">{email}</span>
                </div>
                <div className="info-item-row" style={{ borderBottom: 'none' }}>
                  <span className="info-label">
                    <MapPin size={16} /> City
                  </span>
                  <span className="info-val">{city}</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* 2. MOBILE VIEW */}
      <div className="mobile-layout-wrapper">
        <MobileHeader />

        <main className="mobile-content-body">
          <div className="mobile-page-title-row">
            <h2 className="mobile-page-heading">My Profile</h2>
          </div>

          <div className="mobile-profile-card">
            <div className="mobile-avatar-big">
              <span>{initials}</span>
            </div>
            <h3 className="mobile-profile-name">{displayName}</h3>
            <span className="mobile-profile-id">Resource ID: {resourceId}</span>
            <span className="profile-status-pill active" style={{ marginTop: '8px' }}>
              ● {profile?.status || 'Active'}
            </span>

            <div className="mobile-profile-info-list">
              <div className="mobile-info-line">
                <Phone size={16} />
                <span>{mobile}</span>
              </div>
              <div className="mobile-info-line">
                <Mail size={16} />
                <span>{email}</span>
              </div>
              <div className="mobile-info-line" style={{ borderBottom: 'none' }}>
                <MapPin size={16} />
                <span>{city}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileScreen;

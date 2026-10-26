import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import authService from '../services/auth.service';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string; server?: string }>({});
  const [loading, setLoading] = useState<boolean>(false);

  const validate = (): boolean => {
    const newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.username = 'Resource ID or Username is required';
    }

    if (!password.trim()) {
      newErrors.password = 'Mobile Number or Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    setErrors((prev) => ({ ...prev, server: undefined }));

    try {
      // Connect to backend REST API (POST /api/auth/login)
      const emp = await authService.login(username.trim(), password.trim());
      sessionStorage.setItem('exam_duty_user', JSON.stringify(emp));

      // Direct navigation to dashboard (Admin portal or Employee portal based on login)
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      setErrors((prev) => ({ ...prev, server: msg }));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrors({});
  };

  return (
    <div className="login-screen-wrapper">
      <div className="login-phone-frame">
        {/* Top Wave Header */}
        <div className="login-top-hero">
          <div className="hero-shield-box">
            <Shield size={30} color="#FFFFFF" strokeWidth={2.4} />
          </div>
          <h1 className="hero-app-title">Exam Duty Management</h1>
          <p className="hero-app-subtitle">Workforce Attendance &amp; Duty Management</p>

          {/* Smooth curved bottom wave */}
          <div className="hero-wave-svg">
            <svg viewBox="0 0 500 60" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <path
                d="M0,0 C150,55 350,55 500,0 L500,60 L0,60 Z"
                fill="#FFFFFF"
              />
            </svg>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="login-card-container">
          <div className="login-header-group" style={{ marginBottom: '16px' }}>
            <h2 className="login-form-title" style={{ fontSize: '20px', fontWeight: 700, color: '#1E293B' }}>
              Login
            </h2>
          </div>

          {errors.server && (
            <div
              style={{
                background: '#FEE2E2',
                border: '1px solid #F87171',
                borderRadius: '8px',
                padding: '10px 14px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#DC2626',
                fontSize: '13.5px',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errors.server}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Resource ID / Username */}
            <div className="form-group-item">
              <label className="input-title-label" htmlFor="username">
                RESOURCE ID / USERNAME
              </label>
              <div className={`reference-input-box ${errors.username ? 'input-error' : ''}`}>
                <User size={18} className="input-leading-icon" />
                <input
                  id="username"
                  type="text"
                  className="clean-input"
                  placeholder="Enter Resource ID or Username (e.g. devsupport, Mohan)"
                  value={username}
                  disabled={loading}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username || errors.server) {
                      setErrors((prev) => ({ ...prev, username: undefined, server: undefined }));
                    }
                  }}
                  autoFocus
                />
              </div>
              {errors.username && (
                <span className="field-error-msg">
                  <AlertCircle size={14} />
                  {errors.username}
                </span>
              )}
            </div>

            {/* Mobile Number / Password */}
            <div className="form-group-item">
              <label className="input-title-label" htmlFor="password">
                MOBILE NUMBER / PASSWORD
              </label>
              <div className={`reference-input-box ${errors.password ? 'input-error' : ''}`}>
                <Lock size={18} className="input-leading-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="clean-input"
                  placeholder="Enter Mobile Number or Password"
                  value={password}
                  disabled={loading}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password || errors.server) {
                      setErrors((prev) => ({ ...prev, password: undefined, server: undefined }));
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    color: '#94A3B8',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <span className="field-error-msg">
                  <AlertCircle size={14} />
                  {errors.password}
                </span>
              )}
            </div>

            {/* Quick Demo Credentials Info / Fill (Hidden by default) */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748B',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 0',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#2563EB')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
                >
                  <Sparkles size={13} color="#2563EB" />
                  <span>{showDemoCredentials ? 'Hide Demo Credentials' : 'Demo Credentials'}</span>
                  {showDemoCredentials ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
              </div>

              {showDemoCredentials && (
                <div
                  style={{
                    marginTop: '8px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '12.5px',
                    color: '#475569',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      marginBottom: '8px',
                      color: '#334155',
                    }}
                  >
                    <Sparkles size={14} color="#2563EB" />
                    <span>Demo Quick Login Credentials:</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {/* Admin 1: devsupport */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>
                        <strong>Admin 1:</strong> devsupport / dev@support123
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuickFill('devsupport', 'dev@support123')}
                        style={{
                          background: '#EFF6FF',
                          color: '#2563EB',
                          border: '1px solid #BFDBFE',
                          borderRadius: '4px',
                          padding: '2px 8px',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Use devsupport
                      </button>
                    </div>

                    {/* Admin 2: Mohan */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>
                        <strong>Admin 2:</strong> Mohan / Mohan@123
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuickFill('Mohan', 'Mohan@123')}
                        style={{
                          background: '#EFF6FF',
                          color: '#2563EB',
                          border: '1px solid #BFDBFE',
                          borderRadius: '4px',
                          padding: '2px 8px',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Use Mohan
                      </button>
                    </div>

                    {/* Employee */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>
                        <strong>Employee:</strong> 597305 / 9886915446
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuickFill('597305', '9886915446')}
                        style={{
                          background: '#F0FDF4',
                          color: '#16A34A',
                          border: '1px solid #BBF7D0',
                          borderRadius: '4px',
                          padding: '2px 8px',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Use Employee
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Login Button */}
            <button type="submit" className="reference-login-btn" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <span>LOGIN</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;

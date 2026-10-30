import React, { useEffect } from 'react';

export interface SweetAlertToastProps {
  show: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
}

export const SweetAlertToast: React.FC<SweetAlertToastProps> = ({
  show,
  message,
  onClose,
  duration = 4500,
}) => {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100060,
        pointerEvents: 'auto',
        animation: 'sweetAlertSlideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '8px',
          boxShadow: '0 12px 30px -4px rgba(0, 0, 0, 0.14), 0 6px 12px -2px rgba(0, 0, 0, 0.08)',
          border: '1px solid #E2E8F0',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          minWidth: '320px',
          maxWidth: 'min(92vw, 640px)',
        }}
      >
        {/* Circular Green Check Badge (Matching reference image) */}
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#F0FDF4',
            border: '2px solid #86EFAC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#16A34A"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Success Message Text */}
        <div
          style={{
            color: '#334155',
            fontSize: '15px',
            fontWeight: 600,
            lineHeight: 1.45,
            flex: 1,
          }}
        >
          {message}
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '4px',
            marginLeft: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#475569')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#94A3B8')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SweetAlertToast;


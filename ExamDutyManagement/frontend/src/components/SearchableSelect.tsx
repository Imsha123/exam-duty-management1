import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Check, X } from 'lucide-react';

// Dynamic font size adjuster for responsive fit on mobile & desktop screens
export const getAdjustableFontSize = (text: string): string => {
  const len = (text || '').trim().length;
  if (len > 42) return 'clamp(10px, 2.7vw, 11.5px)';
  if (len > 32) return 'clamp(11px, 3.0vw, 12.5px)';
  if (len > 22) return 'clamp(12px, 3.3vw, 13.5px)';
  return 'clamp(13px, 3.7vw, 14.5px)';
};

export interface SearchableOption {
  value: string;
  label: string;
  subLabel?: string;
}

interface SearchableSelectProps {
  options: SearchableOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  style?: React.CSSProperties;
  emptyMessage?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = '-- Select an option --',
  searchPlaceholder = 'Type to search...',
  disabled = false,
  className = '',
  style = {},
  emptyMessage = 'No matching options found',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
      // Only auto-focus on desktop devices (non-touch) so virtual keyboard doesn't cover options on mobile
      const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
      if (!isTouch) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find(
    (opt) => String(opt.value).toLowerCase() === String(value).toLowerCase()
  );

  const filteredOptions = options.filter((opt) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const matchesLabel = opt.label.toLowerCase().includes(q);
    const matchesSub = opt.subLabel ? opt.subLabel.toLowerCase().includes(q) : false;
    return matchesLabel || matchesSub;
  });

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchQuery('');
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        ...style,
      }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            if (!isOpen) setSearchQuery('');
          }
        }}
        className={`searchable-select-trigger ${isOpen ? 'is-open' : ''} ${className || ''}`}
        style={{
          width: '100%',
          height: '48px',
          minHeight: '48px',
          padding: '0 12px',
          background: disabled ? '#F1F5F9' : '#FFFFFF',
          border: isOpen ? '1.5px solid #2563EB' : '1.5px solid #CBD5E1',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          gap: '8px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxShadow: isOpen ? '0 0 0 3px rgba(37, 99, 235, 0.15)' : 'none',
          transition: 'all 0.15s ease',
          textAlign: 'left',
          boxSizing: 'border-box',
          overflow: 'hidden',
          marginTop: '0px',
        }}
        title={selectedOption ? selectedOption.label : 'Click to search and select'}
      >
        <span
          className="searchable-select-label"
          style={{
            fontSize: getAdjustableFontSize(selectedOption ? selectedOption.label : placeholder),
            fontWeight: selectedOption ? 600 : 400,
            color: selectedOption ? '#1E293B' : '#94A3B8',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flex: '1 1 auto',
            minWidth: 0,
            maxWidth: '100%',
            lineHeight: 1.25,
            letterSpacing: '-0.1px',
          }}
          title={selectedOption ? selectedOption.label : placeholder}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <div className="searchable-select-icons" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {selectedOption && !disabled && (
            <span
              onClick={handleClear}
              title="Clear selection"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#E2E8F0',
                color: '#64748B',
                cursor: 'pointer',
              }}
            >
              <X size={12} />
            </span>
          )}
          {isOpen ? (
            <ChevronUp size={16} color="#64748B" />
          ) : (
            <ChevronDown size={16} color="#64748B" />
          )}
        </div>
      </button>

      {/* Dropdown with Search Box */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#FFFFFF',
            border: '1.5px solid #CBD5E1',
            borderRadius: '10px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            zIndex: 99999,
            padding: '8px',
          }}
        >
          {/* Search Input Bar */}
          <div
            style={{
              position: 'relative',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search
              size={15}
              color="#2563EB"
              style={{
                position: 'absolute',
                left: '10px',
                pointerEvents: 'none',
              }}
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              style={{
                width: '100%',
                height: '36px',
                padding: '0 32px 0 32px',
                border: '1.5px solid #93C5FD',
                borderRadius: '6px',
                background: '#F8FAFC',
                fontSize: '13.5px',
                color: '#1E293B',
                outline: 'none',
                boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.1)',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Options List */}
          <div
            style={{
              maxHeight: '240px',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
              overscrollBehavior: 'contain',
            }}
          >
            {filteredOptions.length === 0 ? (
              <div
                style={{
                  padding: '14px 10px',
                  textAlign: 'center',
                  fontSize: '13px',
                  color: '#64748B',
                }}
              >
                {searchQuery ? `No results for "${searchQuery}"` : emptyMessage}
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected =
                  String(opt.value).toLowerCase() === String(value).toLowerCase();
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onMouseDown={(e) => {
                      // Prevent input blur which causes mobile keyboards to dismiss and cancel click
                      e.preventDefault();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSelect(opt.value);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: isSelected ? '#EFF6FF' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      border: isSelected ? '1px solid #BFDBFE' : '1px solid transparent',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                      transition: 'background-color 0.1s ease',
                      WebkitTapHighlightColor: 'rgba(37, 99, 235, 0.1)',
                      touchAction: 'manipulation',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: getAdjustableFontSize(opt.label),
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? '#1D4ED8' : '#1E293B',
                          lineHeight: 1.35,
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                        }}
                      >
                        {opt.label}
                      </span>
                      {opt.subLabel && (
                        <span
                          style={{
                            fontSize: '12px',
                            color: '#64748B',
                            marginTop: '2px',
                            lineHeight: 1.2,
                          }}
                        >
                          {opt.subLabel}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <Check size={16} color="#2563EB" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;

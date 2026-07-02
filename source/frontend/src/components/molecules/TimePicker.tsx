/*
 * Copyright (c) 2026 Averion
 * Email: security@averion.id
 * 
 * PROPRIETARY LICENSE
 * 
 * This software is the confidential and proprietary information of Averion.
 * Unauthorized reproduction, distribution, or modification of this source code
 * is strictly prohibited.
 * 
 * WARNING: Modifying this source code without permission is a criminal offense.
 */

import { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { createPortal } from 'react-dom';

interface TimePickerProps {
    value: string;
    onChange: (time: string) => void;
    placeholder?: string;
    disabled?: boolean;
    selectedDate?: string; // YYYY-MM-DD format - used to determine if today and disable past times
}

function TimePicker({ value, onChange, placeholder = '--:--', disabled = false, selectedDate }: TimePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedHour, setSelectedHour] = useState('');
    const [selectedMinute, setSelectedMinute] = useState('');
    const [placement, setPlacement] = useState<'top' | 'bottom'>('bottom');
    const [align, setAlign] = useState<'left' | 'right'>('right');
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Check if selected date is today (using local time to match DatePicker)
    const getTodayDate = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const isToday = selectedDate === getTodayDate();

    // Get current time for comparison
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Check if hour is in the past (for today)
    const isHourPast = (hour: string) => {
        if (!isToday) return false;
        return parseInt(hour) < currentHour;
    };

    // Check if minute is in the past (for today and selected hour)
    const isMinutePast = (minute: string) => {
        if (!isToday) return false;
        const hourNum = parseInt(selectedHour || '00');
        if (hourNum < currentHour) return true;
        if (hourNum > currentHour) return false;
        // Same hour - check minutes
        return parseInt(minute) < currentMinute;
    };

    // Update local state when value changes
    useEffect(() => {
        if (value && value.includes(':')) {
            const [h, m] = value.split(':');
            setSelectedHour(h || '');
            setSelectedMinute(m || '');
        } else {
            setSelectedHour('');
            setSelectedMinute('');
        }
    }, [value]);

    const updatePosition = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const modalHeight = 255; // Actual height approx: 200 (list) + 26 (headers) + 32 (padding) = 258
            const modalWidth = 220;
            const gap = 8;

            let newPlacement: 'top' | 'bottom' = 'bottom';
            let newAlign: 'left' | 'right' = 'right';

            // Vertical check
            if (rect.bottom + modalHeight + gap > viewportHeight && rect.top > modalHeight + gap) {
                newPlacement = 'top';
            }

            // Horizontal check
            if (rect.right - modalWidth < 0) {
                newAlign = 'left';
            }

            setPlacement(newPlacement);
            setAlign(newAlign);

            setPosition({
                top: newPlacement === 'bottom'
                    ? rect.bottom + window.scrollY + gap
                    : rect.top + window.scrollY - modalHeight - gap,

                left: newAlign === 'right'
                    ? rect.right + window.scrollX - modalWidth
                    : rect.left + window.scrollX
            });
        }
    };

    // Calculate position when opening and on window resize/scroll
    useEffect(() => {
        if (isOpen) {
            updatePosition();
            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition, true);
        }
        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [isOpen]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
    const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

    // Close dropdown when disabled changes to true
    useEffect(() => {
        if (disabled && isOpen) {
            setIsOpen(false);
        }
    }, [disabled, isOpen]);

    const handleHourSelect = (hour: string) => {
        if (isHourPast(hour)) return;
        setSelectedHour(hour);

        // If selecting current hour and current selected minute is past, reset minute
        let minute = selectedMinute || '00';
        if (isToday && parseInt(hour) === currentHour && parseInt(minute) < currentMinute) {
            // Find next valid minute (rounded up to 5)
            const nextValidMinute = Math.ceil(currentMinute / 5) * 5;
            minute = nextValidMinute >= 60 ? '00' : String(nextValidMinute).padStart(2, '0');
            setSelectedMinute(minute);
        }
        onChange(`${hour}:${minute}`);
    };

    const handleMinuteSelect = (minute: string) => {
        if (isMinutePast(minute)) return;
        setSelectedMinute(minute);
        const hour = selectedHour || '00';
        onChange(`${hour}:${minute}`);
        setIsOpen(false);
    };

    const formatDisplayTime = (timeStr: string) => {
        if (!timeStr || !timeStr.includes(':')) return '';
        const parts = timeStr.split(':');
        if (parts.length < 2) return '';
        const h = parseInt(parts[0]);
        const minute = parts[1];
        if (isNaN(h)) return '';
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${minute} ${ampm}`;
    };

    const dropdownContent = isOpen ? createPortal(
        <div
            ref={dropdownRef}
            className={placement === 'bottom' ? 'animate-slide-down' : 'animate-slide-up'}
            style={{
                position: 'absolute',
                top: position.top,
                left: position.left,
                background: 'white',
                borderRadius: '12px',
                filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.15))',
                padding: '16px',
                zIndex: 99999,
                display: 'flex',
                gap: '16px',
                width: '220px',
                boxSizing: 'border-box'
            }}
        >
            {/* Arrow Pointer */}
            <div
                style={{
                    position: 'absolute',
                    top: placement === 'bottom' ? '-6px' : 'auto',
                    bottom: placement === 'top' ? '-6px' : 'auto',
                    right: align === 'right' ? '16px' : 'auto',
                    left: align === 'left' ? '16px' : 'auto',
                    width: '12px',
                    height: '12px',
                    background: 'white',
                    transform: 'rotate(45deg)',
                }}
            />
            {/* Hours Column */}
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#999', marginBottom: '8px', textAlign: 'center' }}>
                    Hour
                </div>
                <div style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                }}>
                    {hours.map(hour => {
                        const isPast = isHourPast(hour);
                        return (
                            <button
                                key={hour}
                                type="button"
                                disabled={isPast}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!isPast) handleHourSelect(hour);
                                }}
                                style={{
                                    padding: '8px 12px',
                                    border: 'none',
                                    borderRadius: '6px',
                                    background: selectedHour === hour ? '#F5A623' : isPast ? '#f0f0f0' : '#f5f5f5',
                                    color: selectedHour === hour ? 'white' : isPast ? '#ccc' : '#666',
                                    fontSize: '13px',
                                    cursor: isPast ? 'not-allowed' : 'pointer',
                                    textAlign: 'center',
                                    fontWeight: 500,
                                    opacity: isPast ? 0.5 : 1
                                }}
                            >
                                {hour}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Minutes Column */}
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#999', marginBottom: '8px', textAlign: 'center' }}>
                    Min
                </div>
                <div style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                }}>
                    {minutes.map(minute => {
                        const isPast = isMinutePast(minute);
                        return (
                            <button
                                key={minute}
                                type="button"
                                disabled={isPast}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!isPast) handleMinuteSelect(minute);
                                }}
                                style={{
                                    padding: '8px 12px',
                                    border: 'none',
                                    borderRadius: '6px',
                                    background: selectedMinute === minute ? '#F5A623' : isPast ? '#f0f0f0' : '#f5f5f5',
                                    color: selectedMinute === minute ? 'white' : isPast ? '#ccc' : '#666',
                                    fontSize: '13px',
                                    cursor: isPast ? 'not-allowed' : 'pointer',
                                    textAlign: 'center',
                                    fontWeight: 500,
                                    opacity: isPast ? 0.5 : 1
                                }}
                            >
                                {minute}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid var(--color-border-light)',
                    borderRadius: '8px',
                    fontSize: 'var(--font-size-sm)',
                    fontFamily: 'inherit',
                    background: disabled ? '#f9f9f9' : 'white',
                    color: disabled ? '#bbb' : value ? 'var(--color-text-secondary)' : 'var(--color-text-muted)',
                    fontWeight: 500,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box',
                    opacity: disabled ? 0.7 : 1
                }}
            >
                <span>{value ? formatDisplayTime(value) : placeholder}</span>
                <Clock size={14} style={{ color: disabled ? '#ccc' : '#999', flexShrink: 0 }} />
            </div>
            {dropdownContent}
        </div>
    );
}

export default TimePicker;

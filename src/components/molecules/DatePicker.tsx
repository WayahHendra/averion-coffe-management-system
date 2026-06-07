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
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { createPortal } from 'react-dom';

interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
    placeholder?: string;
}

function DatePicker({ value, onChange, placeholder = 'dd/mm/yyyy' }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(() => {
        if (value) {
            const d = new Date(value);
            if (!isNaN(d.getTime())) return d;
        }
        return new Date();
    });
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedDate = value ? new Date(value) : null;

    const [placement, setPlacement] = useState<'top' | 'bottom'>('bottom');
    const [align, setAlign] = useState<'left' | 'right'>('right');

    const updatePosition = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Calculate dynamic height based on weeks
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth();
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startingDay = firstDay.getDay();
            const totalCells = startingDay + daysInMonth;
            const rows = Math.ceil(totalCells / 7);
            // approx: 32 (py-4) + 40 (nav) + 20 (header) + 8 (mb-2) + (rows * 36)
            // Let's use a safe calculated height. 
            // 32px padding vertical. 
            // top bar ~42px. 
            // days header ~24px + 8px margin = 32px.
            // rows * 36px.
            // Total = 32 + 42 + 32 + (rows * 36) = 106 + (rows * 36).
            // 4 rows: 106 + 144 = 250.
            // 5 rows: 106 + 180 = 286. 
            // 6 rows: 106 + 216 = 322.
            const modalHeight = 110 + (rows * 36);
            const modalWidth = 280;
            const bottomGap = 10;
            const topGap = 6;

            let newPlacement: 'top' | 'bottom' = 'bottom';
            let newAlign: 'left' | 'right' = 'right';

            // Vertical check using bottomGap preference
            if (rect.bottom + modalHeight + bottomGap > viewportHeight && rect.top > modalHeight + topGap) {
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
                    ? rect.bottom + window.scrollY + bottomGap
                    : rect.top + window.scrollY - modalHeight - topGap,

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

    useEffect(() => {
        if (value) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                setCurrentMonth(date);
            }
        }
    }, [value]);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        return { daysInMonth, startingDay };
    };

    const formatDisplayDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleDateSelect = (day: number) => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        onChange(dateStr);
        setIsOpen(false);
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isPastMonth = (year: number, month: number) => {
        const now = new Date();
        return year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth());
    };

    const prevMonth = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const newMonth = currentMonth.getMonth() - 1;
        const newYear = newMonth < 0 ? currentMonth.getFullYear() - 1 : currentMonth.getFullYear();
        const actualMonth = newMonth < 0 ? 11 : newMonth;

        // Don't allow navigating to past months
        if (!isPastMonth(newYear, actualMonth)) {
            setCurrentMonth(new Date(newYear, actualMonth, 1));
        }
    };

    const nextMonth = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const canGoPrev = !isPastMonth(
        currentMonth.getMonth() === 0 ? currentMonth.getFullYear() - 1 : currentMonth.getFullYear(),
        currentMonth.getMonth() === 0 ? 11 : currentMonth.getMonth() - 1
    );

    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
    const days: React.ReactNode[] = [];

    for (let i = 0; i < startingDay; i++) {
        days.push(<div key={`empty-${i}`} style={{ width: '32px', height: '32px' }} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateToCheck = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        dateToCheck.setHours(0, 0, 0, 0);
        const isPast = dateToCheck < today;

        const isSelected = selectedDate &&
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentMonth.getMonth() &&
            selectedDate.getFullYear() === currentMonth.getFullYear();

        const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();

        days.push(
            <button
                key={day}
                type="button"
                disabled={isPast}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isPast) {
                        handleDateSelect(day);
                    }
                }}
                style={{
                    width: '32px',
                    height: '32px',
                    border: 'none',
                    borderRadius: '6px',
                    background: isSelected ? '#F5A623' : isToday ? '#FFF3D0' : 'transparent',
                    color: isPast ? '#ccc' : isSelected ? 'white' : isToday ? '#D4930D' : '#333',
                    fontWeight: 500,
                    fontSize: '13px',
                    cursor: isPast ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isPast ? 0.5 : 1
                }}
            >
                {day}
            </button>
        );
    }

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
                width: '280px',
                transformOrigin: `${placement === 'bottom' ? 'top' : 'bottom'} ${align === 'right' ? 'right' : 'left'}`
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

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
                <button
                    type="button"
                    onClick={prevMonth}
                    disabled={!canGoPrev}
                    style={{
                        background: '#f5f5f5',
                        border: 'none',
                        cursor: canGoPrev ? 'pointer' : 'not-allowed',
                        padding: '8px',
                        borderRadius: '6px',
                        color: '#666',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: canGoPrev ? 1 : 0.4
                    }}
                >
                    <ChevronLeft size={18} />
                </button>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#666' }}>
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button
                    type="button"
                    onClick={nextMonth}
                    style={{
                        background: '#f5f5f5',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '6px',
                        color: '#666',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, color: '#999', padding: '4px 0' }}>
                        {day}
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {days}
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid var(--color-border-light)',
                    borderRadius: '8px',
                    fontSize: 'var(--font-size-sm)',
                    fontFamily: 'inherit',
                    background: 'white',
                    color: value ? 'var(--color-text-secondary)' : 'var(--color-text-muted)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box'
                }}
            >
                <span>{value ? formatDisplayDate(value) : placeholder}</span>
                <Calendar size={14} style={{ color: '#999', flexShrink: 0 }} />
            </div>
            {dropdownContent}
        </div>
    );
}

export default DatePicker;

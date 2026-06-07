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
import { ChevronDown, Armchair } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Table } from '@/core/types';

interface TableSelectorProps {
    tables: Table[];
    selectedTableId?: number;
    onSelect: (tableId: number) => void;
}

export default function TableSelector({ tables, selectedTableId, onSelect }: TableSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [placement, setPlacement] = useState<'top' | 'bottom'>('bottom');

    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedTable = tables.find(t => t.id === selectedTableId);
    const displayTable = selectedTable?.status === 'available' ? selectedTable : undefined;

    const updatePosition = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            const contentHeight = Math.min(tables.length * 32, 200);
            const modalHeight = contentHeight + 16;

            const gap = 8;

            let newPlacement: 'top' | 'bottom' = 'bottom';

            if (rect.bottom + modalHeight + gap > viewportHeight && rect.top > modalHeight + gap) {
                newPlacement = 'top';
            }

            setPlacement(newPlacement);

            setPosition({
                top: newPlacement === 'bottom'
                    ? rect.bottom + window.scrollY + gap
                    : rect.top + window.scrollY - modalHeight - gap,
                left: rect.left + window.scrollX
            });
        }
    };

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
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (tableId: number) => {
        onSelect(tableId);
        setIsOpen(false);
    };

    const dropdownContent = isOpen ? createPortal(
        <div
            ref={dropdownRef}
            className={placement === 'bottom' ? 'animate-slide-down' : 'animate-slide-up'}
            style={{
                position: 'absolute',
                top: position.top,
                left: position.left,
                width: containerRef.current ? Math.max(containerRef.current.offsetWidth, 220) : '220px',
                background: 'white',
                borderRadius: '12px',
                filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.15))',
                padding: '8px',
                zIndex: 99999,
                boxSizing: 'border-box'
            }}
        >
            {/* Arrow Pointer */}
            <div
                style={{
                    position: 'absolute',
                    top: placement === 'bottom' ? '-6px' : 'auto',
                    bottom: placement === 'top' ? '-6px' : 'auto',
                    right: '16px',
                    width: '12px',
                    height: '12px',
                    background: 'white',
                    transform: 'rotate(45deg)',
                }}
            />

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
                {tables.map(table => {
                    const getStatusStyle = () => {
                        switch (table.status) {
                            case 'available':
                                return { background: '#e6f4ea', color: '#1e8e3e' };
                            case 'reserved':
                                return { background: '#fff8e1', color: '#f59e0b' };
                            case 'occupied':
                                return { background: '#fce8e6', color: '#d93025' };
                            default:
                                return { background: '#e6f4ea', color: '#1e8e3e' };
                        }
                    };

                    return (
                        <button
                            key={table.id}
                            onClick={() => handleSelect(table.id)}
                            disabled={table.status !== 'available'}
                            type="button"
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px 12px 8px',
                                border: 'none',
                                background: selectedTableId === table.id ? '#f5f5f5' : 'transparent',
                                borderRadius: '6px',
                                cursor: table.status === 'available' ? 'pointer' : 'not-allowed',
                                color: '#666',
                                fontSize: '13px',
                                opacity: table.status === 'available' ? 1 : 0.6,
                                flexShrink: 0
                            }}
                        >
                            <span style={{ fontWeight: 500 }}>{table.name}</span>
                            <span style={{
                                fontSize: '10px',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                ...getStatusStyle(),
                                whiteSpace: 'nowrap'
                            }}>
                                {table.status}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <div className="table-selector" ref={containerRef} style={{ width: '100%', position: 'relative' }}>
            <button
                className={`order-type-trigger ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                style={{
                    width: '100%',
                    justifyContent: 'space-between',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 12px',
                    background: 'white',
                    border: '1px solid var(--color-border-light)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    color: displayTable ? 'var(--color-text-secondary)' : 'var(--color-text-muted)',
                    fontSize: 'var(--font-size-sm)',
                    fontFamily: 'inherit',
                    fontWeight: 500
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Armchair size={14} style={{ color: displayTable ? 'var(--color-text-secondary)' : 'var(--color-text-muted)' }} />
                    <span className="status-text">{displayTable ? displayTable.name : 'Select Table'}</span>
                </div>
                <ChevronDown size={14} style={{ color: 'var(--color-text-muted)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {dropdownContent}
        </div>
    );
}

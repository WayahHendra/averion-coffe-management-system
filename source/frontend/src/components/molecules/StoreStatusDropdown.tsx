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
import { ChevronDown, DoorOpen, DoorClosed } from 'lucide-react';

interface StoreStatusDropdownProps {
    value: 'open' | 'closed';
    onChange: (value: 'open' | 'closed') => void;
}

export default function StoreStatusDropdown({ value, onChange }: StoreStatusDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (newValue: 'open' | 'closed') => {
        onChange(newValue);
        setIsOpen(false);
    };

    return (
        <div className="store-status-dropdown" ref={dropdownRef}>
            <button
                className={`store-status-trigger ${value}`}
                onClick={() => setIsOpen(!isOpen)}
                type="button"
            >
                {value === 'open' ? <DoorOpen size={12} /> : <DoorClosed size={12} />}
                <span className="status-text">{value === 'open' ? 'Open' : 'Closed'}</span>
                <ChevronDown size={12} className={`status-chevron ${isOpen ? 'open' : ''}`} />
            </button>

            {isOpen && (
                <div className="store-status-menu" style={{ zIndex: 200 }}>
                    <button
                        className={`store-status-option open ${value === 'open' ? 'selected' : ''}`}
                        onClick={() => handleSelect('open')}
                        type="button"
                    >
                        <DoorOpen size={14} />
                        <span>Open</span>
                    </button>
                    <button
                        className={`store-status-option closed ${value === 'closed' ? 'selected' : ''}`}
                        onClick={() => handleSelect('closed')}
                        type="button"
                    >
                        <DoorClosed size={14} />
                        <span>Closed</span>
                    </button>
                </div>
            )}
        </div>
    );
}

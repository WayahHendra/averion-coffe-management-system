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
import { ChevronDown, UtensilsCrossed, ShoppingBag } from 'lucide-react';

interface OrderTypeDropdownProps {
    orderType: 'dine-in' | 'takeaway';
    onChange: (value: 'dine-in' | 'takeaway') => void;
    isActive?: boolean;
    onTriggerClick?: () => void;
}

export default function OrderTypeDropdown({ orderType, onChange, isActive = true, onTriggerClick }: OrderTypeDropdownProps) {
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

    const handleSelect = (newValue: 'dine-in' | 'takeaway') => {
        onChange(newValue);
        setIsOpen(false);
    };

    const getLabel = (val: string) => val === 'dine-in' ? 'Dine In' : 'Takeaway';

    return (
        <div className="store-status-dropdown" ref={dropdownRef}>
            <button
                className={`order-type-trigger ${orderType} ${isActive ? 'active-mode' : ''}`}
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (onTriggerClick) onTriggerClick();
                }}
                type="button"
            >
                {orderType === 'dine-in' ? <UtensilsCrossed size={14} /> : <ShoppingBag size={14} />}
                <span className="status-text">{getLabel(orderType)}</span>
                <ChevronDown size={12} className={`status-chevron ${isOpen ? 'open' : ''}`} />
            </button>

            {isOpen && (
                <div className="store-status-menu">
                    <button
                        className={`store-status-option ${orderType === 'dine-in' ? 'selected' : ''}`}
                        onClick={() => handleSelect('dine-in')}
                        type="button"
                        style={{ justifyContent: 'flex-start' }}
                    >
                        <UtensilsCrossed size={14} />
                        <span>Dine In</span>
                    </button>
                    <button
                        className={`store-status-option ${orderType === 'takeaway' ? 'selected' : ''}`}
                        onClick={() => handleSelect('takeaway')}
                        type="button"
                        style={{ justifyContent: 'flex-start' }}
                    >
                        <ShoppingBag size={14} />
                        <span>Takeaway</span>
                    </button>
                </div>
            )}
        </div>
    );
}

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

import { useState, useEffect, useRef } from 'react';

interface RollingDigitProps {
    value: string;
    className?: string;
}

function RollingDigit({ digit, prevDigit }: { digit: string; prevDigit: string }) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [oldDigit, setOldDigit] = useState(digit);

    useEffect(() => {
        if (prevDigit !== digit && prevDigit !== undefined) {
            setOldDigit(prevDigit);
            setIsAnimating(true);
            const timer = setTimeout(() => {
                setIsAnimating(false);
                setOldDigit(digit);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [digit, prevDigit]);

    const isPunctuation = /[:\-,\s]/.test(digit);

    if (isPunctuation) {
        const displayChar = digit === ' ' ? '\u00A0' : digit;
        return <span className="rolling-char">{displayChar}</span>;
    }

    const isDigitChar = /\d/.test(digit);

    return (
        <span className={`rolling-digit-wrapper ${isDigitChar ? 'digit' : 'letter'}`}>
            <span className={`rolling-digit-old ${isAnimating ? 'rolling-out' : ''}`}>
                {isAnimating ? oldDigit : digit}
            </span>
            {isAnimating && (
                <span className="rolling-digit-new rolling-in">
                    {digit}
                </span>
            )}
        </span>
    );
}

export default function RollingTime({ value, className = '' }: RollingDigitProps) {
    const prevValueRef = useRef(value);

    const chars = value.split('');
    const prevChars = prevValueRef.current.split('');

    useEffect(() => {
        prevValueRef.current = value;
    }, [value]);

    return (
        <span className={`rolling-time-container ${className}`}>
            {chars.map((char, index) => (
                <RollingDigit
                    key={index}
                    digit={char}
                    prevDigit={prevChars[index] || char}
                />
            ))}
        </span>
    );
}

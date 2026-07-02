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

import React from 'react';

// Generic skeleton placeholder
interface SkeletonProps {
    width?: string;
    height?: string;
    borderRadius?: string;
    style?: React.CSSProperties;
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ width, height, borderRadius, style, className = '' }) => (
    <div className={`skeleton ${className}`} style={{ width, height, borderRadius, ...style }} />
);

// Product card skeleton
export const ProductSkeleton: React.FC = () => {
    return (
        <div className="product-card">
            <div className="product-image-wrapper">
                <div className="skeleton" style={{ width: '100%', height: '100%' }} />
            </div>
            <div className="product-info">
                <div className="skeleton" style={{ width: '80%', height: '14px', marginBottom: '4px' }} />
                <div className="skeleton" style={{ width: '40%', height: '16px' }} />
            </div>
        </div>
    );
};

// Category tabs skeleton
export const CategoryTabsSkeleton: React.FC = () => {
    return (
        <div className="category-tabs category-tabs-skeleton">
            <div className="category-tab-skeleton skeleton" style={{ width: '70px' }}></div>
            <div className="category-tab-skeleton skeleton" style={{ width: '90px' }}></div>
            <div className="category-tab-skeleton skeleton" style={{ width: '85px' }}></div>
            <div className="category-tab-skeleton skeleton" style={{ width: '95px' }}></div>
            <div className="category-tab-skeleton skeleton" style={{ width: '140px' }}></div>
        </div>
    );
};

// Order panel skeleton
export const OrderPanelSkeleton: React.FC = () => {
    return (
        <div className="order-item">
            <div className="skeleton" style={{ width: '88px', height: '76px', borderRadius: 'var(--radius-sm)', flexShrink: 0 }} />
            <div className="order-item-details">
                <div className="order-item-top">
                    <div className="skeleton" style={{ width: '80%', height: '14px', marginBottom: '6px' }} />
                    <div className="order-item-options">
                        <div className="skeleton" style={{ width: '30%', height: '10px' }} />
                        <div className="skeleton" style={{ width: '40%', height: '10px' }} />
                    </div>
                </div>
                <div className="skeleton" style={{ width: '50px', height: '14px', marginTop: '4px' }} />
            </div>
            <div className="order-item-actions">
                <div className="skeleton" style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-sm)' }} />
                <div className="quantity-control">
                    <div className="skeleton" style={{ width: '82px', height: '28px', borderRadius: 'var(--radius-sm)' }} />
                </div>
            </div>
        </div>
    );
};

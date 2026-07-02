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

import { TrendingUp } from 'lucide-react';

interface RevenueStatsCardProps {
    timeFilterLabel: string;
    timeFilter: string;
    totalRevenue: number;
    revenueGrowth: number;
    ordersInPeriod: number;
    avgOrderValue: number;
    avgItemsPerOrder: number;
    bestDay: string;
    orderTypeDistribution: { dineIn: number; takeaway: number };
}

function RevenueStatsCard({
    timeFilterLabel,
    timeFilter,
    totalRevenue,
    revenueGrowth,
    ordersInPeriod,
    avgOrderValue,
    avgItemsPerOrder,
    bestDay,
    orderTypeDistribution,
}: RevenueStatsCardProps) {
    return (
        <div className="admin-card">
            <div className="admin-card-header">
                <h3><TrendingUp size={18} /> Revenue Stats</h3>
                <span className="filter-badge">{timeFilterLabel}</span>
            </div>
            <div className="admin-card-body">
                <div className="quick-stat-item">
                    <span className="quick-stat-label">Total Revenue</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="quick-stat-value" style={{ color: 'var(--color-accent)' }}>
                            Rp {totalRevenue.toLocaleString('id-ID')}
                        </span>
                        {timeFilter !== 'all' && revenueGrowth !== 0 && (
                            <span className={`growth-indicator ${revenueGrowth >= 0 ? 'positive' : 'negative'}`}>
                                {revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(revenueGrowth).toFixed(1)}%
                            </span>
                        )}
                    </div>
                </div>
                <div className="quick-stat-item">
                    <span className="quick-stat-label">Orders in Period</span>
                    <span className="quick-stat-value">{ordersInPeriod}</span>
                </div>
                <div className="quick-stat-item">
                    <span className="quick-stat-label">Avg Order Value</span>
                    <span className="quick-stat-value">
                        Rp {Math.round(avgOrderValue).toLocaleString('id-ID')}
                    </span>
                </div>
                <div className="quick-stat-item">
                    <span className="quick-stat-label">Avg Items/Order</span>
                    <span className="quick-stat-value">{avgItemsPerOrder.toFixed(1)}</span>
                </div>
                <div className="quick-stat-item">
                    <span className="quick-stat-label">Best Day</span>
                    <span className="quick-stat-value">{bestDay}</span>
                </div>
                <div className="quick-stat-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                    <span className="quick-stat-label">Order Type</span>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span className="order-type-badge dine-in">Dine-in: {orderTypeDistribution.dineIn}</span>
                        <span className="order-type-badge takeaway">Takeaway: {orderTypeDistribution.takeaway}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RevenueStatsCard;

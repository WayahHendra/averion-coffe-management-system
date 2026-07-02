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

import { Calendar } from 'lucide-react';

interface DayRevenue {
    day: string;
    revenue: number;
    count: number;
}

interface RevenueByDayCardProps {
    revenueByDay: DayRevenue[];
    timeFilterLabel: string;
}

function RevenueByDayCard({ revenueByDay, timeFilterLabel }: RevenueByDayCardProps) {
    return (
        <div className="admin-card">
            <div className="admin-card-header">
                <h3><Calendar size={18} /> Revenue by Day</h3>
                <span className="filter-badge">{timeFilterLabel}</span>
            </div>
            <div className="admin-card-body">
                {revenueByDay.every(d => d.count === 0) ? (
                    <div className="admin-empty-state">
                        <Calendar size={32} />
                        <p>No revenue data yet</p>
                    </div>
                ) : (
                    <div className="revenue-by-day-chart">
                        {(() => {
                            const maxRevenue = Math.max(...revenueByDay.map(d => d.revenue));
                            return revenueByDay.map((dayData, idx) => {
                                const percentage = maxRevenue > 0 ? (dayData.revenue / maxRevenue) * 100 : 0;
                                return (
                                    <div key={idx} className="revenue-day-bar">
                                        <span className="revenue-day-name">{dayData.day}</span>
                                        <div className="revenue-day-bar-container">
                                            <div
                                                className="revenue-day-bar-fill"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <div className="revenue-day-stats">
                                            <span className="revenue-day-amount">
                                                Rp {(dayData.revenue / 1000).toFixed(0)}k
                                            </span>
                                            <span className="revenue-day-count">{dayData.count} orders</span>
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RevenueByDayCard;

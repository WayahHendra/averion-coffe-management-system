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

import { Clock } from 'lucide-react';

interface PeakHour {
    hour: number;
    count: number;
}

interface PeakHoursCardProps {
    peakHours: PeakHour[];
    timeFilterLabel: string;
}

function formatHour(hour: number): string {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${ampm}`;
}

function PeakHoursCard({ peakHours, timeFilterLabel }: PeakHoursCardProps) {
    return (
        <div className="admin-card">
            <div className="admin-card-header">
                <h3><Clock size={18} /> Peak Order Hours</h3>
                <span className="filter-badge">{timeFilterLabel}</span>
            </div>
            <div className="admin-card-body">
                {peakHours.length === 0 ? (
                    <div className="admin-empty-state">
                        <Clock size={32} />
                        <p>No order data yet</p>
                    </div>
                ) : (
                    <div className="peak-hours-chart">
                        {peakHours.map((item, idx) => {
                            const maxCount = Math.max(...peakHours.map(h => h.count));
                            const percentage = (item.count / maxCount) * 100;
                            return (
                                <div key={idx} className="peak-hour-bar">
                                    <span className="peak-hour-time">{formatHour(item.hour)}</span>
                                    <div className="peak-hour-bar-container">
                                        <div
                                            className="peak-hour-bar-fill"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="peak-hour-count">{item.count}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PeakHoursCard;

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

interface StatCardProps {
    label: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon: React.ReactNode;
    primary?: boolean;
}

function StatCard({ label, value, change, changeType = 'neutral', icon, primary }: StatCardProps) {
    return (
        <div className={`admin-stat-card ${primary ? 'primary' : ''}`}>
            <div className="stat-icon-wrapper">{icon}</div>
            <div className="stat-info">
                <span className="stat-label">{label}</span>
                <span className="stat-value">{value}</span>
                {change && (
                    <span className={`stat-change ${changeType}`}>
                        {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : ''} {change}
                    </span>
                )}
            </div>
        </div>
    );
}

export default StatCard;

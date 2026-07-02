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

interface PlaceholderPanelProps {
    title: string;
    icon: React.ReactNode;
}

function PlaceholderPanel({ title, icon }: PlaceholderPanelProps) {
    return (
        <div className="admin-overview">
            <div className="admin-page-header">
                <div>
                    <h2>{title}</h2>
                    <p>This section will be available soon.</p>
                </div>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '50vh',
                color: 'var(--color-text-muted)',
                gap: '12px'
            }}>
                {icon}
                <p>Coming Soon</p>
            </div>
        </div>
    );
}

export default PlaceholderPanel;

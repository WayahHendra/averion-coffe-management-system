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

import { useState } from 'react';
import DashboardSidebar from '@/components/organisms/DashboardSidebar';
import type { TabType } from '@/components/organisms/DashboardSidebar';
import { OrdersPanel } from '@/features/cashier/panels';
import KitchenOverviewPanel from './panels/KitchenOverviewPanel';

interface KitchenDashboardProps {
    permissions?: string[];
}

function KitchenDashboard({ permissions = [] }: KitchenDashboardProps) {
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <KitchenOverviewPanel />;
            case 'orders':
                return <OrdersPanel />;
            default:
                return <KitchenOverviewPanel />;
        }
    };

    return (
        <div className="admin-dashboard">
            <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} permissions={permissions} />
            <main className="admin-main">
                {renderContent()}
            </main>
        </div>
    );
}

export default KitchenDashboard;

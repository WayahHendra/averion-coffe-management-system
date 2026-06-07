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
import {
    OverviewPanel,
    CategoriesPanel,
    ProductsPanel,
    TablesPanel,
    OrdersPanel,
    BookingsPanel,
} from './panels';

interface CashierDashboardProps {
    refreshTrigger?: number;
    permissions?: string[];
}

function CashierDashboard({ refreshTrigger = 0, permissions = [] }: CashierDashboardProps) {
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewPanel refreshTrigger={refreshTrigger} />;
            case 'categories':
                return <CategoriesPanel permissions={permissions} />;
            case 'products':
                return <ProductsPanel permissions={permissions} />;
            case 'tables':
                return <TablesPanel permissions={permissions} />;
            case 'orders':
                return <OrdersPanel />;
            case 'bookings':
                return <BookingsPanel />;
            default:
                return <OverviewPanel refreshTrigger={refreshTrigger} />;
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

export default CashierDashboard;

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
    CategoriesPanel,
    ProductsPanel,
    TablesPanel,
    OrdersPanel,
    BookingsPanel,
    VouchersPanel,
    UsersPanel,
} from '@/features/cashier/panels';
import OwnerOverviewPanel from './panels/OwnerOverviewPanel';
import BranchesPanel from '@/features/superadmin/panels/BranchesPanel';
import DeviceHealthPanel from '@/features/superadmin/panels/DeviceHealthPanel';

interface OwnerDashboardProps {
    refreshTrigger?: number;
    permissions?: string[];
}

function OwnerDashboard({ refreshTrigger = 0, permissions = [] }: OwnerDashboardProps) {
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    void refreshTrigger;

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OwnerOverviewPanel />;
            case 'branches':
                return <BranchesPanel permissions={permissions} />;
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
            case 'vouchers':
                return <VouchersPanel permissions={permissions} />;
            case 'devices':
                return <DeviceHealthPanel permissions={permissions} />;
            case 'analytics':
                return <OwnerOverviewPanel />;
            case 'users':
                return <UsersPanel permissions={permissions} />;
            default:
                return <OwnerOverviewPanel />;
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

export default OwnerDashboard;

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

// SuperAdmin-specific panels
import GlobalOverviewPanel from './panels/GlobalOverviewPanel';
import TenantsPanel from './panels/TenantsPanel';
import SubscriptionsPanel from './panels/SubscriptionsPanel';
import BranchesPanel from './panels/BranchesPanel';
import AnalyticsPanel from './panels/AnalyticsPanel';

// Shared panels
import { UsersPanel } from '@/features/cashier/panels';

interface SuperAdminDashboardProps {
    refreshTrigger?: number;
    permissions?: string[];
}

function SuperAdminDashboard({ refreshTrigger = 0, permissions = [] }: SuperAdminDashboardProps) {
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <GlobalOverviewPanel />;
            case 'tenants':
                return <TenantsPanel permissions={permissions} />;
            case 'subscriptions':
                return <SubscriptionsPanel permissions={permissions} />;
            case 'branches':
                return <BranchesPanel permissions={permissions} />;
            case 'analytics':
                return <AnalyticsPanel />;
            case 'users':
                return <UsersPanel permissions={permissions} />;
            default:
                return <GlobalOverviewPanel />;
        }
    };

    void refreshTrigger;

    // SuperAdmin only sees platform-level tabs
    const superAdminPermissions = [
        'staff:create', 'staff:read', 'staff:update', 'staff:delete', 'staff:assign_role',
        'analytics:view',
    ];

    return (
        <div className="admin-dashboard">
            <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} permissions={superAdminPermissions} />
            <main className="admin-main">
                {renderContent()}
            </main>
        </div>
    );
}

export default SuperAdminDashboard;

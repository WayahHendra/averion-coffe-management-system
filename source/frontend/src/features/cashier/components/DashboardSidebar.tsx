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

import { Layers, Coffee, ShoppingBag, Calendar, LayoutDashboard, Armchair } from 'lucide-react';

type TabType = 'overview' | 'products' | 'categories' | 'tables' | 'orders' | 'bookings';

interface DashboardSidebarProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    permissions?: string[];
}

/**
 * Maps each sidebar tab to the permission(s) required to access it.
 * A tab is visible if the user has at least ONE of the listed permissions.
 * 'overview' has no required permissions — always visible.
 */
const navItems: { id: TabType; label: string; icon: React.ReactNode; requiredPermissions: string[] }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} />, requiredPermissions: [] },
    { id: 'categories', label: 'Categories', icon: <Layers size={20} />, requiredPermissions: ['category:read'] },
    { id: 'products', label: 'Products', icon: <Coffee size={20} />, requiredPermissions: ['menu:read'] },
    { id: 'tables', label: 'Tables', icon: <Armchair size={20} />, requiredPermissions: ['table:read'] },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={20} />, requiredPermissions: ['order:read'] },
    { id: 'bookings', label: 'Bookings', icon: <Calendar size={20} />, requiredPermissions: ['booking:read'] },
];

function DashboardSidebar({ activeTab, onTabChange, permissions = [] }: DashboardSidebarProps) {
    const hasPermission = (required: string[]): boolean => {
        // No permissions required → always visible
        if (required.length === 0) return true;
        // No user permissions set → show all (fallback for unauthenticated/dev mode)
        if (permissions.length === 0) return true;
        // User must have at least one of the required permissions
        return required.some(perm => permissions.includes(perm));
    };

    const visibleNavItems = navItems.filter(item => hasPermission(item.requiredPermissions));

    return (
        <aside className="admin-sidebar">
            <nav className="admin-nav">
                {visibleNavItems.map(item => (
                    <button
                        key={item.id}
                        className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => onTabChange(item.id)}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
}

export default DashboardSidebar;
export type { TabType };

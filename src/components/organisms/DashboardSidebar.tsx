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

import {
    Layers,
    Coffee,
    ShoppingBag,
    Calendar,
    Ticket,
    Users,
    LayoutDashboard,
    Armchair,
    Building2,
    CreditCard,
    Cpu,
    BarChart3,
} from 'lucide-react';

// ==================== Types ====================
type TabType =
    | 'overview'
    | 'categories'
    | 'products'
    | 'tables'
    | 'orders'
    | 'bookings'
    | 'vouchers'
    | 'users'
    | 'tenants'
    | 'subscriptions'
    | 'branches'
    | 'devices'
    | 'analytics';

interface NavItem {
    id: TabType;
    label: string;
    icon: React.ReactNode;
    requiredPermissions: string[];
    section: 'main' | 'management' | 'platform' | 'system';
}

interface DashboardSidebarProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    permissions?: string[];
}

const sectionLabels: Record<string, string> = {
    main: 'Main',
    management: 'Management',
    platform: 'Platform',
    system: 'System',
};

/**
 * Maps each sidebar tab to the permission(s) required to access it.
 * A tab is visible if the user has at least ONE of the listed permissions.
 * 'overview' has no required permissions — always visible.
 */
const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} />, requiredPermissions: [], section: 'main' },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={20} />, requiredPermissions: ['order:read'], section: 'main' },
    { id: 'bookings', label: 'Bookings', icon: <Calendar size={20} />, requiredPermissions: ['booking:read'], section: 'main' },
    { id: 'categories', label: 'Categories', icon: <Layers size={20} />, requiredPermissions: ['category:read'], section: 'management' },
    { id: 'products', label: 'Products', icon: <Coffee size={20} />, requiredPermissions: ['menu:read'], section: 'management' },
    { id: 'tables', label: 'Tables', icon: <Armchair size={20} />, requiredPermissions: ['table:read'], section: 'management' },
    { id: 'vouchers', label: 'Vouchers', icon: <Ticket size={20} />, requiredPermissions: ['voucher:read'], section: 'management' },
    { id: 'tenants', label: 'Tenants', icon: <Building2 size={20} />, requiredPermissions: ['staff:create', 'staff:assign_role'], section: 'platform' },
    { id: 'subscriptions', label: 'Subscriptions', icon: <CreditCard size={20} />, requiredPermissions: ['staff:create', 'staff:assign_role'], section: 'platform' },
    { id: 'branches', label: 'Branches', icon: <Building2 size={20} />, requiredPermissions: ['staff:read'], section: 'platform' },
    { id: 'devices', label: 'IoT Devices', icon: <Cpu size={20} />, requiredPermissions: ['device:read', 'device:monitor'], section: 'system' },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} />, requiredPermissions: ['analytics:view'], section: 'system' },
    { id: 'users', label: 'Users', icon: <Users size={20} />, requiredPermissions: ['staff:read'], section: 'system' },
];

function DashboardSidebar({ activeTab, onTabChange, permissions = [] }: DashboardSidebarProps) {
    const hasPermission = (required: string[]): boolean => {
        if (required.length === 0) return true;
        if (permissions.length === 0) return true;
        return required.some(perm => permissions.includes(perm));
    };

    const visibleNavItems = navItems.filter(item => hasPermission(item.requiredPermissions));

    // Group by section, preserving order
    const sections: { key: string; items: NavItem[] }[] = [];
    const seen = new Set<string>();
    for (const item of visibleNavItems) {
        if (!seen.has(item.section)) {
            seen.add(item.section);
            sections.push({ key: item.section, items: [] });
        }
        sections.find(s => s.key === item.section)!.items.push(item);
    }

    return (
        <aside className="admin-sidebar">
            {/* Logo / Brand */}
            <div className="admin-sidebar-header">
                <div className="sidebar-brand-icon">
                    <Coffee size={22} />
                </div>
                <div className="sidebar-brand-text">
                    <span className="sidebar-brand-name">Averion</span>
                    <span className="sidebar-brand-sub">Coffee CMS</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="admin-nav">
                {sections.map((section, sIdx) => (
                    <div key={section.key} className="nav-section">
                        {sIdx > 0 && <div className="nav-section-divider" />}
                        <span className="nav-section-label">{sectionLabels[section.key] || section.key}</span>
                        {section.items.map(item => (
                            <button
                                key={item.id}
                                className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
                                onClick={() => onTabChange(item.id)}
                            >
                                <span className="nav-item-icon">{item.icon}</span>
                                <span className="nav-item-label">{item.label}</span>
                                {activeTab === item.id && <span className="nav-active-dot" />}
                            </button>
                        ))}
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="admin-sidebar-footer">
                <div className="sidebar-version">v0.1.0</div>
            </div>
        </aside>
    );
}

export default DashboardSidebar;
export type { TabType };

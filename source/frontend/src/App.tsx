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

import { useState, useCallback } from 'react';
import { User } from '@/core/types';
import Header from '@/layouts/pos/Header';
import MenuPage from '@/features/pos/MenuPage';
import LoginModal from '@/features/auth/LoginModal';

// Role-specific dashboards
import CashierDashboard from '@/features/cashier/CashierDashboard';
import OwnerDashboard from '@/features/owner/OwnerDashboard';
import ManagerDashboard from '@/features/manager/ManagerDashboard';
import KitchenDashboard from '@/features/kitchen/KitchenDashboard';
import SuperAdminDashboard from '@/features/superadmin/SuperAdminDashboard';

// Session login disimpan di localStorage agar tidak ter-logout saat refresh /
// aplikasi ditutup. Hilang hanya ketika user menekan tombol Logout.
const SESSION_KEY = 'averion_session';

interface StoredSession {
    user: User;
    permissions: string[];
}

function loadSession(): StoredSession | null {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        return raw ? (JSON.parse(raw) as StoredSession) : null;
    } catch {
        return null;
    }
}

function App() {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'menu'>('menu');
    const [storeStatus, setStoreStatus] = useState<'open' | 'closed'>('open');
    const [user, setUser] = useState<User | null>(() => loadSession()?.user ?? null);
    const [userPermissions, setUserPermissions] = useState<string[]>(() => loadSession()?.permissions ?? []);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [dashboardRefreshTrigger, setDashboardRefreshTrigger] = useState(0);

    const handleLogin = useCallback((loggedInUser: User, permissions: string[]) => {
        setUser(loggedInUser);
        setUserPermissions(permissions);
        localStorage.setItem(SESSION_KEY, JSON.stringify({ user: loggedInUser, permissions }));
    }, []);

    const handleLogout = useCallback(() => {
        setUser(null);
        setUserPermissions([]);
        setActiveTab('menu');
        localStorage.removeItem(SESSION_KEY);
    }, []);

    const handleTabChange = useCallback((tab: 'dashboard' | 'menu') => {
        setActiveTab(tab);
        if (tab === 'dashboard') {
            setDashboardRefreshTrigger(prev => prev + 1);
        }
    }, []);

    const renderDashboard = () => {
        const roleName = user?.role?.toLowerCase() || 'cashier';

        switch (roleName) {
            case 'superadmin':
                return <SuperAdminDashboard refreshTrigger={dashboardRefreshTrigger} permissions={userPermissions} />;
            case 'tenantowner':
                return <OwnerDashboard refreshTrigger={dashboardRefreshTrigger} permissions={userPermissions} />;
            case 'branchmanager':
                return <ManagerDashboard refreshTrigger={dashboardRefreshTrigger} permissions={userPermissions} />;
            case 'kitchen':
                return <KitchenDashboard permissions={userPermissions} />;
            case 'cashier':
            default:
                return <CashierDashboard refreshTrigger={dashboardRefreshTrigger} permissions={userPermissions} />;
        }
    };

    return (
        <div className="app-container">
            <Header
                activeTab={activeTab}
                onTabChange={handleTabChange}
                storeStatus={storeStatus}
                onStoreStatusChange={setStoreStatus}
                user={user}
                onLoginClick={() => setShowLoginModal(true)}
                onLogout={handleLogout}
            />

            <div className="content-area">
                {activeTab === 'menu' ? (
                    <MenuPage storeStatus={storeStatus} />
                ) : (
                    renderDashboard()
                )}
            </div>

            {/* Login Modal */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLogin={handleLogin}
            />
        </div>
    );
}

export default App;

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

import { useState, useEffect, useCallback, useRef } from 'react';
import { User, Notification } from '@/core/types';
import RollingTime from '@/components/atoms/RollingTime';
import StoreStatusDropdown from '@/components/molecules/StoreStatusDropdown';
import {
    PanelsTopLeft,
    ConciergeBell,
    Calendar,
    RefreshCw,
    Wifi,
    WifiOff,
    Bell,
    LogIn,
    LogOut,
    User as UserIcon,
    ChevronDown,
} from 'lucide-react';

interface HeaderProps {
    activeTab: 'dashboard' | 'menu';
    onTabChange: (tab: 'dashboard' | 'menu') => void;
    storeStatus: 'open' | 'closed';
    onStoreStatusChange: (status: 'open' | 'closed') => void;
    user: User | null;
    onLoginClick: () => void;
    onLogout: () => void;
}

function Header({
    activeTab,
    onTabChange,
    storeStatus,
    onStoreStatusChange,
    user,
    onLoginClick,
    onLogout,
}: HeaderProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showNotificationMenu, setShowNotificationMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [notifications] = useState<Notification[]>([]);
    const [connectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connected');
    const userMenuRef = useRef<HTMLDivElement>(null);
    const notificationMenuRef = useRef<HTMLDivElement>(null);

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Close menus on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setShowUserMenu(false);
            }
            if (notificationMenuRef.current && !notificationMenuRef.current.contains(e.target as Node)) {
                setShowNotificationMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatDate = useCallback((date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    }, []);

    const formatTime = useCallback((date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 500);
    };

    return (
        <header className="header">
            <div className="header-left">
                <div className="logo">
                    <img src="./base-icon.png" alt="Logo" className="logo-icon" />
                    <span>Averion Coffee</span>
                </div>
            </div>

            <div className="header-right">
                {user && <StoreStatusDropdown value={storeStatus} onChange={onStoreStatusChange} />}
                <div className="header-date">
                    <Calendar size={14} />
                    <RollingTime value={formatDate(currentDate)} />
                    <span className="date-separator"> - </span>
                    <RollingTime value={formatTime(currentDate)} />
                </div>
                <button className="header-btn refresh-btn" onClick={handleRefresh}>
                    <RefreshCw size={14} className={isRefreshing ? 'spin' : ''} />
                    <span className="btn-text">Refresh</span>
                </button>
                <button
                    className={`header-btn wifi-btn ${connectionStatus}`}
                    title={connectionStatus === 'connected' ? 'Connected' : connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
                >
                    {connectionStatus === 'connected' && <Wifi size={14} />}
                    {connectionStatus === 'connecting' && <RefreshCw size={14} className="spin" />}
                    {connectionStatus === 'disconnected' && <WifiOff size={14} />}
                </button>
                {user && (
                    <div ref={notificationMenuRef} className={`notification-wrapper ${showNotificationMenu ? 'active' : ''}`}>
                        <button className="header-btn notification-btn" onClick={() => setShowNotificationMenu(!showNotificationMenu)}>
                            <Bell size={14} />
                            {notifications.some(n => !n.read) && <span className="notification-badge"></span>}
                        </button>
                        {showNotificationMenu && (
                            <div className="notification-dropdown" onClick={(e) => e.stopPropagation()}>
                                <div className="notification-dropdown-header">
                                    <span className="notification-title">Notifications</span>
                                </div>
                                <div className="notification-dropdown-divider"></div>
                                <div className="notification-list">
                                    {notifications.length > 0 ? (
                                        notifications.map(notification => (
                                            <div
                                                key={notification.id}
                                                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                                            >
                                                <div className={`notification-icon ${notification.type}`}>
                                                    <div className={`dot ${notification.type}`} />
                                                </div>
                                                <div className="notification-content">
                                                    <div className="notification-header">
                                                        <span className="notification-item-title">{notification.title}</span>
                                                    </div>
                                                    <p className="notification-message">{notification.message}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="notification-empty">
                                            <Bell size={24} />
                                            <span>No notifications</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <div
                    ref={userMenuRef}
                    className={`user-profile ${showUserMenu ? 'active' : ''}`}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    style={{ '--trigger-width': userMenuRef.current?.offsetWidth ? `${userMenuRef.current.offsetWidth}px` : 'auto' } as React.CSSProperties}
                >
                    <div className="user-avatar">
                        <UserIcon size={16} />
                    </div>
                    <span className="user-name">{user?.display_name || 'Guest'}</span>
                    <ChevronDown size={14} className="user-chevron" />

                    {/* User Dropdown Menu */}
                    {showUserMenu && (
                        <div className="user-dropdown" onClick={(e) => e.stopPropagation()}>
                            <div className="user-dropdown-header">
                                <div className="user-dropdown-avatar">
                                    <UserIcon size={20} />
                                </div>
                                <div className="user-dropdown-info">
                                    <span className="user-dropdown-name">{user?.display_name || 'Guest'}</span>
                                    <span className="user-dropdown-role">{user?.role || 'User'}</span>
                                </div>
                            </div>
                            <div className="user-dropdown-divider"></div>
                            {user ? (
                                <>
                                    <button
                                        className={`user-dropdown-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                                        onClick={() => { onTabChange('dashboard'); setShowUserMenu(false); }}
                                    >
                                        <PanelsTopLeft size={16} />
                                        <span>Dashboard</span>
                                    </button>
                                    <button
                                        className={`user-dropdown-item ${activeTab === 'menu' ? 'active' : ''}`}
                                        onClick={() => { onTabChange('menu'); setShowUserMenu(false); }}
                                    >
                                        <ConciergeBell size={16} />
                                        <span>Menu</span>
                                    </button>
                                    <div className="user-dropdown-divider"></div>
                                    <button className="user-dropdown-item logout" onClick={() => { onLogout(); setShowUserMenu(false); }}>
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <button className="user-dropdown-item" onClick={() => { onLoginClick(); setShowUserMenu(false); }}>
                                    <LogIn size={16} />
                                    <span>Login</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;

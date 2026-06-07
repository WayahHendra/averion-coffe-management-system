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

import { useState, useEffect } from 'react';
import {
    DollarSign,
    ShoppingBag,
    Users,
    TrendingUp,
    Armchair,
    Ticket,
    BarChart3,
    Cpu,
} from 'lucide-react';
import { mockService } from '@/services/mock';
import type { Order, Booking } from '@/core/types';

function ManagerOverviewPanel() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalTables: 0,
        availableTables: 0,
        totalVouchers: 0,
        totalDevices: 0,
        avgOrderValue: 0,
        revenueGrowth: 8.5,
    });

    useEffect(() => {
        const orders = mockService.getOrders() as Order[];
        const bookings = mockService.getBookings() as Booking[];
        const users = mockService.getUsers();
        const tables = mockService.getTables();
        const vouchers = mockService.getVouchers();
        let devices: { id: string }[] = [];
        try { devices = mockService.getDevices(); } catch { /* no devices */ }

        const paidOrders = [...orders, ...bookings].filter(t =>
            (t as Order).payment_status === 'paid' || (t as Order).payment_status === 'completed'
        );
        const totalRevenue = paidOrders.reduce((sum, t) => sum + (t.total || 0), 0);

        setStats({
            totalRevenue,
            totalOrders: orders.length + bookings.length,
            totalUsers: users.length,
            totalTables: tables.length,
            availableTables: tables.filter(t => t.status === 'available').length,
            totalVouchers: vouchers.length,
            totalDevices: devices.length,
            avgOrderValue: paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0,
            revenueGrowth: 8.5,
        });
    }, []);

    const formatCurrency = (v: number) => 'Rp ' + v.toLocaleString('id-ID');

    return (
        <div className="admin-panel">
            <div className="admin-page-header">
                <div>
                    <h2>Manager Dashboard 📊</h2>
                    <p>Branch operations overview and key performance indicators</p>
                </div>
            </div>

            {/* Revenue Hero */}
            <div className="revenue-summary-row">
                <div className="revenue-main-card">
                    <div className="revenue-icon-circle">
                        <DollarSign size={24} />
                    </div>
                    <div className="revenue-main-info">
                        <span className="revenue-main-label">Total Revenue</span>
                        <span className="revenue-main-value">{formatCurrency(stats.totalRevenue)}</span>
                    </div>
                    <div className="growth-indicator positive">
                        <TrendingUp size={14} />
                        +{stats.revenueGrowth}%
                    </div>
                </div>
                <div className="revenue-sub-cards">
                    <div className="revenue-sub-card">
                        <span className="revenue-sub-label">Avg Order Value</span>
                        <span className="revenue-sub-value">{formatCurrency(Math.round(stats.avgOrderValue))}</span>
                    </div>
                    <div className="revenue-sub-card">
                        <span className="revenue-sub-label">Total Transactions</span>
                        <span className="revenue-sub-value">{stats.totalOrders}</span>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="dashboard-section">
                <div className="dashboard-section-header">
                    <BarChart3 size={18} />
                    <h3>Operations KPIs</h3>
                </div>
                <div className="kpi-grid">
                    <div className="admin-stat-card">
                        <div className="stat-icon-wrapper"><ShoppingBag size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Total Orders</span>
                            <span className="stat-value">{stats.totalOrders}</span>
                            <span className="stat-subtitle">+12 today</span>
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="stat-icon-wrapper"><Users size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Staff Members</span>
                            <span className="stat-value">{stats.totalUsers}</span>
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="stat-icon-wrapper"><Armchair size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Tables Available</span>
                            <span className="stat-value">{stats.availableTables}/{stats.totalTables}</span>
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="stat-icon-wrapper"><Ticket size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Active Vouchers</span>
                            <span className="stat-value">{stats.totalVouchers}</span>
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="stat-icon-wrapper"><Cpu size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-label">IoT Devices</span>
                            <span className="stat-value">{stats.totalDevices}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-section">
                <div className="dashboard-section-header">
                    <h3>Quick Actions</h3>
                </div>
                <div className="quick-actions-grid">
                    <div className="quick-action-card">
                        <div className="stat-icon-wrapper"><ShoppingBag size={20} /></div>
                        <div className="quick-action-text">
                            <span className="quick-action-title">View Orders</span>
                            <span className="quick-action-desc">Manage incoming orders</span>
                        </div>
                    </div>
                    <div className="quick-action-card">
                        <div className="stat-icon-wrapper"><Ticket size={20} /></div>
                        <div className="quick-action-text">
                            <span className="quick-action-title">Manage Vouchers</span>
                            <span className="quick-action-desc">Create or edit promotions</span>
                        </div>
                    </div>
                    <div className="quick-action-card">
                        <div className="stat-icon-wrapper"><BarChart3 size={20} /></div>
                        <div className="quick-action-text">
                            <span className="quick-action-title">Analytics</span>
                            <span className="quick-action-desc">View detailed reports</span>
                        </div>
                    </div>
                    <div className="quick-action-card">
                        <div className="stat-icon-wrapper"><Cpu size={20} /></div>
                        <div className="quick-action-text">
                            <span className="quick-action-title">IoT Devices</span>
                            <span className="quick-action-desc">Monitor device health</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagerOverviewPanel;

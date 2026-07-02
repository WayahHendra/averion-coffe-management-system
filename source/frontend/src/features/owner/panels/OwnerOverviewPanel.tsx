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
    TrendingUp,
    Building2,
    Users,
    ShoppingBag,
    Trophy,
    PieChart,
    Cpu,
} from 'lucide-react';
import { mockService } from '@/services/mock';
import type { Order, Booking, Branch } from '@/core/types';

function OwnerOverviewPanel() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalBranches: 0,
        totalUsers: 0,
        totalDevices: 0,
        avgOrderValue: 0,
        profitMargin: 23.5,
        revenueGrowth: 15.2,
    });
    const [branches, setBranches] = useState<Branch[]>([]);

    useEffect(() => {
        const orders = mockService.getOrders() as Order[];
        const bookings = mockService.getBookings() as Booking[];
        const users = mockService.getUsers();
        let branchData: Branch[] = [];
        let devices: { id: string }[] = [];
        try { branchData = mockService.getBranches(); } catch { /* */ }
        try { devices = mockService.getDevices(); } catch { /* */ }

        const paidOrders = [...orders, ...bookings].filter(t =>
            (t as Order).payment_status === 'paid' || (t as Order).payment_status === 'completed'
        );
        const totalRevenue = paidOrders.reduce((sum, t) => sum + (t.total || 0), 0);

        setStats({
            totalRevenue,
            totalOrders: orders.length + bookings.length,
            totalBranches: branchData.length,
            totalUsers: users.length,
            totalDevices: devices.length,
            avgOrderValue: paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0,
            profitMargin: 23.5,
            revenueGrowth: 15.2,
        });
        setBranches(branchData);
    }, []);

    const formatCurrency = (v: number) => 'Rp ' + v.toLocaleString('id-ID');

    const getRankClass = (i: number) => {
        if (i === 0) return 'gold';
        if (i === 1) return 'silver';
        if (i === 2) return 'bronze';
        return 'default';
    };

    return (
        <div className="admin-panel">
            <div className="admin-page-header">
                <div>
                    <h2>Owner Dashboard 👑</h2>
                    <p>Executive overview — multi-branch performance and growth</p>
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
                        <span className="revenue-sub-label">Profit Margin</span>
                        <span className="revenue-sub-value">{stats.profitMargin}%</span>
                    </div>
                    <div className="revenue-sub-card">
                        <span className="revenue-sub-label">Avg Order</span>
                        <span className="revenue-sub-value">{formatCurrency(Math.round(stats.avgOrderValue))}</span>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="dashboard-section">
                <div className="dashboard-section-header">
                    <PieChart size={18} />
                    <h3>Business Metrics</h3>
                </div>
                <div className="kpi-grid">
                    <div className="admin-stat-card">
                        <div className="stat-icon-wrapper"><Building2 size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Branches</span>
                            <span className="stat-value">{stats.totalBranches}</span>
                            <span className="stat-subtitle">All active</span>
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="stat-icon-wrapper"><ShoppingBag size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Total Orders</span>
                            <span className="stat-value">{stats.totalOrders}</span>
                            <span className="stat-subtitle">+8.5% growth</span>
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="stat-icon-wrapper"><Users size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Total Staff</span>
                            <span className="stat-value">{stats.totalUsers}</span>
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="stat-icon-wrapper"><Cpu size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-label">IoT Fleet</span>
                            <span className="stat-value">{stats.totalDevices}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Branch Leaderboard */}
            {branches.length > 0 && (
                <div className="dashboard-section">
                    <div className="branch-leaderboard">
                        <h3><Trophy size={18} /> Branch Leaderboard</h3>
                        <div className="branch-leaderboard-list">
                            {branches.map((branch, i) => (
                                <div key={branch.id} className="branch-leaderboard-item">
                                    <div className={`branch-rank ${getRankClass(i)}`}>{i + 1}</div>
                                    <div className="branch-info">
                                        <div className="branch-name">{branch.name}</div>
                                        <div className="branch-location">{branch.location}</div>
                                    </div>
                                    <div className="branch-revenue">{formatCurrency(Math.round(stats.totalRevenue / (branches.length || 1) * (1 - i * 0.15)))}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OwnerOverviewPanel;

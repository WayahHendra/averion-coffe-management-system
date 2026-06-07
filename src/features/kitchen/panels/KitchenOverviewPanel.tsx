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
    ChefHat,
    Clock,
    CheckCircle2,
    AlertCircle,
    Timer,
    Flame,
    UtensilsCrossed,
    TrendingUp,
} from 'lucide-react';
import { mockService } from '@/services/mock';
import type { Order } from '@/core/types';

// ==================== KitchenOverviewPanel ====================
function KitchenOverviewPanel() {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const allOrders = mockService.getOrders() as Order[];
        setOrders(allOrders);
    }, []);

    // Compute kitchen-specific metrics
    const preparingOrders = orders.filter(o => o.payment_status === 'pending');
    const readyOrders = orders.filter(o => o.payment_status === 'paid');
    const completedOrders = orders.filter(o => o.payment_status === 'completed');
    const pendingOrders = orders.filter(o => !o.payment_status || o.payment_status === 'unpaid');

    const totalItemsToday = orders.reduce((sum, o) => {
        const items = o.order_items || [];
        return sum + items.reduce((s, item) => s + (item.quantity || 1), 0);
    }, 0);

    const avgPrepTime = 12; // mock average prep time in minutes
    const completionRate = orders.length > 0
        ? Math.round((completedOrders.length / orders.length) * 100)
        : 0;

    // Get recent completed orders for the feed
    const recentCompleted = [...completedOrders]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 6);

    return (
        <div className="admin-panel">
            {/* Header */}
            <div className="admin-page-header">
                <div>
                    <h2>Kitchen Dashboard 🍳</h2>
                    <p>Real-time order queue and kitchen performance</p>
                </div>
                <div className="kitchen-live-badge">
                    <span className="live-dot" />
                    LIVE
                </div>
            </div>

            {/* Kitchen Status Cards */}
            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <div className="stat-icon-wrapper"><Flame size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Now Preparing</span>
                        <span className="stat-value">{preparingOrders.length}</span>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="stat-icon-wrapper"><AlertCircle size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Pending Queue</span>
                        <span className="stat-value">{pendingOrders.length}</span>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="stat-icon-wrapper"><CheckCircle2 size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Ready to Serve</span>
                        <span className="stat-value">{readyOrders.length}</span>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="stat-icon-wrapper"><Timer size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Avg Prep Time</span>
                        <span className="stat-value">{avgPrepTime}m</span>
                    </div>
                </div>
            </div>

            {/* Performance Metrics Row */}
            <div className="kitchen-metrics-row">
                <div className="kitchen-metric-card">
                    <div className="metric-header">
                        <UtensilsCrossed size={18} />
                        <span>Items Prepared Today</span>
                    </div>
                    <div className="metric-value">{totalItemsToday}</div>
                    <div className="metric-subtitle">across {orders.length} orders</div>
                </div>

                <div className="kitchen-metric-card">
                    <div className="metric-header">
                        <TrendingUp size={18} />
                        <span>Completion Rate</span>
                    </div>
                    <div className="metric-value">{completionRate}%</div>
                    <div className="metric-bar">
                        <div className="metric-bar-fill" style={{ width: `${completionRate}%` }} />
                    </div>
                </div>

                <div className="kitchen-metric-card">
                    <div className="metric-header">
                        <ChefHat size={18} />
                        <span>Completed Orders</span>
                    </div>
                    <div className="metric-value">{completedOrders.length}</div>
                    <div className="metric-subtitle">total completed</div>
                </div>
            </div>

            {/* Order Status Distribution */}
            <div className="kitchen-distribution">
                <h3><Clock size={18} /> Order Status Distribution</h3>
                <div className="distribution-bars">
                    {[
                        { label: 'Pending', count: pendingOrders.length, color: '#94a3b8', pct: orders.length > 0 ? (pendingOrders.length / orders.length) * 100 : 0 },
                        { label: 'Preparing', count: preparingOrders.length, color: '#f59e0b', pct: orders.length > 0 ? (preparingOrders.length / orders.length) * 100 : 0 },
                        { label: 'Ready', count: readyOrders.length, color: '#10b981', pct: orders.length > 0 ? (readyOrders.length / orders.length) * 100 : 0 },
                        { label: 'Completed', count: completedOrders.length, color: '#3b82f6', pct: orders.length > 0 ? (completedOrders.length / orders.length) * 100 : 0 },
                    ].map(item => (
                        <div key={item.label} className="distribution-item">
                            <div className="distribution-label">
                                <span className="distribution-dot" style={{ background: item.color }} />
                                <span>{item.label}</span>
                                <span className="distribution-count">{item.count}</span>
                            </div>
                            <div className="distribution-bar-track">
                                <div className="distribution-bar-fill" style={{ width: `${item.pct}%`, background: item.color }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Completed Orders Feed */}
            <div className="kitchen-recent-feed">
                <h3><CheckCircle2 size={18} /> Recently Completed</h3>
                {recentCompleted.length === 0 ? (
                    <div className="admin-empty-state">
                        <ChefHat size={32} />
                        <p>No completed orders yet</p>
                    </div>
                ) : (
                    <div className="kitchen-feed-list">
                        {recentCompleted.map((order) => (
                            <div key={order.id} className="kitchen-feed-item">
                                <div className="feed-order-id">#{order.id}</div>
                                <div className="feed-order-type">{order.order_type || 'dine-in'}</div>
                                <div className="feed-order-items">
                                    {(order.order_items || []).length} items
                                </div>
                                <div className="feed-order-time">
                                    {new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <span className="status-badge completed">Completed</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default KitchenOverviewPanel;

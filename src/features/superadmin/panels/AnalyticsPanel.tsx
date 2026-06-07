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
import {
    TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Building2,
    ArrowUpRight, ArrowDownRight, Calendar,
} from 'lucide-react';
import { mockService } from '@/services/mock';
import type { Subscription } from '@/core/types';

// ==================== Types ====================
type Period = '7d' | '30d' | '90d' | '1y';

interface MetricCardProps {
    label: string;
    value: string;
    change: number;
    icon: React.ReactNode;
    color: string;
}

// ==================== MetricCard ====================
function MetricCard({ label, value, change, icon, color }: MetricCardProps) {
    const isPositive = change >= 0;
    return (
        <div className="admin-stat-card" style={{ borderLeft: `4px solid ${color}` }}>
            <div className="stat-icon" style={{ color }}>{icon}</div>
            <div className="stat-content">
                <span className="stat-label">{label}</span>
                <span className="stat-value">{value}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', fontWeight: 600, color: isPositive ? '#10b981' : '#ef4444', marginTop: '4px' }}>
                    {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {isPositive ? '+' : ''}{change}% vs prev period
                </span>
            </div>
        </div>
    );
}

// ==================== Bar Chart (CSS-only) ====================
function SimpleBarChart({ data, label }: { data: { name: string; value: number; color: string }[]; label: string }) {
    const maxVal = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="admin-table-container" style={{ padding: '16px 20px' }}>
            <h4 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{label}</h4>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '160px' }}>
                {data.map((d, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{d.value}</span>
                        <div style={{
                            width: '100%', maxWidth: '48px', borderRadius: '6px 6px 0 0',
                            backgroundColor: d.color, height: `${(d.value / maxVal) * 120}px`,
                            transition: 'height 0.5s ease', minHeight: '4px',
                        }} />
                        <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textAlign: 'center' }}>{d.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ==================== Donut/Ring (CSS-only) ====================
function DonutChart({ segments, total, centerLabel }: { segments: { label: string; value: number; color: string }[]; total: number; centerLabel: string }) {
    let accumulated = 0;
    const gradientParts = segments.map(seg => {
        const start = (accumulated / total) * 360;
        accumulated += seg.value;
        const end = (accumulated / total) * 360;
        return `${seg.color} ${start}deg ${end}deg`;
    });

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{
                width: '120px', height: '120px', borderRadius: '50%', position: 'relative',
                background: `conic-gradient(${gradientParts.join(', ')})`,
            }}>
                <div style={{
                    position: 'absolute', inset: '24px', borderRadius: '50%',
                    backgroundColor: 'var(--color-bg-primary)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                }}>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{total}</span>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{centerLabel}</span>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {segments.map((seg, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: seg.color }} />
                        <span style={{ color: 'var(--color-text-secondary)' }}>{seg.label}</span>
                        <span style={{ fontWeight: 600, marginLeft: 'auto' }}>{seg.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ==================== AnalyticsPanel ====================
function AnalyticsPanel() {
    const [period, setPeriod] = useState<Period>('30d');
    const [subscriptions] = useState<Subscription[]>(mockService.getSubscriptions());
    const tenants = mockService.getTenants();
    const devices = mockService.getDevices();
    const branches = mockService.getBranches();

    const activeSubs = subscriptions.filter(s => s.status === 'active');
    const monthlyRev = activeSubs.reduce((s, sub) => s + sub.monthly_price, 0);

    // Mock time-series data per period
    const revenueByMonth = [
        { name: 'Sep', value: 68, color: '#6366f1' },
        { name: 'Oct', value: 79, color: '#6366f1' },
        { name: 'Nov', value: 85, color: '#6366f1' },
        { name: 'Dec', value: 91, color: '#6366f1' },
        { name: 'Jan', value: 95, color: '#6366f1' },
        { name: 'Feb', value: 102, color: '#6366f1' },
        { name: 'Mar', value: monthlyRev, color: '#10b981' },
    ];

    const ordersPerDay = [
        { name: 'Mon', value: 187, color: '#3b82f6' },
        { name: 'Tue', value: 215, color: '#3b82f6' },
        { name: 'Wed', value: 198, color: '#3b82f6' },
        { name: 'Thu', value: 242, color: '#3b82f6' },
        { name: 'Fri', value: 310, color: '#10b981' },
        { name: 'Sat', value: 356, color: '#10b981' },
        { name: 'Sun', value: 289, color: '#3b82f6' },
    ];

    const tenantsByPlan = [
        { label: 'Basic', value: activeSubs.filter(s => s.plan_type === 'basic').length || 1, color: '#6366f1' },
        { label: 'Pro', value: activeSubs.filter(s => s.plan_type === 'pro').length || 1, color: '#10b981' },
        { label: 'Enterprise', value: activeSubs.filter(s => s.plan_type === 'enterprise').length || 0, color: '#f59e0b' },
    ];

    const devicesByHealth = [
        { label: 'Good', value: devices.filter(d => d.health_status === 'good').length, color: '#10b981' },
        { label: 'Warning', value: devices.filter(d => d.health_status === 'warning').length, color: '#f59e0b' },
        { label: 'Critical', value: devices.filter(d => d.health_status === 'critical').length, color: '#ef4444' },
        { label: 'Offline', value: devices.filter(d => d.health_status === 'offline').length, color: '#64748b' },
    ];

    // Mock KPIs
    const kpis = [
        { label: 'Monthly Recurring Revenue', value: `$${monthlyRev}`, change: 12.3, icon: <DollarSign size={22} />, color: '#10b981' },
        { label: 'Total Orders (Period)', value: '8,942', change: 8.5, icon: <ShoppingBag size={22} />, color: '#3b82f6' },
        { label: 'Active Tenants', value: `${tenants.filter(t => t.status === 'active').length}`, change: 15.0, icon: <Building2 size={22} />, color: '#6366f1' },
        { label: 'New Users (Period)', value: '47', change: -3.2, icon: <Users size={22} />, color: '#8b5cf6' },
    ];

    // Top tenants by revenue
    const topTenants = tenants
        .map(t => {
            const sub = subscriptions.find(s => s.tenant_id === t.id && s.status === 'active');
            return { name: t.company_name, plan: sub?.plan_type || '—', revenue: sub?.monthly_price || 0, branches: branches.filter(b => b.tenant_id === t.id).length, devices: devices.filter(d => branches.filter(b => b.tenant_id === t.id).some(b => b.id === d.branch_id)).length };
        })
        .sort((a, b) => b.revenue - a.revenue);

    return (
        <div className="admin-panel">
            <div className="admin-page-header">
                <div>
                    <h2>Platform Analytics</h2>
                    <p>Business intelligence, trends, and key performance indicators</p>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                    {(['7d', '30d', '90d', '1y'] as Period[]).map(p => (
                        <button key={p} className={`admin-btn ${period === p ? 'primary' : 'secondary'}`} onClick={() => setPeriod(p)}
                            style={{ padding: '6px 14px', fontSize: '12px' }}>
                            <Calendar size={14} /> {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : p === '90d' ? '90 Days' : '1 Year'}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="stat-cards-grid">
                {kpis.map((kpi, i) => (
                    <MetricCard key={i} {...kpi} />
                ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
                <SimpleBarChart data={revenueByMonth} label="📈 Monthly Revenue Trend ($)" />
                <SimpleBarChart data={ordersPerDay} label="📊 Orders by Day of Week" />
            </div>

            {/* Donut Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                <div className="admin-table-container" style={{ padding: '16px 20px' }}>
                    <h4 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Tenants by Plan</h4>
                    <DonutChart segments={tenantsByPlan} total={tenantsByPlan.reduce((s, seg) => s + seg.value, 0)} centerLabel="Tenants" />
                </div>
                <div className="admin-table-container" style={{ padding: '16px 20px' }}>
                    <h4 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>IoT Fleet Health</h4>
                    <DonutChart segments={devicesByHealth} total={devices.length} centerLabel="Devices" />
                </div>
            </div>

            {/* Growth Metrics */}
            <div className="admin-table-container" style={{ marginTop: '16px' }}>
                <h3 style={{ padding: '14px 20px 6px', margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                    Growth Metrics
                </h3>
                <div style={{ padding: '8px 20px 16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    {[
                        { label: 'Churn Rate', value: '2.1%', icon: <TrendingDown size={16} />, good: true, note: 'Below 5% target' },
                        { label: 'Avg Revenue/Tenant', value: `$${tenants.length > 0 ? Math.round(monthlyRev / Math.max(tenants.filter(t => t.status === 'active').length, 1)) : 0}`, icon: <DollarSign size={16} />, good: true, note: 'Per month' },
                        { label: 'Device Attach Rate', value: `${tenants.length > 0 ? ((devices.length / Math.max(tenants.length, 1)) ).toFixed(1) : 0}/tenant`, icon: <TrendingUp size={16} />, good: true, note: 'Avg devices per tenant' },
                        { label: 'Platform NPS', value: '72', icon: <Users size={16} />, good: true, note: 'Excellent (>50)' },
                    ].map((m, i) => (
                        <div key={i} style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: 'var(--color-text-muted)' }}>
                                {m.icon}
                                <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{m.label}</span>
                            </div>
                            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{m.value}</div>
                            <div style={{ fontSize: '11px', color: m.good ? '#10b981' : '#ef4444', marginTop: '4px' }}>{m.note}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Tenants */}
            <div className="admin-table-container" style={{ marginTop: '16px' }}>
                <h3 style={{ padding: '14px 20px 6px', margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                    Top Tenants by Revenue
                </h3>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tenant</th>
                            <th>Plan</th>
                            <th>Monthly Revenue</th>
                            <th>Branches</th>
                            <th>Devices</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topTenants.map((t, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td><span style={{ fontWeight: 600 }}>{t.name}</span></td>
                                <td><span className={`status-badge ${t.plan === 'enterprise' ? 'confirmed' : t.plan === 'pro' ? 'reserved' : 'pending'}`}>{t.plan.toUpperCase()}</span></td>
                                <td className="price">${t.revenue}/mo</td>
                                <td>{t.branches}</td>
                                <td>{t.devices}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AnalyticsPanel;

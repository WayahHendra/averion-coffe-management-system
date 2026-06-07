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
    DollarSign, Building2, Cpu, AlertTriangle, TrendingUp, Users,
    Wifi, WifiOff, Server, Activity, HardDrive, Clock, Zap,
    ShoppingBag, BarChart3, Shield, BatteryWarning, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { mockService } from '@/services/mock';
import type { Tenant, Subscription, IoTDevice } from '@/core/types';

// ==================== Types ====================
interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    subtitle?: string;
    color: string;
    trend?: { value: string; up: boolean };
}

// ==================== StatCard ====================
function StatCard({ icon, label, value, subtitle, color, trend }: StatCardProps) {
    return (
        <div className="admin-stat-card" style={{ borderLeft: `4px solid ${color}` }}>
            <div className="stat-icon" style={{ color }}>{icon}</div>
            <div className="stat-content">
                <span className="stat-label">{label}</span>
                <span className="stat-value">{value}</span>
                {subtitle && <span className="stat-subtitle">{subtitle}</span>}
                {trend && (
                    <span className="stat-trend" style={{ color: trend.up ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '12px', marginTop: '4px' }}>
                        {trend.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {trend.value}
                    </span>
                )}
            </div>
        </div>
    );
}

// ==================== Section Header ====================
function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '28px', marginBottom: '14px' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>{icon}</span>
            <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{title}</h3>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-muted)' }}>{subtitle}</p>
            </div>
        </div>
    );
}

// ==================== Progress Bar ====================
function ProgressBar({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
    const pct = Math.min((value / max) * 100, 100);
    return (
        <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
                <span style={{ fontWeight: 600, color }}>{pct.toFixed(1)}%</span>
            </div>
            <div style={{ height: '8px', borderRadius: '4px', backgroundColor: 'var(--color-bg-secondary)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, borderRadius: '4px', backgroundColor: color, transition: 'width 0.6s ease' }} />
            </div>
        </div>
    );
}

// ==================== GlobalOverviewPanel ====================
function GlobalOverviewPanel() {
    const [tenants] = useState<Tenant[]>(mockService.getTenants());
    const [subscriptions] = useState<Subscription[]>(mockService.getSubscriptions());
    const [devices] = useState<IoTDevice[]>(mockService.getDevices());
    const [users] = useState(mockService.getUsers());
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // ── Revenue Calculations ──
    const activeSubs = subscriptions.filter(s => s.status === 'active');
    const monthlyRevenue = activeSubs.reduce((sum, s) => sum + s.monthly_price, 0);
    const annualRevenue = monthlyRevenue * 12;
    const hardwareRevenue = devices.length * 35; // $35 avg per device sold
    const totalRevenue = annualRevenue + hardwareRevenue;

    // ── Tenant Stats ──
    const activeTenants = tenants.filter(t => t.status === 'active').length;
    const suspendedTenants = tenants.filter(t => t.status === 'suspended').length;

    // ── Plan Breakdown ──
    const basicCount = activeSubs.filter(s => s.plan_type === 'basic').length;
    const proCount = activeSubs.filter(s => s.plan_type === 'pro').length;
    const enterpriseCount = activeSubs.filter(s => s.plan_type === 'enterprise').length;

    // ── IoT Fleet Stats ──
    const totalDevices = devices.length;
    const onlineDevices = devices.filter(d => d.health_status !== 'offline').length;
    const goodDevices = devices.filter(d => d.health_status === 'good').length;
    const warningDevices = devices.filter(d => d.health_status === 'warning').length;
    const criticalDevices = devices.filter(d => d.health_status === 'critical').length;
    const offlineDevices = devices.filter(d => d.health_status === 'offline').length;
    const avgBattery = devices.filter(d => d.health_status !== 'offline').length > 0
        ? Math.round(devices.filter(d => d.health_status !== 'offline').reduce((sum, d) => sum + d.battery_level, 0) / onlineDevices)
        : 0;

    // ── Mock Server Metrics ──
    const serverMetrics = {
        cpuUsage: 34.2,
        memoryUsage: 58.7,
        diskUsage: 41.3,
        uptime: '99.97%',
        uptimeDays: 127,
        responseTime: 42,
        requestsPerMin: 1247,
        activeConnections: 89,
        mqttConnections: totalDevices - offlineDevices,
        dbConnections: 24,
        kafkaLag: 3,
        redisHitRate: 97.4,
        sslValid: true,
        sslExpiry: '2027-01-15',
        lastDeployment: '2026-03-10T08:30:00Z',
        javaVersion: '21.0.2',
        springBootVersion: '3.2.4',
    };

    return (
        <div className="admin-panel">
            <div className="admin-page-header">
                <div>
                    <h2>Platform Overview</h2>
                    <p>Averion SaaS Global Dashboard — Real-time platform monitoring</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                        <Clock size={14} />
                        {currentTime.toLocaleTimeString('id-ID')}
                    </div>
                    <div style={{ marginTop: '2px', fontSize: '11px' }}>{currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* SECTION 1: REVENUE & FINANCIAL */}
            {/* ══════════════════════════════════════════════════════════ */}
            <SectionHeader icon={<DollarSign size={20} />} title="Revenue & Financial" subtitle="SaaS subscription and hardware revenue" />

            <div className="stat-cards-grid">
                <StatCard
                    icon={<DollarSign size={24} />}
                    label="Monthly SaaS Revenue"
                    value={`$${monthlyRevenue.toLocaleString()}`}
                    subtitle={`${activeSubs.length} active subscriptions`}
                    color="#10b981"
                    trend={{ value: '+12.3% vs last month', up: true }}
                />
                <StatCard
                    icon={<TrendingUp size={24} />}
                    label="Annual Recurring Revenue"
                    value={`$${annualRevenue.toLocaleString()}`}
                    subtitle="Projected ARR"
                    color="#6366f1"
                    trend={{ value: '+18.7% YoY', up: true }}
                />
                <StatCard
                    icon={<Cpu size={24} />}
                    label="Hardware Revenue"
                    value={`$${hardwareRevenue.toLocaleString()}`}
                    subtitle={`${totalDevices} devices sold @ ~$35 avg`}
                    color="#f59e0b"
                />
                <StatCard
                    icon={<BarChart3 size={24} />}
                    label="Total Revenue (Annual)"
                    value={`$${totalRevenue.toLocaleString()}`}
                    subtitle="SaaS + Hardware combined"
                    color="#3b82f6"
                    trend={{ value: '+15.2% growth', up: true }}
                />
            </div>

            {/* Plan Breakdown */}
            <div className="admin-table-container" style={{ marginTop: '16px' }}>
                <h3 style={{ padding: '14px 20px 6px', margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                    Subscription Plan Distribution
                </h3>
                <div style={{ padding: '8px 20px 16px', display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(99, 102, 241, 0.06)', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Basic</div>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{basicCount}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>${basicCount * 29}/mo</div>
                    </div>
                    <div style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pro</div>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{proCount}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>${proCount * 79}/mo</div>
                    </div>
                    <div style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Enterprise</div>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{enterpriseCount}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>${enterpriseCount * 199}/mo</div>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* SECTION 2: TENANT & USER STATS */}
            {/* ══════════════════════════════════════════════════════════ */}
            <SectionHeader icon={<Building2 size={20} />} title="Tenants & Users" subtitle="Platform adoption and user activity" />

            <div className="stat-cards-grid">
                <StatCard
                    icon={<Building2 size={24} />}
                    label="Active Tenants"
                    value={activeTenants}
                    subtitle={suspendedTenants > 0 ? `${suspendedTenants} suspended` : 'All tenants active'}
                    color="#6366f1"
                    trend={{ value: '+2 this month', up: true }}
                />
                <StatCard
                    icon={<Users size={24} />}
                    label="Total Platform Users"
                    value={users.length}
                    subtitle="Across all tenants"
                    color="#8b5cf6"
                />
                <StatCard
                    icon={<ShoppingBag size={24} />}
                    label="Total Orders Today"
                    value="1,247"
                    subtitle="Across all branches"
                    color="#ec4899"
                    trend={{ value: '+8.5% vs yesterday', up: true }}
                />
                <StatCard
                    icon={<Zap size={24} />}
                    label="Avg Orders/Branch"
                    value="156"
                    subtitle="Per active branch per day"
                    color="#14b8a6"
                />
            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* SECTION 3: IoT FLEET HEALTH */}
            {/* ══════════════════════════════════════════════════════════ */}
            <SectionHeader icon={<Cpu size={20} />} title="IoT Hardware Fleet" subtitle="Smart Table device monitoring across all tenants" />

            <div className="stat-cards-grid">
                <StatCard
                    icon={<Cpu size={24} />}
                    label="Total Devices"
                    value={totalDevices}
                    subtitle={`${onlineDevices} online / ${offlineDevices} offline`}
                    color="#3b82f6"
                />
                <StatCard
                    icon={<Wifi size={24} />}
                    label="Online Rate"
                    value={`${totalDevices > 0 ? ((onlineDevices / totalDevices) * 100).toFixed(1) : 0}%`}
                    subtitle={`${onlineDevices} connected via MQTT`}
                    color="#10b981"
                />
                <StatCard
                    icon={<BatteryWarning size={24} />}
                    label="Avg Battery Level"
                    value={`${avgBattery}%`}
                    subtitle={`${warningDevices + criticalDevices} need charging`}
                    color={avgBattery > 50 ? '#10b981' : '#f59e0b'}
                />
                <StatCard
                    icon={<AlertTriangle size={24} />}
                    label="Alerts"
                    value={warningDevices + criticalDevices + offlineDevices}
                    subtitle={`${warningDevices} warn / ${criticalDevices} crit / ${offlineDevices} off`}
                    color={criticalDevices > 0 ? '#ef4444' : warningDevices > 0 ? '#f59e0b' : '#10b981'}
                />
            </div>

            {/* Device Status Breakdown Table */}
            <div className="admin-table-container" style={{ marginTop: '12px' }}>
                <h3 style={{ padding: '14px 20px 6px', margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                    Fleet Status Breakdown
                </h3>
                <div style={{ padding: '8px 20px 16px', display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.12)', textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#10b981' }}>{goodDevices}</div>
                        <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>🟢 Good</div>
                    </div>
                    <div style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.12)', textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#f59e0b' }}>{warningDevices}</div>
                        <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600 }}>🟡 Warning</div>
                    </div>
                    <div style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.12)', textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#ef4444' }}>{criticalDevices}</div>
                        <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600 }}>🔴 Critical</div>
                    </div>
                    <div style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(100, 116, 139, 0.06)', border: '1px solid rgba(100, 116, 139, 0.12)', textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#64748b' }}>{offlineDevices}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>⚫ Offline</div>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* SECTION 4: SERVER & INFRASTRUCTURE */}
            {/* ══════════════════════════════════════════════════════════ */}
            <SectionHeader icon={<Server size={20} />} title="Server & Infrastructure" subtitle="Cloud performance, database, and service health" />

            <div className="stat-cards-grid">
                <StatCard
                    icon={<Activity size={24} />}
                    label="System Uptime"
                    value={serverMetrics.uptime}
                    subtitle={`${serverMetrics.uptimeDays} days continuous`}
                    color="#10b981"
                />
                <StatCard
                    icon={<Zap size={24} />}
                    label="Avg Response Time"
                    value={`${serverMetrics.responseTime}ms`}
                    subtitle={`${serverMetrics.requestsPerMin.toLocaleString()} req/min`}
                    color="#3b82f6"
                    trend={{ value: '-5ms improvement', up: true }}
                />
                <StatCard
                    icon={<Server size={24} />}
                    label="Active Connections"
                    value={serverMetrics.activeConnections}
                    subtitle={`${serverMetrics.mqttConnections} MQTT + ${serverMetrics.dbConnections} DB`}
                    color="#8b5cf6"
                />
                <StatCard
                    icon={<Shield size={24} />}
                    label="SSL Certificate"
                    value={serverMetrics.sslValid ? 'Valid' : 'Expired'}
                    subtitle={`Expires ${new Date(serverMetrics.sslExpiry).toLocaleDateString('id-ID')}`}
                    color={serverMetrics.sslValid ? '#10b981' : '#ef4444'}
                />
            </div>

            {/* Resource Usage Bars */}
            <div className="admin-table-container" style={{ marginTop: '12px' }}>
                <h3 style={{ padding: '14px 20px 6px', margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                    Resource Usage
                </h3>
                <div style={{ padding: '8px 20px 16px' }}>
                    <ProgressBar value={serverMetrics.cpuUsage} max={100} color={serverMetrics.cpuUsage > 80 ? '#ef4444' : serverMetrics.cpuUsage > 60 ? '#f59e0b' : '#10b981'} label="CPU Usage" />
                    <ProgressBar value={serverMetrics.memoryUsage} max={100} color={serverMetrics.memoryUsage > 80 ? '#ef4444' : serverMetrics.memoryUsage > 60 ? '#f59e0b' : '#3b82f6'} label="Memory Usage" />
                    <ProgressBar value={serverMetrics.diskUsage} max={100} color={serverMetrics.diskUsage > 80 ? '#ef4444' : '#6366f1'} label="Disk Usage" />
                    <ProgressBar value={serverMetrics.redisHitRate} max={100} color="#10b981" label="Redis Cache Hit Rate" />
                </div>
            </div>

            {/* Service Status Grid */}
            <div className="admin-table-container" style={{ marginTop: '12px' }}>
                <h3 style={{ padding: '14px 20px 6px', margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                    Microservice Status
                </h3>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Status</th>
                            <th>Version</th>
                            <th>Response</th>
                            <th>Connections</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { name: 'API Gateway', status: 'UP', version: 'v2.1.0', response: '12ms', connections: serverMetrics.activeConnections },
                            { name: 'Order Service', status: 'UP', version: 'v1.8.3', response: '28ms', connections: 34 },
                            { name: 'Table Service', status: 'UP', version: 'v1.5.1', response: '15ms', connections: 18 },
                            { name: 'Device/IoT Service', status: 'UP', version: 'v1.6.0', response: '22ms', connections: serverMetrics.mqttConnections },
                            { name: 'Payment Service', status: 'UP', version: 'v1.3.2', response: '45ms', connections: 12 },
                            { name: 'MQTT Broker (EMQX)', status: 'UP', version: 'v5.4.0', response: '3ms', connections: serverMetrics.mqttConnections },
                            { name: 'MySQL Primary', status: 'UP', version: '8.0.36', response: '5ms', connections: serverMetrics.dbConnections },
                            { name: 'MySQL Replica', status: 'UP', version: '8.0.36', response: '7ms', connections: 16 },
                            { name: 'Redis Cache', status: 'UP', version: '7.2.4', response: '1ms', connections: 42 },
                            { name: 'Kafka Broker', status: 'UP', version: '3.6.1', response: '8ms', connections: 6 },
                        ].map((svc, i) => (
                            <tr key={i}>
                                <td>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {svc.status === 'UP' ? <Wifi size={14} style={{ color: '#10b981' }} /> : <WifiOff size={14} style={{ color: '#ef4444' }} />}
                                        <span style={{ fontWeight: 600 }}>{svc.name}</span>
                                    </span>
                                </td>
                                <td><span className={`status-badge ${svc.status === 'UP' ? 'completed' : 'cancelled'}`}>{svc.status}</span></td>
                                <td><span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{svc.version}</span></td>
                                <td><span style={{ fontWeight: 600, color: '#10b981' }}>{svc.response}</span></td>
                                <td>{svc.connections}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* SECTION 5: PLATFORM INFO */}
            {/* ══════════════════════════════════════════════════════════ */}
            <SectionHeader icon={<HardDrive size={20} />} title="Platform Info" subtitle="Deployment and runtime environment" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                {[
                    { label: 'Java Runtime', value: `JDK ${serverMetrics.javaVersion}` },
                    { label: 'Spring Boot', value: serverMetrics.springBootVersion },
                    { label: 'Last Deployment', value: new Date(serverMetrics.lastDeployment).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
                    { label: 'Kafka Consumer Lag', value: `${serverMetrics.kafkaLag} messages` },
                    { label: 'Database Engine', value: 'MySQL 8.0 Cluster' },
                    { label: 'Cloud Provider', value: 'AWS ap-southeast-1' },
                ].map((item, i) => (
                    <div key={i} style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '4px' }}>{item.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GlobalOverviewPanel;

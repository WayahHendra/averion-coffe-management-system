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
import { Cpu, Wifi, WifiOff, Battery, BatteryWarning, BatteryFull, AlertTriangle } from 'lucide-react';
import { mockService } from '@/services/mock';
import type { IoTDevice, Branch } from '@/core/types';

// ==================== Helpers ====================
function getBatteryIcon(level: number) {
    if (level <= 15) return <BatteryWarning size={16} style={{ color: '#ef4444' }} />;
    if (level <= 50) return <Battery size={16} style={{ color: '#f59e0b' }} />;
    return <BatteryFull size={16} style={{ color: '#10b981' }} />;
}

function getHealthBadge(status: IoTDevice['health_status']) {
    const map = { good: 'completed', warning: 'reserved', critical: 'cancelled', offline: 'pending' };
    const labelMap = { good: '🟢 Good', warning: '🟡 Warning', critical: '🔴 Critical', offline: '⚫ Offline' };
    return <span className={`status-badge ${map[status]}`}>{labelMap[status]}</span>;
}

function timeAgo(isoDate: string): string {
    const diff = Date.now() - new Date(isoDate).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

// ==================== Types ====================
interface DeviceHealthPanelProps {
    branchId?: string;
    permissions?: string[];
}

// ==================== DeviceHealthPanel ====================
function DeviceHealthPanel({ branchId, permissions = [] }: DeviceHealthPanelProps) {
    const can = (perm: string) => permissions.length === 0 || permissions.includes(perm);
    void can; // Used for future OTA/provision actions

    const [branches] = useState<Branch[]>(mockService.getBranches());
    const [selectedBranch, setSelectedBranch] = useState(branchId || branches[0]?.id || '');

    const devices: IoTDevice[] = selectedBranch ? mockService.getDevicesByBranch(selectedBranch) : mockService.getDevices();

    const good = devices.filter(d => d.health_status === 'good').length;
    const warning = devices.filter(d => d.health_status === 'warning').length;
    const critical = devices.filter(d => d.health_status === 'critical').length;
    const offline = devices.filter(d => d.health_status === 'offline').length;

    return (
        <div className="admin-panel">
            <div className="admin-page-header">
                <div>
                    <h2>IoT Device Health</h2>
                    <p>Monitor battery, firmware, and connectivity of Smart Table devices</p>
                </div>
                {!branchId && (
                    <select className="admin-select" value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)}>
                        <option value="">All Branches</option>
                        {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                )}
            </div>

            {/* Summary Cards */}
            <div className="stat-cards-grid">
                <div className="admin-stat-card" style={{ borderLeft: '4px solid #3b82f6' }}>
                    <div className="stat-content"><span className="stat-label">Total Devices</span><span className="stat-value"><Cpu size={20} /> {devices.length}</span></div>
                </div>
                <div className="admin-stat-card" style={{ borderLeft: '4px solid #10b981' }}>
                    <div className="stat-content"><span className="stat-label">🟢 Good</span><span className="stat-value">{good}</span></div>
                </div>
                <div className="admin-stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
                    <div className="stat-content"><span className="stat-label">🟡 Warning</span><span className="stat-value">{warning}</span></div>
                </div>
                <div className="admin-stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
                    <div className="stat-content"><span className="stat-label">🔴 Critical / ⚫ Offline</span><span className="stat-value">{critical + offline}</span></div>
                </div>
            </div>

            {/* Alerts */}
            {(critical > 0 || warning > 0) && (
                <div style={{ margin: '16px 0', padding: '12px 16px', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '14px' }}>
                    <AlertTriangle size={18} />
                    <strong>{critical + warning} device(s)</strong> need attention — low battery or connectivity issues.
                </div>
            )}

            {/* Device Table */}
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Table</th>
                            <th>MAC Address</th>
                            <th>Battery</th>
                            <th>Firmware</th>
                            <th>WiFi</th>
                            <th>Status</th>
                            <th>Last Seen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices.map(d => (
                            <tr key={d.id}>
                                <td><span style={{ fontWeight: 600 }}>Table #{d.table_id}</span></td>
                                <td><span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--color-text-secondary)' }}>{d.mac_address}</span></td>
                                <td>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {getBatteryIcon(d.battery_level)}
                                        <span style={{ fontWeight: 600, color: d.battery_level <= 15 ? '#ef4444' : d.battery_level <= 50 ? '#f59e0b' : '#10b981' }}>
                                            {d.health_status === 'offline' ? '—' : `${d.battery_level}%`}
                                        </span>
                                    </span>
                                </td>
                                <td><span style={{ fontFamily: 'monospace' }}>{d.firmware_version}</span></td>
                                <td>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {d.health_status === 'offline' ? <WifiOff size={14} style={{ color: '#ef4444' }} /> : <Wifi size={14} style={{ color: '#10b981' }} />}
                                        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{d.wifi_rssi_dbm !== 0 ? `${d.wifi_rssi_dbm} dBm` : '—'}</span>
                                    </span>
                                </td>
                                <td>{getHealthBadge(d.health_status)}</td>
                                <td><span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{timeAgo(d.last_seen)}</span></td>
                            </tr>
                        ))}
                        {devices.length === 0 && (
                            <tr><td colSpan={7} className="admin-empty">No devices found for this branch</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DeviceHealthPanel;

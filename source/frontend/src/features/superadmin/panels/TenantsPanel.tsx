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
import { Plus, Pencil, Ban, Save, X, Building2, Mail, CheckCircle } from 'lucide-react';
import { mockService } from '@/services/mock';
import type { Tenant, Subscription } from '@/core/types';

// ==================== Types ====================
interface TenantsPanelProps {
    permissions?: string[];
}

// ==================== TenantsPanel ====================
function TenantsPanel({ permissions = [] }: TenantsPanelProps) {
    const can = (perm: string) => permissions.length === 0 || permissions.includes(perm);

    const [tenants] = useState<Tenant[]>(mockService.getTenants());
    const [subscriptions] = useState<Subscription[]>(mockService.getSubscriptions());
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Tenant | null>(null);
    const [formData, setFormData] = useState({ company_name: '', owner_email: '', status: 'active' as Tenant['status'] });

    const getSub = (tenantId: string) => subscriptions.find(s => s.tenant_id === tenantId);

    const handleAdd = () => {
        setEditing(null);
        setFormData({ company_name: '', owner_email: '', status: 'active' });
        setShowModal(true);
    };

    const handleEdit = (t: Tenant) => {
        setEditing(t);
        setFormData({ company_name: t.company_name, owner_email: t.owner_email, status: t.status });
        setShowModal(true);
    };

    const handleSuspend = (id: string) => {
        if (confirm('Suspend this tenant? This will revoke all access.')) {
            console.log('Suspend tenant:', id);
        }
    };

    const handleActivate = (id: string) => {
        console.log('Activate tenant:', id);
    };

    const handleSubmit = () => {
        if (editing) console.log('Update tenant:', editing.id, formData);
        else console.log('Create tenant:', formData);
        setShowModal(false);
    };

    const getPlanBadge = (plan?: string) => {
        switch (plan) {
            case 'enterprise': return 'confirmed';
            case 'pro': return 'reserved';
            default: return 'pending';
        }
    };

    return (
        <div className="admin-panel">
            <div className="admin-page-header">
                <div>
                    <h2>Tenant Management</h2>
                    <p>Manage coffee shop businesses and their subscriptions</p>
                </div>
                {can('staff:create') && (
                    <button className="admin-btn primary" onClick={handleAdd}><Plus size={18} /> Add Tenant</button>
                )}
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Owner Email</th>
                            <th>Plan</th>
                            <th>Monthly</th>
                            <th>Subscription</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tenants.map(tenant => {
                            const sub = getSub(tenant.id);
                            return (
                                <tr key={tenant.id}>
                                    <td>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Building2 size={16} style={{ color: 'var(--color-text-muted)' }} />
                                            <span style={{ fontWeight: 600 }}>{tenant.company_name}</span>
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Mail size={14} style={{ color: 'var(--color-text-muted)' }} />
                                            {tenant.owner_email}
                                        </span>
                                    </td>
                                    <td><span className={`status-badge ${getPlanBadge(sub?.plan_type)}`}>{sub?.plan_type?.toUpperCase() || '—'}</span></td>
                                    <td className="price">${sub?.monthly_price || 0}/mo</td>
                                    <td><span className={`status-badge ${sub?.status === 'active' ? 'completed' : 'cancelled'}`}>{sub?.status || '—'}</span></td>
                                    <td><span className={`status-badge ${tenant.status === 'active' ? 'completed' : 'cancelled'}`}>{tenant.status}</span></td>
                                    <td>
                                        <div className="action-btns">
                                            {can('staff:update') && <button className="action-btn edit" onClick={() => handleEdit(tenant)}><Pencil size={16} /></button>}
                                            {tenant.status === 'active' ? (
                                                <button className="action-btn delete" onClick={() => handleSuspend(tenant.id)} title="Suspend"><Ban size={16} /></button>
                                            ) : (
                                                <button className="action-btn edit" onClick={() => handleActivate(tenant.id)} title="Activate"><CheckCircle size={16} /></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {tenants.length === 0 && (
                            <tr><td colSpan={7} className="admin-empty">No tenants found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>{editing ? 'Edit Tenant' : 'Add Tenant'}</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="form-group">
                                <label>Company Name *</label>
                                <input type="text" value={formData.company_name} onChange={e => setFormData({ ...formData, company_name: e.target.value })} placeholder="e.g. Kopi Averion" />
                            </div>
                            <div className="form-group">
                                <label>Owner Email *</label>
                                <input type="email" value={formData.owner_email} onChange={e => setFormData({ ...formData, owner_email: e.target.value })} placeholder="owner@example.com" />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as Tenant['status'] })}>
                                    <option value="active">Active</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="admin-btn secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="admin-btn primary" onClick={handleSubmit}><Save size={18} /> Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TenantsPanel;

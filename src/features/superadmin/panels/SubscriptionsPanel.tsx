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
import { Plus, Pencil, Trash2, Save, X, Calendar, CreditCard } from 'lucide-react';
import { mockService } from '@/services/mock';
import type { Subscription, Tenant } from '@/core/types';

// ==================== Types ====================
interface SubscriptionsPanelProps {
    permissions?: string[];
}

// ==================== SubscriptionsPanel ====================
function SubscriptionsPanel({ permissions = [] }: SubscriptionsPanelProps) {
    const can = (perm: string) => permissions.length === 0 || permissions.includes(perm);
    const hasActions = can('staff:update') || can('staff:delete');

    const [subscriptions] = useState<Subscription[]>(mockService.getSubscriptions());
    const [tenants] = useState<Tenant[]>(mockService.getTenants());
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Subscription | null>(null);
    const [formData, setFormData] = useState({
        tenant_id: '',
        plan_type: 'basic' as Subscription['plan_type'],
        start_date: '',
        end_date: '',
        status: 'active' as Subscription['status'],
        monthly_price: 29,
    });

    const getTenantName = (id: string) => tenants.find(t => t.id === id)?.company_name || id;

    const planPrices: Record<string, number> = { basic: 29, pro: 79, enterprise: 199 };

    const handleAdd = () => {
        setEditing(null);
        setFormData({ tenant_id: tenants[0]?.id || '', plan_type: 'basic', start_date: '', end_date: '', status: 'active', monthly_price: 29 });
        setShowModal(true);
    };

    const handleEdit = (s: Subscription) => {
        setEditing(s);
        setFormData({ tenant_id: s.tenant_id, plan_type: s.plan_type, start_date: s.start_date, end_date: s.end_date, status: s.status, monthly_price: s.monthly_price });
        setShowModal(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Cancel this subscription?')) console.log('Delete subscription:', id);
    };

    const handleSubmit = () => {
        if (editing) console.log('Update subscription:', editing.id, formData);
        else console.log('Create subscription:', formData);
        setShowModal(false);
    };

    const getPlanBadge = (plan: string) => {
        switch (plan) {
            case 'enterprise': return 'confirmed';
            case 'pro': return 'reserved';
            default: return 'pending';
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return 'completed';
            case 'expired': return 'cancelled';
            case 'cancelled': return 'cancelled';
            default: return 'pending';
        }
    };

    return (
        <div className="admin-panel">
            <div className="admin-page-header">
                <div>
                    <h2>Subscription Management</h2>
                    <p>Manage SaaS billing plans and subscription lifecycle</p>
                </div>
                {can('staff:create') && (
                    <button className="admin-btn primary" onClick={handleAdd}><Plus size={18} /> Add Subscription</button>
                )}
            </div>

            {/* Summary */}
            <div className="stat-cards-grid" style={{ marginBottom: '16px' }}>
                <div className="admin-stat-card" style={{ borderLeft: '4px solid #10b981' }}>
                    <div className="stat-content">
                        <span className="stat-label">Active Subscriptions</span>
                        <span className="stat-value">{subscriptions.filter(s => s.status === 'active').length}</span>
                    </div>
                </div>
                <div className="admin-stat-card" style={{ borderLeft: '4px solid #6366f1' }}>
                    <div className="stat-content">
                        <span className="stat-label">Monthly Revenue</span>
                        <span className="stat-value">${subscriptions.filter(s => s.status === 'active').reduce((sum, s) => sum + s.monthly_price, 0)}</span>
                    </div>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Tenant</th>
                            <th>Plan</th>
                            <th>Monthly</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            {hasActions && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {subscriptions.map(sub => (
                            <tr key={sub.id}>
                                <td>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <CreditCard size={16} style={{ color: 'var(--color-text-muted)' }} />
                                        <span style={{ fontWeight: 600 }}>{getTenantName(sub.tenant_id)}</span>
                                    </span>
                                </td>
                                <td><span className={`status-badge ${getPlanBadge(sub.plan_type)}`}>{sub.plan_type.toUpperCase()}</span></td>
                                <td className="price">${sub.monthly_price}/mo</td>
                                <td>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                                        <Calendar size={14} style={{ color: 'var(--color-text-muted)' }} />
                                        {new Date(sub.start_date).toLocaleDateString('id-ID')}
                                    </span>
                                </td>
                                <td>
                                    <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                                        {new Date(sub.end_date).toLocaleDateString('id-ID')}
                                    </span>
                                </td>
                                <td><span className={`status-badge ${getStatusBadge(sub.status)}`}>{sub.status}</span></td>
                                {hasActions && (
                                    <td>
                                        <div className="action-btns">
                                            {can('staff:update') && <button className="action-btn edit" onClick={() => handleEdit(sub)}><Pencil size={16} /></button>}
                                            {can('staff:delete') && <button className="action-btn delete" onClick={() => handleDelete(sub.id)}><Trash2 size={16} /></button>}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {subscriptions.length === 0 && (
                            <tr><td colSpan={hasActions ? 7 : 6} className="admin-empty">No subscriptions found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>{editing ? 'Edit Subscription' : 'Add Subscription'}</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="form-group">
                                <label>Tenant *</label>
                                <select value={formData.tenant_id} onChange={e => setFormData({ ...formData, tenant_id: e.target.value })}>
                                    {tenants.map(t => <option key={t.id} value={t.id}>{t.company_name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Plan *</label>
                                <select value={formData.plan_type} onChange={e => { const plan = e.target.value as Subscription['plan_type']; setFormData({ ...formData, plan_type: plan, monthly_price: planPrices[plan] }); }}>
                                    <option value="basic">Basic ($29/mo)</option>
                                    <option value="pro">Pro ($79/mo)</option>
                                    <option value="enterprise">Enterprise ($199/mo)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Start Date *</label>
                                <input type="date" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>End Date *</label>
                                <input type="date" value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as Subscription['status'] })}>
                                    <option value="active">Active</option>
                                    <option value="expired">Expired</option>
                                    <option value="cancelled">Cancelled</option>
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

export default SubscriptionsPanel;

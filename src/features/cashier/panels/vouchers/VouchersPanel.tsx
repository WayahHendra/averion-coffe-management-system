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
import { Plus, Pencil, Trash2, Save, X, Percent, Banknote, CalendarClock } from 'lucide-react';
import { mockService } from '@/services/mock';
import SkeletonBox from '@/components/atoms/SkeletonBox';
import type { Voucher } from '@/core/types';

// ==================== Types ====================
interface VouchersPanelProps {
    permissions?: string[];
}

// ==================== Skeleton ====================
const VouchersSkeleton = () => (
    <div className="admin-table-container">
        <table className="admin-table">
            <thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Usage Limit</th><th>Expiry</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
                {Array(4).fill(0).map((_, i) => (
                    <tr key={i}>
                        <td><SkeletonBox width="120px" height="16px" /></td>
                        <td><SkeletonBox width="80px" height="24px" style={{ borderRadius: '20px' }} /></td>
                        <td><SkeletonBox width="80px" height="16px" /></td>
                        <td><SkeletonBox width="60px" height="16px" /></td>
                        <td><SkeletonBox width="100px" height="16px" /></td>
                        <td><SkeletonBox width="60px" height="24px" style={{ borderRadius: '20px' }} /></td>
                        <td><div style={{ display: 'flex', gap: 8 }}><SkeletonBox width="28px" height="28px" /><SkeletonBox width="28px" height="28px" /></div></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// ==================== Helpers ====================
function isExpired(expiryDate: string): boolean {
    return new Date(expiryDate) < new Date();
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatValue(voucher: Voucher): string {
    if (voucher.type === 'percentage') return `${voucher.value}%`;
    return `Rp ${voucher.value.toLocaleString('id-ID')}`;
}

// ==================== VouchersPanel ====================
function VouchersPanel({ permissions = [] }: VouchersPanelProps) {
    const can = (perm: string) => permissions.length === 0 || permissions.includes(perm);
    const hasActions = can('voucher:update') || can('voucher:delete');

    const [vouchers, setVouchers] = useState<Voucher[]>(mockService.getVouchers());
    const [loading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Voucher | null>(null);
    const [formData, setFormData] = useState({ code: '', type: 'percentage' as Voucher['type'], value: '', limit: '', expiry_date: '' });

    const reload = () => setVouchers(mockService.getVouchers());

    const handleAdd = () => {
        setEditing(null);
        setFormData({ code: '', type: 'percentage', value: '', limit: '', expiry_date: '' });
        setShowModal(true);
    };

    const handleEdit = (v: Voucher) => {
        setEditing(v);
        setFormData({ code: v.code, type: v.type, value: v.value.toString(), limit: v.limit.toString(), expiry_date: v.expiry_date });
        setShowModal(true);
    };

    const handleDelete = (code: string) => {
        if (confirm(`Delete voucher "${code}"?`)) {
            console.log('Delete voucher:', code);
            reload();
        }
    };

    const handleSubmit = () => {
        const data = { ...formData, value: parseFloat(formData.value) || 0, limit: parseInt(formData.limit) || 0 };
        if (editing) {
            console.log('Update voucher:', editing.code, data);
        } else {
            console.log('Create voucher:', data);
        }
        setShowModal(false);
        reload();
    };

    if (loading) return <VouchersSkeleton />;

    return (
        <div className="admin-panel">
            <div className="admin-page-header">
                <div>
                    <h2>Vouchers</h2>
                    <p>Manage discount codes and promotions</p>
                </div>
                {can('voucher:create') && (
                    <button className="admin-btn primary" onClick={handleAdd}><Plus size={18} /> Add Voucher</button>
                )}
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Type</th>
                            <th>Value</th>
                            <th>Usage Limit</th>
                            <th>Expiry Date</th>
                            <th>Status</th>
                            {hasActions && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {vouchers.map(v => (
                            <tr key={v.code}>
                                <td><span style={{ fontWeight: 600, fontFamily: 'monospace', letterSpacing: '0.5px' }}>{v.code}</span></td>
                                <td>
                                    <span className={`status-badge ${v.type === 'percentage' ? 'confirmed' : 'reserved'}`}>
                                        {v.type === 'percentage' ? <><Percent size={12} /> Percentage</> : <><Banknote size={12} /> Fixed</>}
                                    </span>
                                </td>
                                <td className="price">{formatValue(v)}</td>
                                <td>{v.limit}</td>
                                <td>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <CalendarClock size={14} style={{ color: 'var(--color-text-muted)' }} />
                                        {formatDate(v.expiry_date)}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${isExpired(v.expiry_date) ? 'cancelled' : 'completed'}`}>
                                        {isExpired(v.expiry_date) ? 'Expired' : 'Active'}
                                    </span>
                                </td>
                                {hasActions && (
                                    <td>
                                        <div className="action-btns">
                                            {can('voucher:update') && <button className="action-btn edit" onClick={() => handleEdit(v)}><Pencil size={16} /></button>}
                                            {can('voucher:delete') && <button className="action-btn delete" onClick={() => handleDelete(v.code)}><Trash2 size={16} /></button>}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {vouchers.length === 0 && (
                            <tr><td colSpan={hasActions ? 7 : 6} className="admin-empty">No vouchers found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>{editing ? 'Edit Voucher' : 'Add Voucher'}</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="form-group">
                                <label>Voucher Code *</label>
                                <input type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="e.g. DISCOUNT20" style={{ fontFamily: 'monospace', letterSpacing: '1px' }} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Type *</label>
                                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as Voucher['type'] })}>
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (Rp)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Value *</label>
                                    <input type="number" value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value })} placeholder={formData.type === 'percentage' ? 'e.g. 10' : 'e.g. 15000'} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Usage Limit</label>
                                    <input type="number" value={formData.limit} onChange={e => setFormData({ ...formData, limit: e.target.value })} placeholder="Max uses" />
                                </div>
                                <div className="form-group">
                                    <label>Expiry Date *</label>
                                    <input type="date" value={formData.expiry_date} onChange={e => setFormData({ ...formData, expiry_date: e.target.value })} />
                                </div>
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

export default VouchersPanel;

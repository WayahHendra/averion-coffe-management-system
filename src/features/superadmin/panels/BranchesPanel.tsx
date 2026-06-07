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
import { Building2, MapPin, Wifi, Pencil, Trash2, Plus, Save, X } from 'lucide-react';
import { mockService } from '@/services/mock';
import type { Branch, IoTDevice } from '@/core/types';

// ==================== Types ====================
interface BranchesPanelProps {
    permissions?: string[];
}

// ==================== BranchesPanel ====================
function BranchesPanel({ permissions = [] }: BranchesPanelProps) {
    const can = (perm: string) => permissions.length === 0 || permissions.includes(perm);
    const hasActions = can('staff:update') || can('staff:delete');

    const [branches] = useState<Branch[]>(mockService.getBranches());
    const [devices] = useState<IoTDevice[]>(mockService.getDevices());
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Branch | null>(null);
    const [formData, setFormData] = useState({ name: '', location: '' });

    const getDeviceCountForBranch = (branchId: string) => devices.filter(d => d.branch_id === branchId).length;
    const getOnlineDevices = (branchId: string) => devices.filter(d => d.branch_id === branchId && d.health_status !== 'offline').length;

    const handleAdd = () => {
        setEditing(null);
        setFormData({ name: '', location: '' });
        setShowModal(true);
    };

    const handleEdit = (b: Branch) => {
        setEditing(b);
        setFormData({ name: b.name, location: b.location });
        setShowModal(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Delete this branch?')) console.log('Delete branch:', id);
    };

    const handleSubmit = () => {
        if (editing) console.log('Update branch:', editing.id, formData);
        else console.log('Create branch:', formData);
        setShowModal(false);
    };

    return (
        <div className="admin-panel">
            <div className="admin-page-header">
                <div>
                    <h2>Branch Management</h2>
                    <p>Manage your coffee shop branches and outlets</p>
                </div>
                {can('staff:create') && (
                    <button className="admin-btn primary" onClick={handleAdd}><Plus size={18} /> Add Branch</button>
                )}
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Branch</th>
                            <th>Location</th>
                            <th>IoT Devices</th>
                            <th>Online</th>
                            <th>Created</th>
                            {hasActions && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {branches.map(branch => {
                            const total = getDeviceCountForBranch(branch.id);
                            const online = getOnlineDevices(branch.id);
                            return (
                                <tr key={branch.id}>
                                    <td>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Building2 size={16} style={{ color: 'var(--color-text-muted)' }} />
                                            <span style={{ fontWeight: 600 }}>{branch.name}</span>
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <MapPin size={14} style={{ color: 'var(--color-text-muted)' }} />
                                            {branch.location}
                                        </span>
                                    </td>
                                    <td><span style={{ fontWeight: 600 }}>{total}</span> devices</td>
                                    <td>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Wifi size={14} style={{ color: online === total ? '#10b981' : '#f59e0b' }} />
                                            {online}/{total}
                                        </span>
                                    </td>
                                    <td><span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{new Date(branch.created_at).toLocaleDateString('id-ID')}</span></td>
                                    {hasActions && (
                                        <td>
                                            <div className="action-btns">
                                                {can('staff:update') && <button className="action-btn edit" onClick={() => handleEdit(branch)}><Pencil size={16} /></button>}
                                                {can('staff:delete') && <button className="action-btn delete" onClick={() => handleDelete(branch.id)}><Trash2 size={16} /></button>}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                        {branches.length === 0 && (
                            <tr><td colSpan={hasActions ? 6 : 5} className="admin-empty">No branches found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>{editing ? 'Edit Branch' : 'Add Branch'}</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="form-group">
                                <label>Branch Name *</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Kopi Averion - Sudirman" />
                            </div>
                            <div className="form-group">
                                <label>Location *</label>
                                <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. Jakarta Selatan" />
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

export default BranchesPanel;

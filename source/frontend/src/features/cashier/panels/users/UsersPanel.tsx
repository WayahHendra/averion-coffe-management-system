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
import { Plus, Pencil, Trash2, Save, X, Shield, Mail, Building2 } from 'lucide-react';
import { apiService } from '@/services/api';
import SkeletonBox from '@/components/atoms/SkeletonBox';
import type { User, Role, Branch } from '@/core/types';

// ==================== Types ====================
interface UsersPanelProps {
    permissions?: string[];
}

// ==================== Skeleton ====================
const UsersSkeleton = () => (
    <div className="admin-table-container">
        <table className="admin-table">
            <thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Role</th><th>Branch</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
                {Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                        <td><SkeletonBox width="120px" height="16px" /></td>
                        <td><SkeletonBox width="100px" height="16px" /></td>
                        <td><SkeletonBox width="160px" height="16px" /></td>
                        <td><SkeletonBox width="80px" height="24px" style={{ borderRadius: '20px' }} /></td>
                        <td><SkeletonBox width="140px" height="16px" /></td>
                        <td><SkeletonBox width="60px" height="24px" style={{ borderRadius: '20px' }} /></td>
                        <td><div style={{ display: 'flex', gap: 8 }}><SkeletonBox width="28px" height="28px" /><SkeletonBox width="28px" height="28px" /></div></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// ==================== Helpers ====================
function getRoleBadgeClass(roleName: string): string {
    switch (roleName.toLowerCase()) {
        case 'superadmin': return 'cancelled';
        case 'tenantowner': return 'confirmed';
        case 'branchmanager': return 'reserved';
        case 'cashier': return 'completed';
        case 'kitchen': return 'pending';
        default: return '';
    }
}

// ==================== UsersPanel ====================
function UsersPanel({ permissions = [] }: UsersPanelProps) {
    const can = (perm: string) => permissions.length === 0 || permissions.includes(perm);
    const hasActions = can('staff:update') || can('staff:delete');

    const [users, setUsers] = useState<User[]>(apiService.getUsers());
    const [roles] = useState<Role[]>(apiService.getRoles());
    const [branches] = useState<Branch[]>(apiService.getBranches());
    const [loading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        display_name: '', username: '', email: '', role_id: 4, branch_id: '', status: 'active',
    });

    const reload = () => setUsers(apiService.getUsers());

    const getRoleName = (roleId: number) => roles.find(r => r.id === roleId)?.name || `Role ${roleId}`;
    const getBranchName = (branchId?: string) => {
        if (!branchId) return '—';
        return branches.find(b => b.id === branchId)?.name || branchId;
    };

    const handleAdd = () => {
        setEditing(null);
        setFormData({ display_name: '', username: '', email: '', role_id: 4, branch_id: branches[0]?.id || '', status: 'active' });
        setShowModal(true);
    };

    const handleEdit = (user: User) => {
        setEditing(user);
        setFormData({
            display_name: user.display_name,
            username: user.username,
            email: user.email,
            role_id: user.role_id,
            branch_id: user.branch_id || '',
            status: user.status || 'active',
        });
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Delete this user?')) {
            try {
                await apiService.deleteUser(id);
            } catch (e) {
                alert(e instanceof Error ? e.message : 'Gagal menghapus user');
            }
            reload();
        }
    };

    const handleSubmit = async () => {
        try {
            await apiService.saveUser(editing ? editing.id : null, {
                display_name: formData.display_name,
                username: formData.username,
                email: formData.email,
                role_id: formData.role_id,
                status: formData.status,
            });
        } catch (e) {
            alert(e instanceof Error ? e.message : 'Gagal menyimpan user');
        }
        setShowModal(false);
        reload();
    };

    if (loading) return <UsersSkeleton />;

    return (
        <div className="admin-panel">
            <div className="admin-page-header">
                <div>
                    <h2>Users</h2>
                    <p>Manage staff accounts and roles</p>
                </div>
                {can('staff:create') && (
                    <button className="admin-btn primary" onClick={handleAdd}><Plus size={18} /> Add User</button>
                )}
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Branch</th>
                            <th>Status</th>
                            {hasActions && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => {
                            const roleName = getRoleName(user.role_id);
                            return (
                                <tr key={user.id}>
                                    <td><span style={{ fontWeight: 600 }}>{user.display_name}</span></td>
                                    <td><span style={{ fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>@{user.username}</span></td>
                                    <td>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Mail size={14} style={{ color: 'var(--color-text-muted)' }} />
                                            {user.email}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${getRoleBadgeClass(roleName)}`}>
                                            <Shield size={12} /> {roleName}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Building2 size={14} style={{ color: 'var(--color-text-muted)' }} />
                                            {getBranchName(user.branch_id)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${user.status === 'active' ? 'completed' : 'cancelled'}`}>
                                            {user.status || 'active'}
                                        </span>
                                    </td>
                                    {hasActions && (
                                        <td>
                                            <div className="action-btns">
                                                {can('staff:update') && <button className="action-btn edit" onClick={() => handleEdit(user)}><Pencil size={16} /></button>}
                                                {can('staff:delete') && <button className="action-btn delete" onClick={() => handleDelete(user.id)}><Trash2 size={16} /></button>}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                        {users.length === 0 && (
                            <tr><td colSpan={hasActions ? 7 : 6} className="admin-empty">No users found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>{editing ? 'Edit User' : 'Add User'}</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="form-group">
                                <label>Display Name *</label>
                                <input type="text" value={formData.display_name} onChange={e => setFormData({ ...formData, display_name: e.target.value })} placeholder="Full name" />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Username *</label>
                                    <input type="text" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} placeholder="username" />
                                </div>
                                <div className="form-group">
                                    <label>Email *</label>
                                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="email@example.com" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Role *</label>
                                    <select value={formData.role_id} onChange={e => setFormData({ ...formData, role_id: parseInt(e.target.value) })}>
                                        {roles.map(r => (
                                            <option key={r.id} value={r.id}>{r.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Branch</label>
                                    <select value={formData.branch_id} onChange={e => setFormData({ ...formData, branch_id: e.target.value })}>
                                        <option value="">— No Branch —</option>
                                        {branches.map(b => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
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

export default UsersPanel;

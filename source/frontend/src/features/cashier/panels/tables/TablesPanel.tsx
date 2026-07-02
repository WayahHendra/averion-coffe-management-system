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
import { Plus, Trash2, Save, X } from 'lucide-react';
import { apiService } from '@/services/api';
import SkeletonBox from '@/components/atoms/SkeletonBox';
import type { Table } from '@/core/types';

const TableCardsSkeleton = () => (
    <div className="admin-grid-cards">
        {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="table-card">
                <div className="table-card-header">
                    <SkeletonBox width="80px" height="16px" />
                    <SkeletonBox width="60px" height="24px" style={{ borderRadius: '20px' }} />
                </div>
            </div>
        ))}
    </div>
);

// ==================== TablesPanel ====================
interface TablesPanelProps {
    permissions?: string[];
}

function TablesPanel({ permissions = [] }: TablesPanelProps) {
    const can = (perm: string) => permissions.length === 0 || permissions.includes(perm);
    const [tables, setTables] = useState<Table[]>(apiService.getTables());
    const [loading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', status: 'available' as const });

    const reload = () => setTables(apiService.getTables());

    const handleAdd = () => {
        setFormData({ name: '', status: 'available' });
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Delete table?')) {
            try {
                await apiService.deleteTable(id);
            } catch (e) {
                alert(e instanceof Error ? e.message : 'Gagal menghapus meja');
            }
            reload();
        }
    };

    const handleSubmit = async () => {
        try {
            await apiService.createTable({ name: formData.name });
        } catch (e) {
            alert(e instanceof Error ? e.message : 'Gagal menambah meja');
        }
        setShowModal(false);
        reload();
    };

    return (
        <div className="admin-panel">
            <div className="admin-page-header">
                <div><h2>Tables</h2><p>Manage seating arrangements</p></div>
                {can('table:create') && (
                    <button className="admin-btn primary" onClick={handleAdd}><Plus size={18} /> Add Table</button>
                )}
            </div>

            <div className="admin-grid-cards">
                {loading ? <TableCardsSkeleton /> : tables.map(table => (
                    <div key={table.id} className={`table-card ${table.status}`}>
                        <div className="table-card-header">
                            <span className="table-name">{table.name}</span>
                            <span className={`table-status ${table.status}`}>{table.status}</span>
                        </div>
                        {table.capacity && (
                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', padding: '0 16px 8px' }}>
                                Capacity: {table.capacity}
                            </div>
                        )}
                        {can('table:delete') && (
                            <div className="table-card-actions">
                                <button className="action-btn delete" onClick={() => handleDelete(table.id)}><Trash2 size={16} /></button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>Add Table</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="form-group">
                                <label>Table Name *</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Table 1" />
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

export default TablesPanel;

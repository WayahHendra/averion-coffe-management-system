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

import { Clock, ChevronRight, Package } from 'lucide-react';
import type { Order, Table } from '@/core/types';

interface RecentOrdersCardProps {
    recentActivity: Order[];
    tables: Table[];
    onSelectOrder: (order: Order) => void;
}

function RecentOrdersCard({ recentActivity, tables, onSelectOrder }: RecentOrdersCardProps) {
    return (
        <div className="admin-card">
            <div className="admin-card-header">
                <h3><Clock size={18} /> Recent Orders</h3>
                <button className="admin-link-btn">View All <ChevronRight size={14} /></button>
            </div>
            <div className="admin-card-body">
                {recentActivity.length === 0 ? (
                    <div className="admin-empty-state">
                        <Package size={32} />
                        <p>No recent activity</p>
                    </div>
                ) : (
                    <table className="admin-table mini">
                        <thead>
                            <tr>
                                <th rowSpan={2}>Order ID</th>
                                <th rowSpan={2}>Type</th>
                                <th rowSpan={2}>Table</th>
                                <th rowSpan={2}>Total</th>
                                <th colSpan={2} style={{ textAlign: 'center' }}>Payment</th>
                            </tr>
                            <tr>
                                <th>Method</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentActivity.map((item) => {
                                if (!item) return null;
                                const type = item.order_type || 'dine-in';
                                const typeClass = (type || '').toLowerCase().replace(' ', '-');
                                const isTakeaway = typeClass === 'takeaway';

                                let tableName = '-';
                                if (!isTakeaway && item.table_id) {
                                    const table = tables.find(t => t.id === item.table_id);
                                    tableName = table ? table.name : `Table ${item.table_id}`;
                                }

                                return (
                                    <tr key={item.id} onClick={() => onSelectOrder(item)} style={{ cursor: 'pointer' }}>
                                        <td className="order-id" title={item.order_code || `ORD-${item.id}`}>
                                            {item.order_code || `ORD-${item.id}`}
                                        </td>
                                        <td><span className={`order-type-badge ${typeClass}`}>{type}</span></td>
                                        <td>{tableName}</td>
                                        <td className="order-total">Rp {item.total?.toLocaleString('id-ID') || '0'}</td>
                                        <td style={{ textTransform: 'capitalize' }}>{item.payment_method || '-'}</td>
                                        <td><span className={`status-badge ${item.payment_status || 'pending'}`}>{item.payment_status || 'pending'}</span></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default RecentOrdersCard;

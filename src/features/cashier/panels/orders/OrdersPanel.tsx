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
import { Search, Filter, ChevronDown, Eye, X, Coffee, Package } from 'lucide-react';
import { mockService } from '@/services/mock';
import SkeletonBox from '@/components/atoms/SkeletonBox';
import ImageWithSkeleton from '@/components/atoms/ImageWithSkeleton';
import type { Order, Table } from '@/core/types';

// ==================== OrdersPanel ====================
function OrdersPanel() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const allOrders = mockService.getOrders() as Order[];
        const allTables = mockService.getTables();
        setOrders(allOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        setTables(allTables);
        setLoading(false);
    }, []);

    const filteredOrders = orders.filter(o => {
        const matchesSearch = (o.order_code || `ORD-${o.id}`).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || o.payment_status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

    const getTableName = (tableId: number | null | undefined) => {
        if (!tableId) return '-';
        const table = tables.find(t => t.id === tableId);
        return table ? table.name : `Table ${tableId}`;
    };

    const statusOptions = ['all', 'paid', 'completed', 'pending', 'cancelled'];

    return (
        <div className="admin-panel">
            <div className="admin-page-header">
                <div>
                    <h2>Orders</h2>
                    <p>View and manage all orders ({orders.length} total)</p>
                </div>
            </div>

            <div className="admin-toolbar">
                <div className="admin-search">
                    <Search size={18} />
                    <input type="text" placeholder="Search by order code..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div className="admin-filter" style={{ position: 'relative', background: 'transparent', border: 'none', padding: 0 }}>
                    <button
                        type="button"
                        onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px',
                            background: 'white', border: '1px solid var(--color-border-light)', borderRadius: '8px',
                            cursor: 'pointer', fontSize: 'var(--font-size-sm)', fontFamily: 'inherit',
                            fontWeight: 500, color: 'var(--color-text-secondary)', minWidth: '160px'
                        }}
                    >
                        <Filter size={18} />
                        <span style={{ flex: 1, textAlign: 'left', textTransform: 'capitalize' }}>
                            {statusFilter === 'all' ? 'All Status' : statusFilter}
                        </span>
                        <ChevronDown size={14} style={{ color: 'var(--color-text-muted)', transform: filterDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>
                    {filterDropdownOpen && (
                        <div style={{
                            position: 'absolute', top: 'calc(100% + 8px)', right: 0, minWidth: '180px',
                            background: 'white', borderRadius: '12px', filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.15))',
                            zIndex: 1000, padding: '8px'
                        }}>
                            <div style={{ position: 'absolute', top: '-6px', right: '16px', width: '12px', height: '12px', background: 'white', transform: 'rotate(45deg)', zIndex: 1 }} />
                            <div style={{ position: 'relative', zIndex: 2 }}>
                                {statusOptions.map(status => (
                                    <button
                                        key={status}
                                        type="button"
                                        onClick={() => { setStatusFilter(status); setFilterDropdownOpen(false); }}
                                        style={{
                                            width: '100%', padding: '10px 12px',
                                            background: statusFilter === status ? 'var(--color-bg-secondary)' : 'transparent',
                                            border: 'none', borderRadius: '6px', cursor: 'pointer',
                                            fontSize: 'var(--font-size-sm)', textAlign: 'left', textTransform: 'capitalize',
                                            color: statusFilter === status ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                            fontWeight: statusFilter === status ? 600 : 500
                                        }}
                                    >{status === 'all' ? 'All Status' : status}</button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="admin-table-container">
                {loading ? (
                    <table className="admin-table">
                        <thead><tr><th>Order Code</th><th>Type</th><th>Table</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                        <tbody>
                            {Array(5).fill(0).map((_, i) => (
                                <tr key={i}>
                                    <td><SkeletonBox width="100px" height="16px" /></td>
                                    <td><SkeletonBox width="70px" height="24px" style={{ borderRadius: '20px' }} /></td>
                                    <td><SkeletonBox width="60px" height="16px" /></td>
                                    <td><SkeletonBox width="90px" height="16px" /></td>
                                    <td><SkeletonBox width="60px" height="16px" /></td>
                                    <td><SkeletonBox width="60px" height="24px" style={{ borderRadius: '20px' }} /></td>
                                    <td><SkeletonBox width="100px" height="16px" /></td>
                                    <td><SkeletonBox width="28px" height="28px" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table className="admin-table">
                        <thead><tr><th>Order Code</th><th>Type</th><th>Table</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                        <tbody>
                            {paginatedOrders.map(order => {
                                const type = order.order_type || 'dine-in';
                                const typeClass = type.toLowerCase().replace('_', '-').replace(' ', '-');
                                return (
                                    <tr key={order.id}>
                                        <td className="order-id" title={order.order_code || `ORD-${order.id}`}>{order.order_code || `ORD-${order.id}`}</td>
                                        <td><span className={`order-type-badge ${typeClass}`}>{type.replace('_', '-')}</span></td>
                                        <td>{getTableName(order.table_id)}</td>
                                        <td className="price">Rp {(order.total || 0).toLocaleString('id-ID')}</td>
                                        <td style={{ textTransform: 'capitalize' }}>{order.payment_method || '-'}</td>
                                        <td><span className={`status-badge ${order.payment_status || 'pending'}`}>{order.payment_status || 'pending'}</span></td>
                                        <td style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{new Date(order.created_at).toLocaleDateString('id-ID')}</td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="action-btn edit" onClick={() => setSelectedOrder(order)}><Eye size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {paginatedOrders.length === 0 && (
                                <tr><td colSpan={8} className="admin-empty">No orders found</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {!loading && totalPages > 1 && (
                <div className="admin-pagination">
                    <button className="pagination-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>← Prev</button>
                    <span className="pagination-info">Page {currentPage} of {totalPages} ({filteredOrders.length} orders)</span>
                    <button className="pagination-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next →</button>
                </div>
            )}

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="admin-modal-header">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <h3>Order Details</h3>
                                <span className="order-id" style={{ fontSize: '13px' }}>{selectedOrder.order_code || `ORD-${selectedOrder.id}`}</span>
                            </div>
                            <button className="close-btn" onClick={() => setSelectedOrder(null)}><X size={20} /></button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date & Time</label>
                                    <div style={{ fontSize: '14px', fontWeight: '500' }}>{new Date(selectedOrder.created_at).toLocaleString('id-ID')}</div>
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <span className={`status-badge ${selectedOrder.payment_status || 'pending'}`} style={{ width: 'fit-content' }}>
                                        {selectedOrder.payment_status || 'pending'}
                                    </span>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Table</label>
                                    <div className="role-badge staff">{getTableName(selectedOrder.table_id)}</div>
                                </div>
                                <div className="form-group">
                                    <label>Type</label>
                                    <div style={{ textTransform: 'capitalize', fontWeight: '500' }}>{selectedOrder.order_type}</div>
                                </div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-light)', margin: '4px 0' }} />

                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '12px', display: 'block' }}>Order Items</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {(selectedOrder.order_items || []).map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div className="product-thumb" style={{ width: '40px', height: '40px' }}>
                                                    {item.product?.image ? <ImageWithSkeleton src={item.product.image} alt={item.product.name} /> : <Coffee size={18} />}
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '14px', fontWeight: '500' }}>{item.product?.name || 'Unknown'}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                                        {item.size?.name && `${item.size.name}, `}{item.sugar_level?.name || ''}
                                                        <span style={{ marginLeft: '6px' }}>x{item.quantity}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ fontWeight: '600', fontSize: '14px' }}>Rp {item.subtotal?.toLocaleString('id-ID')}</div>
                                        </div>
                                    ))}
                                    {(selectedOrder.order_items || []).length === 0 && (
                                        <div className="admin-empty-state"><Package size={24} /><p>No items</p></div>
                                    )}
                                </div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-light)', margin: '4px 0' }} />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                                    <span>Subtotal</span><span>Rp {selectedOrder.subtotal?.toLocaleString('id-ID')}</span>
                                </div>
                                {(selectedOrder.discount ?? 0) > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-success)' }}>
                                        <span>Discount</span><span>-Rp {selectedOrder.discount?.toLocaleString('id-ID')}</span>
                                    </div>
                                )}
                                {(selectedOrder.tax ?? 0) > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                                        <span>Tax</span><span>Rp {selectedOrder.tax?.toLocaleString('id-ID')}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '700', marginTop: '8px' }}>
                                    <span>Total</span><span style={{ color: 'var(--color-accent)' }}>Rp {selectedOrder.total?.toLocaleString('id-ID')}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                                    <span>Payment Method</span><span style={{ textTransform: 'capitalize', fontWeight: '500' }}>{selectedOrder.payment_method || '-'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="admin-btn primary" onClick={() => setSelectedOrder(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrdersPanel;

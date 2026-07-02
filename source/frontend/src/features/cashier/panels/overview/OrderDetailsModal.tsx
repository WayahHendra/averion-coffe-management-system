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

import { Coffee, X } from 'lucide-react';
import ImageWithSkeleton from '@/components/atoms/ImageWithSkeleton';
import type { Order, Table } from '@/core/types';

interface OrderDetailsModalProps {
    order: Order;
    tables: Table[];
    onClose: () => void;
}

function OrderDetailsModal({ order, onClose, tables }: OrderDetailsModalProps) {
    const items = (order as any).order_items || [];

    // Find table name
    let tableName = '-';
    if (order.table_id) {
        const table = tables.find(t => t.id === order.table_id);
        tableName = table ? table.name : `Table ${order.table_id}`;
    }

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <div className="admin-modal-header">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <h3>Order Details</h3>
                        <span className="order-id" style={{ fontSize: '13px' }}>{order.order_code || `ORD-${order.id}`}</span>
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="admin-modal-body">
                    {/* Header Info */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Date & Time</label>
                            <div style={{ fontSize: '14px', fontWeight: '500' }}>
                                {new Date(order.created_at).toLocaleString('id-ID')}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <span className={`status-badge ${order.payment_status || 'pending'}`} style={{ width: 'fit-content' }}>
                                {order.payment_status || 'pending'}
                            </span>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Table</label>
                            <div className="role-badge staff">{tableName}</div>
                        </div>
                        <div className="form-group">
                            <label>Type</label>
                            <div style={{ textTransform: 'capitalize', fontWeight: '500' }}>{order.order_type}</div>
                        </div>
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-light)', margin: '4px 0' }} />

                    {/* Items List */}
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '12px', display: 'block' }}>Order Items</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {items.map((item: any, idx: number) => (
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
                                    <div style={{ fontWeight: '600', fontSize: '14px' }}>
                                        Rp {item.subtotal?.toLocaleString('id-ID')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-light)', margin: '4px 0' }} />

                    {/* Payment Summary */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                            <span>Subtotal</span>
                            <span>Rp {order.subtotal?.toLocaleString('id-ID')}</span>
                        </div>
                        {(order.tax ?? 0) > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                                <span>Tax (12%)</span>
                                <span>Rp {order.tax?.toLocaleString('id-ID')}</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '700', marginTop: '8px' }}>
                            <span>Total</span>
                            <span style={{ color: 'var(--color-accent)' }}>Rp {order.total?.toLocaleString('id-ID')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                            <span>Payment Method</span>
                            <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>{order.payment_method || '-'}</span>
                        </div>
                    </div>
                </div>
                <div className="admin-modal-footer">
                    <button className="admin-btn primary" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default OrderDetailsModal;

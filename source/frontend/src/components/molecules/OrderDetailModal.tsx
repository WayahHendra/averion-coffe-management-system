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

import { X, Coffee } from 'lucide-react';
import ImageWithSkeleton from '../atoms/ImageWithSkeleton';

interface OrderItemData {
    id: string;
    product_id: string;
    product_name: string;
    product_image: string;
    price: number;
    quantity: number;
    size?: { id: string; name: string; price_modifier: number };
    sugar_level?: { id: string; name: string };
    subtotal: number;
}

interface OrderDetail {
    id: string;
    type: 'order' | 'booking';
    items: OrderItemData[];
    order_type: 'dine-in' | 'takeaway';
    table_id?: number;
    customer_name?: string;
    number_of_guests?: number;
    booking_date_time?: string;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    payment_method: string | null;
    payment_status: string | null;
    created_at: string;
}

interface OrderDetailModalProps {
    detail: OrderDetail | null;
    onClose: () => void;
}

function OrderDetailModal({ detail, onClose }: OrderDetailModalProps) {
    if (!detail) return null;

    const isBooking = detail.type === 'booking';
    const typeLabel = isBooking ? 'Dine-In (Booking)' : detail.order_type;
    const tableName = detail.table_id ? `Table ${detail.table_id}` : '-';

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <div className="admin-modal-header">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <h3>{isBooking ? 'Booking Details' : 'Order Details'}</h3>
                        <span className="order-id" style={{ fontSize: '13px' }}>{detail.id}</span>
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="admin-modal-body">
                    {/* Header Info */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Date & Time</label>
                            <div style={{ fontSize: '14px', fontWeight: '500' }}>
                                {new Date(detail.created_at).toLocaleString('id-ID')}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <span className={`status-badge ${detail.payment_status || 'pending'}`} style={{ width: 'fit-content' }}>
                                {detail.payment_status || 'pending'}
                            </span>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Customer / Table</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ fontWeight: '500' }}>{detail.customer_name || 'Guest'}</div>
                                <span style={{ color: 'var(--color-text-muted)' }}>•</span>
                                <div className="role-badge staff">{tableName}</div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Type</label>
                            <div style={{ textTransform: 'capitalize', fontWeight: '500' }}>{typeLabel}</div>
                        </div>
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-light)', margin: '4px 0' }} />

                    {/* Items List */}
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '12px', display: 'block' }}>Order Items</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {detail.items.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className="product-thumb" style={{ width: '40px', height: '40px' }}>
                                            {item.product_image ? <ImageWithSkeleton src={item.product_image} alt={item.product_name} /> : <Coffee size={18} />}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: '500' }}>{item.product_name}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                                {item.size?.name}, {item.sugar_level?.name}
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
                            <span>Rp {detail.subtotal?.toLocaleString('id-ID')}</span>
                        </div>
                        {detail.discount > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-success)' }}>
                                <span>Discount</span>
                                <span>-Rp {detail.discount?.toLocaleString('id-ID')}</span>
                            </div>
                        )}
                        {detail.tax > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                                <span>Tax (12%)</span>
                                <span>Rp {detail.tax?.toLocaleString('id-ID')}</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '700', marginTop: '8px' }}>
                            <span>Total</span>
                            <span style={{ color: 'var(--color-accent)' }}>Rp {detail.total?.toLocaleString('id-ID')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                            <span>Payment Method</span>
                            <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>{detail.payment_method || '-'}</span>
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

export default OrderDetailModal;

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
import { Search, Filter, ChevronDown, Eye, X, Coffee, Package, Users as UsersIcon } from 'lucide-react';
import { mockService } from '@/services/mock';
import SkeletonBox from '@/components/atoms/SkeletonBox';
import ImageWithSkeleton from '@/components/atoms/ImageWithSkeleton';
import type { Booking, Table } from '@/core/types';

// ==================== BookingsPanel ====================
function BookingsPanel() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const allBookings = mockService.getBookings() as Booking[];
        const allTables = mockService.getTables();
        setBookings(allBookings.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        setTables(allTables);
        setLoading(false);
    }, []);

    const filteredBookings = bookings.filter(b => {
        const matchesSearch = b.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const paginatedBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

    const getTableName = (tableId: number) => {
        const table = tables.find(t => t.id === tableId);
        return table ? table.name : `Table ${tableId}`;
    };

    const statusOptions = ['all', 'confirmed', 'reserved', 'completed', 'cancelled', 'pending'];
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'paid';
            case 'reserved': return 'pending';
            case 'completed': return 'completed';
            case 'cancelled': return 'cancelled';
            default: return 'pending';
        }
    };

    return (
        <div className="admin-panel">
            <div className="admin-page-header">
                <div>
                    <h2>Bookings</h2>
                    <p>View and manage table reservations ({bookings.length} total)</p>
                </div>
            </div>

            <div className="admin-toolbar">
                <div className="admin-search">
                    <Search size={18} />
                    <input type="text" placeholder="Search by customer name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
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
                        <thead><tr><th>Customer</th><th>Table</th><th>Guests</th><th>Date & Time</th><th>Pre-Order</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            {Array(5).fill(0).map((_, i) => (
                                <tr key={i}>
                                    <td><SkeletonBox width="100px" height="16px" /></td>
                                    <td><SkeletonBox width="60px" height="16px" /></td>
                                    <td><SkeletonBox width="30px" height="16px" /></td>
                                    <td><SkeletonBox width="120px" height="16px" /></td>
                                    <td><SkeletonBox width="40px" height="16px" /></td>
                                    <td><SkeletonBox width="90px" height="16px" /></td>
                                    <td><SkeletonBox width="70px" height="24px" style={{ borderRadius: '20px' }} /></td>
                                    <td><SkeletonBox width="28px" height="28px" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table className="admin-table">
                        <thead><tr><th>Customer</th><th>Table</th><th>Guests</th><th>Date & Time</th><th>Pre-Order</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            {paginatedBookings.map(booking => (
                                <tr key={booking.id}>
                                    <td style={{ fontWeight: '500' }}>{booking.customer_name}</td>
                                    <td>{getTableName(booking.table_id)}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <UsersIcon size={14} /> {booking.number_of_guests}
                                        </div>
                                    </td>
                                    <td style={{ fontSize: '12px' }}>{new Date(booking.booking_date_time).toLocaleString('id-ID')}</td>
                                    <td>{booking.pre_order_items?.length || 0} items</td>
                                    <td className="price">
                                        {booking.total > 0 ? `Rp ${booking.total.toLocaleString('id-ID')}` : '-'}
                                    </td>
                                    <td><span className={`status-badge ${getStatusColor(booking.status)}`}>{booking.status}</span></td>
                                    <td>
                                        <div className="action-btns">
                                            <button className="action-btn edit" onClick={() => setSelectedBooking(booking)}><Eye size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paginatedBookings.length === 0 && (
                                <tr><td colSpan={8} className="admin-empty">No bookings found</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {!loading && totalPages > 1 && (
                <div className="admin-pagination">
                    <button className="pagination-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>← Prev</button>
                    <span className="pagination-info">Page {currentPage} of {totalPages} ({filteredBookings.length} bookings)</span>
                    <button className="pagination-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next →</button>
                </div>
            )}

            {/* Booking Detail Modal */}
            {selectedBooking && (
                <div className="admin-modal-overlay" onClick={() => setSelectedBooking(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="admin-modal-header">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <h3>Booking Details</h3>
                                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>#{selectedBooking.id}</span>
                            </div>
                            <button className="close-btn" onClick={() => setSelectedBooking(null)}><X size={20} /></button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Customer</label>
                                    <div style={{ fontSize: '14px', fontWeight: '600' }}>{selectedBooking.customer_name}</div>
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <span className={`status-badge ${getStatusColor(selectedBooking.status)}`} style={{ width: 'fit-content' }}>
                                        {selectedBooking.status}
                                    </span>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Table</label>
                                    <div className="role-badge staff">{getTableName(selectedBooking.table_id)}</div>
                                </div>
                                <div className="form-group">
                                    <label>Guests</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
                                        <UsersIcon size={16} /> {selectedBooking.number_of_guests} guests
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Booking Date & Time</label>
                                <div style={{ fontSize: '14px', fontWeight: '500' }}>{new Date(selectedBooking.booking_date_time).toLocaleString('id-ID')}</div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-light)', margin: '4px 0' }} />

                            {/* Pre-Order Items */}
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '12px', display: 'block' }}>
                                    Pre-Order Items ({selectedBooking.pre_order_items?.length || 0})
                                </label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {(selectedBooking.pre_order_items || []).map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div className="product-thumb" style={{ width: '40px', height: '40px' }}>
                                                    {item.product_image ? <ImageWithSkeleton src={item.product_image} alt={item.product_name} /> : <Coffee size={18} />}
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '14px', fontWeight: '500' }}>{item.product_name}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                                        {item.size?.name && `${item.size.name}, `}{item.sugar_level?.name || ''}
                                                        <span style={{ marginLeft: '6px' }}>x{item.quantity}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ fontWeight: '600', fontSize: '14px' }}>Rp {item.subtotal?.toLocaleString('id-ID')}</div>
                                        </div>
                                    ))}
                                    {(selectedBooking.pre_order_items || []).length === 0 && (
                                        <div className="admin-empty-state"><Package size={24} /><p>No pre-order items</p></div>
                                    )}
                                </div>
                            </div>

                            {selectedBooking.total > 0 && (
                                <>
                                    <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-light)', margin: '4px 0' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                                            <span>Subtotal</span><span>Rp {selectedBooking.subtotal?.toLocaleString('id-ID')}</span>
                                        </div>
                                        {(selectedBooking.discount ?? 0) > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-success)' }}>
                                                <span>Discount</span><span>-Rp {selectedBooking.discount?.toLocaleString('id-ID')}</span>
                                            </div>
                                        )}
                                        {(selectedBooking.tax ?? 0) > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                                                <span>Tax</span><span>Rp {selectedBooking.tax?.toLocaleString('id-ID')}</span>
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '700', marginTop: '8px' }}>
                                            <span>Total</span><span style={{ color: 'var(--color-accent)' }}>Rp {selectedBooking.total?.toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {selectedBooking.voucher_code && (
                                <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                                    Voucher: <span style={{ fontWeight: '600', color: 'var(--color-accent)' }}>{selectedBooking.voucher_code}</span>
                                </div>
                            )}
                        </div>
                        <div className="admin-modal-footer">
                            <button className="admin-btn primary" onClick={() => setSelectedBooking(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookingsPanel;

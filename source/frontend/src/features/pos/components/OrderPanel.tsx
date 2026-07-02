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

import { useState, useCallback, useMemo } from 'react';
import { OrderItem as OrderItemType, Table, Voucher } from '@/core/types';
import { apiService } from '@/services/api';
import { formatCurrency } from '@/utils/formatters';
import OrderItem from '@/components/molecules/OrderItem';
import PaymentModal from './PaymentModal';
import OrderTypeDropdown from '@/components/molecules/OrderTypeDropdown';
import TableSelector from '@/components/molecules/TableSelector';
import DatePicker from '@/components/molecules/DatePicker';
import TimePicker from '@/components/molecules/TimePicker';
import {
    ShoppingCart,
    Tag,
    RotateCcw,
    SquareChartGantt,
    CalendarPlus,
    ChevronDown,
    User,
    Users,
} from 'lucide-react';

interface OrderPanelProps {
    orderItems: OrderItemType[];
    onUpdateQuantity: (itemId: number, delta: number) => void;
    onRemoveItem: (itemId: number) => void;
    tables: Table[];
    storeStatus: 'open' | 'closed';
    vouchers: Voucher[];
}

export default function OrderPanel({
    orderItems,
    onUpdateQuantity,
    onRemoveItem,
    tables,
    storeStatus,
    vouchers,
}: OrderPanelProps) {
    const [orderType, setOrderType] = useState<'dine-in' | 'takeaway'>('dine-in');
    const [selectedTableId, setSelectedTableId] = useState<number | undefined>(undefined);
    const [isDiscountInput, setIsDiscountInput] = useState(false);
    const [voucherCode, setVoucherCode] = useState('');
    const [validation, setValidation] = useState<{ status: 'idle' | 'valid' | 'invalid' | 'expired'; message: string }>({ status: 'idle', message: '' });
    const [isResetting, setIsResetting] = useState(false);
    const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);
    const [removingItemId, setRemovingItemId] = useState<number | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [isBookingFormCollapsed, setIsBookingFormCollapsed] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(2);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

    const subtotal = useMemo(() => {
        return orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    }, [orderItems]);

    const discount = useMemo(() => {
        if (validation.status === 'valid') {
            const found = vouchers.find(v => v.code.toLowerCase() === voucherCode.trim().toLowerCase());
            if (found) {
                if (found.type === 'percentage') {
                    return Math.round(subtotal * (found.value / 100));
                }
                // Diskon nominal tidak boleh melebihi subtotal (hindari total minus)
                return Math.min(found.value, subtotal);
            }
        }
        return 0;
    }, [subtotal, validation.status, voucherCode, vouchers]);

    const tax = useMemo(() => {
        return Math.round((subtotal - discount) * 0.12);
    }, [subtotal, discount]);

    const total = useMemo(() => {
        return subtotal - discount + tax;
    }, [subtotal, discount, tax]);

    const validateVoucher = useCallback(() => {
        if (!voucherCode.trim()) return;
        const found = vouchers.find(v => v.code.toLowerCase() === voucherCode.trim().toLowerCase());
        if (!found) {
            setValidation({ status: 'invalid', message: 'Invalid voucher code' });
            return;
        }
        const now = new Date();
        const expiry = new Date(found.expiry_date);
        if (now > expiry) {
            setValidation({ status: 'expired', message: 'Voucher has expired' });
            return;
        }
        setValidation({ status: 'valid', message: `Voucher applied: ${found.type === 'percentage' ? found.value + '%' : formatCurrency(found.value)} off` });
    }, [voucherCode, vouchers]);

    const handleItemRemove = useCallback((itemId: number) => {
        setRemovingItemId(itemId);
        setTimeout(() => {
            onRemoveItem(itemId);
            setRemovingItemId(null);
        }, 300);
    }, [onRemoveItem]);

    const handleReset = useCallback(() => {
        setIsResetting(true);
        setTimeout(() => {
            orderItems.forEach(item => onRemoveItem(item.id));
            setSelectedTableId(undefined);
            setIsDiscountInput(false);
            setVoucherCode('');
            setValidation({ status: 'idle', message: '' });
            setIsBookingOpen(false);
            setCustomerName('');
            setNumberOfGuests(2);
            setBookingDate('');
            setBookingTime('');
            setIsResetting(false);
        }, 300);
    }, [orderItems, onRemoveItem]);

    const handlePayNow = useCallback(() => {
        setIsPaymentModalOpen(true);
    }, []);

    const handleBookingSubmit = useCallback(() => {
        if (!customerName || !selectedTableId || !bookingDate || !bookingTime) return;
        
        setIsSubmittingBooking(true);
        // Simulate local "creation" delay for UX
        setTimeout(() => {
            setIsSubmittingBooking(false);
            setIsPaymentModalOpen(true);
        }, 1500);
    }, [customerName, selectedTableId, bookingDate, bookingTime]);

    const handlePaymentComplete = useCallback(async (method: 'qris' | 'cash') => {
        setIsPaymentModalOpen(false);

        // Simpan transaksi ke backend
        const items = orderItems.map(item => ({
            product_id: item.product.id,
            quantity: item.quantity,
            size: item.size || null,
            sugar_level: item.sugar_level || null,
        }));
        const appliedVoucher = validation.status === 'valid' ? voucherCode.trim() : null;
        try {
            if (isBookingOpen) {
                await apiService.createBooking({
                    customer_name: customerName,
                    table_id: selectedTableId!,
                    number_of_guests: numberOfGuests,
                    booking_date_time: `${bookingDate}T${bookingTime}:00`,
                    payment_method: method,
                    voucher_code: appliedVoucher,
                    items,
                });
            } else {
                await apiService.createOrder({
                    order_type: orderType,
                    table_id: orderType === 'dine-in' ? selectedTableId : null,
                    payment_method: method,
                    voucher_code: appliedVoucher,
                    items,
                });
            }
        } catch (e) {
            alert(e instanceof Error ? e.message : 'Gagal menyimpan transaksi');
        }

        // Reset cart
        orderItems.forEach(item => onRemoveItem(item.id));
        
        // Reset states
        setSelectedTableId(undefined);
        setIsDiscountInput(false);
        setVoucherCode('');
        setValidation({ status: 'idle', message: '' });
        setIsBookingOpen(false);
        setCustomerName('');
        setNumberOfGuests(2);
        setBookingDate('');
        setBookingTime('');
    }, [orderItems, onRemoveItem, isBookingOpen, orderType, selectedTableId, customerName,
        numberOfGuests, bookingDate, bookingTime, voucherCode, validation.status]);

    return (
        <>
            <aside className="order-panel">
                {/* Order Header */}
                <div className="order-header">
                    <h3 className="order-title">
                        <SquareChartGantt size={16} />
                        Order Details
                    </h3>
                    <div className="order-actions">
                        <OrderTypeDropdown
                            orderType={orderType}
                            onChange={(type) => {
                                setOrderType(type);
                                setIsBookingOpen(false);
                            }}
                            onTriggerClick={() => setIsBookingOpen(false)}
                            isActive={!isBookingOpen}
                        />
                        <button
                            className={`booking-trigger ${isBookingOpen ? 'active-mode' : ''}`}
                            onClick={() => setIsBookingOpen(!isBookingOpen)}
                            title="New Booking"
                        >
                            <CalendarPlus size={14} />
                            <span className="btn-text">Booking</span>
                        </button>
                    </div>
                </div>

                {/* Order Items */}
                <div className={`order-items ${storeStatus === 'closed' ? 'store-closed' : ''}`}>
                    {orderItems.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <ShoppingCart size={48} strokeWidth={1} />
                            </div>
                            <p className="empty-state-text">No items in order</p>
                        </div>
                    ) : (
                        orderItems.map((item, index) => (
                            <div
                                key={item.id}
                                className={isResetting || removingItemId === item.id ? 'slide-out-left' : ''}
                                style={{ animationDelay: isResetting ? `${(orderItems.length - 1 - index) * 150}ms` : '0ms' }}
                            >
                                <OrderItem
                                    item={item}
                                    onUpdateQuantity={onUpdateQuantity}
                                    onRemove={handleItemRemove}
                                />
                            </div>
                        ))
                    )}
                </div>

                {/* Table Selector or Booking Form */}
                {isBookingOpen ? (
                    <div style={{ padding: '16px', borderTop: '1px solid var(--color-border-light)', position: 'relative' }}>
                        {/* Dismiss Toggle */}
                        <button
                            onClick={() => setIsBookingFormCollapsed(!isBookingFormCollapsed)}
                            style={{
                                position: 'absolute',
                                top: '-12px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'var(--color-bg-secondary)',
                                border: '1px solid var(--color-border-light)',
                                borderRadius: '12px',
                                padding: '2px 8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--color-text-secondary)',
                                fontSize: '10px',
                                height: '24px',
                                zIndex: 10
                            }}
                        >
                            <ChevronDown size={14} style={{ transform: isBookingFormCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                        </button>

                        {/* Collapsible Booking Form Content */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateRows: isBookingFormCollapsed ? '0fr' : '1fr',
                                opacity: isBookingFormCollapsed ? 0 : 1,
                                transition: 'grid-template-rows 0.3s ease-out, opacity 0.3s ease-out'
                            }}
                        >
                            <div style={{ overflow: 'hidden' }}>
                                {/* Customer Name */}
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                                        <User size={14} />
                                        Customer Name *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter customer name"
                                        className="booking-input"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid var(--color-border-light)',
                                            borderRadius: '8px',
                                            fontSize: 'var(--font-size-sm)',
                                            fontWeight: 500,
                                            background: 'white',
                                            color: 'var(--color-text-secondary)',
                                            outline: 'none'
                                        }}
                                    />
                                </div>

                                {/* Date and Time */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                    <div>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                                            Date *
                                        </label>
                                        <DatePicker
                                            value={bookingDate}
                                            onChange={setBookingDate}
                                            placeholder="dd/mm/yyyy"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                                            Time *
                                        </label>
                                        <TimePicker
                                            value={bookingTime}
                                            onChange={setBookingTime}
                                            placeholder="--:--"
                                            disabled={!bookingDate}
                                            selectedDate={bookingDate}
                                        />
                                    </div>
                                </div>

                                {/* Table and Guests */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '0px' }}>
                                    <div>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                                            Table *
                                        </label>
                                        <TableSelector
                                            tables={tables}
                                            selectedTableId={selectedTableId}
                                            onSelect={setSelectedTableId}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                                            <Users size={14} />
                                            Guests
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="20"
                                            value={numberOfGuests}
                                            onChange={(e) => setNumberOfGuests(parseInt(e.target.value) || 1)}
                                            style={{
                                                width: '100%',
                                                padding: '10px 12px',
                                                border: '1px solid var(--color-border-light)',
                                                borderRadius: '8px',
                                                fontSize: 'var(--font-size-sm)',
                                                fontWeight: 500,
                                                background: 'white',
                                                color: 'var(--color-text-secondary)',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : orderType === 'dine-in' && (
                    <div style={{ padding: '16px 16px 16px 16px', borderTop: '1px solid var(--color-border-light)', marginBottom: '0px' }}>
                        <TableSelector
                            tables={tables}
                            selectedTableId={selectedTableId}
                            onSelect={setSelectedTableId}
                        />
                    </div>
                )}

                {/* Order Summary */}
                <div className="order-summary" style={{ position: 'relative' }}>
                    <button
                        onClick={() => setIsSummaryCollapsed(!isSummaryCollapsed)}
                        className="summary-toggle-btn"
                        style={{
                            position: 'absolute',
                            top: '-12px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border-light)',
                            borderRadius: '12px',
                            padding: '2px 8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-text-secondary)',
                            fontSize: '10px',
                            height: '24px'
                        }}
                    >
                        <ChevronDown size={14} style={{ transform: isSummaryCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                    </button>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateRows: isSummaryCollapsed ? '0fr' : '1fr',
                            opacity: isSummaryCollapsed ? 0 : 1,
                            transition: 'grid-template-rows 0.3s ease-out, opacity 0.3s ease-out, margin-bottom 0.3s ease-out',
                            marginBottom: isSummaryCollapsed ? '0px' : '4px'
                        }}
                    >
                        <div style={{ overflow: 'hidden' }}>
                            {/* Voucher Section */}
                            <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '16px' }}>
                                {isDiscountInput || voucherCode ? (
                                    <div
                                        className={`voucher-input-container ${validation.status}`}
                                        style={{ marginBottom: 0 }}
                                    >
                                        <div
                                            className={`discount-input-wrapper ${validation.status !== 'idle' ? `validation-${validation.status}` : ''}`}
                                            onClick={() => validation.status !== 'idle' && setValidation({ status: 'idle', message: '' })}
                                            style={{ cursor: validation.status !== 'idle' ? 'pointer' : 'default' }}
                                        >
                                            {validation.status !== 'idle' ? (
                                                <span className="voucher-code-display">
                                                    <Tag size={14} className="voucher-icon" />
                                                    {voucherCode}
                                                </span>
                                            ) : (
                                                <input
                                                    type="text"
                                                    placeholder="Enter voucher code"
                                                    className="discount-input"
                                                    autoFocus
                                                    value={voucherCode}
                                                    onChange={(e) => {
                                                        setVoucherCode(e.target.value.toUpperCase());
                                                    }}
                                                    onBlur={() => {
                                                        if (!voucherCode) {
                                                            setIsDiscountInput(false);
                                                        } else {
                                                            validateVoucher();
                                                        }
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            validateVoucher();
                                                            (e.target as HTMLInputElement).blur();
                                                        }
                                                    }}
                                                />
                                            )}
                                        </div>
                                        {validation.status !== 'idle' && (
                                            <div className={`voucher-status-message ${validation.status}`}>
                                                {validation.message}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        className="discount-btn"
                                        onClick={() => setIsDiscountInput(true)}
                                        style={{ marginBottom: 0 }}
                                    >
                                        <Tag size={14} />
                                        Add Discount
                                    </button>
                                )}
                            </div>

                            <div className="summary-row">
                                <span className="summary-label">Sub Total</span>
                                <span className="summary-value">{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="summary-row">
                                <span className="summary-label">Discount</span>
                                <span className="summary-value">-{formatCurrency(discount)}</span>
                            </div>
                            <div className="summary-row">
                                <span className="summary-label">Tax 12%</span>
                                <span className="summary-value">{formatCurrency(tax)}</span>
                            </div>
                        </div>
                    </div>

                    <div
                        className="summary-row total"
                        style={{
                            marginTop: '4px',
                            paddingTop: '8px',
                            borderTop: 'none',
                            transition: 'all 0.3s ease-out'
                        }}
                    >
                        <span className="summary-label">Total Payment</span>
                        <span className="summary-value">{formatCurrency(total)}</span>
                    </div>
                </div>

                {/* Order Footer */}
                <div className="order-footer">
                    <div className="footer-buttons">
                        {isBookingOpen ? (
                            <button
                                className="btn-pay-now"
                                disabled={!customerName || !selectedTableId || !bookingDate || !bookingTime || isSubmittingBooking}
                                onClick={handleBookingSubmit}
                            >
                                {isSubmittingBooking ? 'Booking...' : 'Book & Pay Now'}
                            </button>
                        ) : (
                            <button
                                className="btn-pay-now"
                                disabled={orderItems.length === 0 || (orderType === 'dine-in' && !selectedTableId)}
                                onClick={handlePayNow}
                            >
                                Pay Now
                            </button>
                        )}
                        <button
                            className="btn-footer-secondary"
                            onClick={handleReset}
                            title="Reset Order"
                            disabled={orderItems.length === 0 || isResetting}
                        >
                            <RotateCcw size={16} className={isResetting ? 'spin' : ''} />
                        </button>
                    </div>
                </div>
            </aside>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                total={total}
                onPaymentComplete={handlePaymentComplete}
            />
        </>
    );
}



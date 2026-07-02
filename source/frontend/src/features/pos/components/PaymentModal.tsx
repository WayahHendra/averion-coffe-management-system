import React, { useState } from 'react';
import { X, QrCode, Banknote, Check, Clock, Info, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    total: number;
    onPaymentComplete?: (method: 'qris' | 'cash') => void;
}

type PaymentMethod = 'qris' | 'cash' | null;
type PaymentStatus = 'selecting' | 'waiting' | 'qris_ready' | 'processing' | 'success' | 'failed';

const PaymentModal: React.FC<PaymentModalProps> = ({
    isOpen,
    onClose,
    total,
    onPaymentComplete
}) => {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('selecting');
    const [qrLoaded, setQrLoaded] = useState<boolean>(false);

    if (!isOpen) return null;

    const handleClose = () => {
        const wasSuccess = paymentStatus === 'success';
        const method = selectedMethod || 'cash';
        setSelectedMethod(null);
        setPaymentStatus('selecting');
        setQrLoaded(false);
        onClose();
        if (wasSuccess && onPaymentComplete) {
            onPaymentComplete(method);
        }
    };

    const handleMethodSelect = (method: PaymentMethod) => {
        setSelectedMethod(method);
        if (method === 'cash') {
            setPaymentStatus('waiting');
        } else if (method === 'qris') {
            // Simulated delay for QR generation to show skeleton
            setPaymentStatus('waiting');
            setTimeout(() => {
                setPaymentStatus('qris_ready');
            }, 2500);
        }
    };

    const completePayment = () => {
        setPaymentStatus('processing');
        setTimeout(() => {
            setPaymentStatus('success');
            setTimeout(() => {
                handleClose();
            }, 5000);
        }, 1500);
    };

    return (
        <div className="modal-overlay">
            <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
                <div className="payment-modal-header">
                    <h2>Payment</h2>
                    <button className="modal-close-btn" onClick={handleClose}>
                        <X size={20} />
                    </button>
                </div>

                {paymentStatus !== 'qris_ready' && paymentStatus !== 'waiting' && paymentStatus !== 'processing' && (
                    <div className="payment-total">
                        <span className="payment-total-label">Total Amount</span>
                        <span className="payment-total-value">{formatCurrency(total)}</span>
                    </div>
                )}
                
                {(paymentStatus === 'waiting' || paymentStatus === 'processing') && selectedMethod === 'cash' && (
                    <div className="payment-total">
                        <span className="payment-total-label">Total Amount</span>
                        <span className="payment-total-value">{formatCurrency(total)}</span>
                    </div>
                )}
                
                {paymentStatus === 'processing' && selectedMethod === 'qris' && (
                    <div className="payment-total">
                        <span className="payment-total-label">Total Amount</span>
                        <span className="payment-total-value">{formatCurrency(total)}</span>
                    </div>
                )}

                {paymentStatus === 'processing' ? (
                    <div className="payment-processing">
                        <div className="processing-spinner"></div>
                        <p>Processing payment...</p>
                    </div>
                ) : paymentStatus === 'success' ? (
                    <div className="payment-success">
                        <div className="success-icon">
                            <Check size={48} />
                        </div>
                        <h3>Payment Successful!</h3>
                        <p>Thank you for your purchase</p>
                    </div>
                ) : paymentStatus === 'failed' ? (
                    <div className="payment-expired">
                        <div className="expired-icon">
                            <X size={48} />
                        </div>
                        <h3>Payment Failed</h3>
                        <p>There was an issue processing your payment.</p>
                        <button
                            className="retry-btn"
                            onClick={() => {
                                setPaymentStatus('selecting');
                                setSelectedMethod(null);
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                ) : paymentStatus === 'waiting' && selectedMethod === 'cash' ? (
                    <div className="payment-waiting">
                        <div className="waiting-icon">
                            <Clock size={48} />
                        </div>
                        <h3>Waiting for Confirmation</h3>
                        <p>Please wait for the cashier to confirm your payment</p>
                        <p className="polling-info">Auto-refreshing every 3 seconds...</p>
                        <button
                            className="confirm-cash-btn"
                            onClick={completePayment}
                        >
                            Confirm Cash Payment
                        </button>
                    </div>
                ) : paymentStatus === 'qris_ready' || (paymentStatus === 'waiting' && selectedMethod === 'qris') ? (
                    <div className="payment-qris">
                        <div className="qris-code">
                            {paymentStatus === 'qris_ready' ? (
                                <div className="qris-with-logo">
                                    {!qrLoaded && (
                                        <div className="qris-skeleton">
                                            <div className="skeleton-qr"></div>
                                        </div>
                                    )}
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=DUMMY_QRIS_STATIC_PAYMENT_DATA_v0.1.0`}
                                        alt="QRIS Code"
                                        style={{ display: qrLoaded ? 'block' : 'none', width: '240px', height: '240px' }}
                                        onLoad={() => setQrLoaded(true)}
                                    />
                                    {qrLoaded && (
                                        <div className="qris-logo-overlay">
                                            <img src="./base-icon.png" alt="Brand Logo" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="qris-skeleton">
                                    <div className="skeleton-qr"></div>
                                </div>
                            )}
                        </div>
                        {(paymentStatus === 'waiting' && selectedMethod === 'qris') || !qrLoaded ? (
                            <>
                                <p className="qris-instruction skeleton-text"></p>
                                <div className="qris-countdown skeleton-text" style={{ width: '140px', margin: '0 auto' }}></div>
                                <p className="polling-info skeleton-text" style={{ width: '200px', margin: '8px auto' }}></p>
                            </>
                        ) : (
                            <>
                                <p className="qris-instruction">Scan this QR code with your banking app</p>
                                <div className="qris-countdown">
                                    <Clock size={16} />
                                    <span>Expires in: <strong>10:57</strong></span>
                                </div>
                                <p className="polling-info">Checking payment status automatically...</p>
                            </>
                        )}
                        
                        <button 
                            className="payment-status-alert waiting"
                            onClick={completePayment}
                            style={{ border: 'none', cursor: 'pointer' }}
                        >
                            <Loader2 size={18} className="spin" />
                            <span>
                                {(paymentStatus === 'waiting' && selectedMethod === 'qris') || !qrLoaded 
                                    ? 'Generating QRIS...' 
                                    : 'Waiting for Payment'}
                            </span>
                        </button>
                    </div>
                ) : !selectedMethod ? (
                    <div className="payment-methods">
                        <p className="payment-methods-title">Select Payment Method</p>
                        <div className="payment-method-options">
                            <button
                                className="payment-method-btn"
                                onClick={() => handleMethodSelect('qris')}
                            >
                                <div className="payment-method-icon qris">
                                    <QrCode size={32} />
                                </div>
                                <span className="payment-method-name">QRIS</span>
                                <span className="payment-method-desc">Scan to pay</span>
                            </button>
                            <button
                                className="payment-method-btn"
                                onClick={() => handleMethodSelect('cash')}
                            >
                                <div className="payment-method-icon cash">
                                    <Banknote size={32} />
                                </div>
                                <span className="payment-method-name">Cash</span>
                                <span className="payment-method-desc">Pay with cash</span>
                            </button>
                        </div>
                        <div className="payment-admin-alert">
                            <Info size={16} />
                            <span>Pembayaran QRIS akan dikenakan biaya admin</span>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default PaymentModal;

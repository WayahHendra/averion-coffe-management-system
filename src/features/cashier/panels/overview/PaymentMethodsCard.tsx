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

import { ShoppingBag } from 'lucide-react';

interface PaymentMethodsCardProps {
    paymentMethodStats: Record<string, number>;
    timeFilterLabel: string;
}

function PaymentMethodsCard({ paymentMethodStats, timeFilterLabel }: PaymentMethodsCardProps) {
    return (
        <div className="admin-card">
            <div className="admin-card-header">
                <h3><ShoppingBag size={18} /> Payment Methods</h3>
                <span className="filter-badge">{timeFilterLabel}</span>
            </div>
            <div className="admin-card-body">
                {Object.keys(paymentMethodStats).length === 0 ? (
                    <div className="admin-empty-state">
                        <ShoppingBag size={32} />
                        <p>No payment data yet</p>
                    </div>
                ) : (
                    <div className="payment-methods-list">
                        {Object.entries(paymentMethodStats)
                            .sort(([, a], [, b]) => b - a)
                            .map(([method, count], idx) => {
                                const total = Object.values(paymentMethodStats).reduce((a, b) => a + b, 0);
                                const percentage = Math.round((count / total) * 100);
                                return (
                                    <div key={idx} className="payment-method-item">
                                        <div className="payment-method-info">
                                            <span className="payment-method-name" style={{ textTransform: 'capitalize' }}>
                                                {method}
                                            </span>
                                            <span className="payment-method-count">{count} orders ({percentage}%)</span>
                                        </div>
                                        <div className="payment-method-bar">
                                            <div
                                                className="payment-method-bar-fill"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PaymentMethodsCard;

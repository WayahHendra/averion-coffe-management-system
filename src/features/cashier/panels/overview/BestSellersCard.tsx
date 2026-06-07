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

import { Coffee, Package } from 'lucide-react';
import ImageWithSkeleton from '@/components/atoms/ImageWithSkeleton';

interface BestSellingProduct {
    name: string;
    count: number;
    revenue: number;
    image?: string;
}

interface BestSellersCardProps {
    products: BestSellingProduct[];
    timeFilterLabel: string;
}

function BestSellersCard({ products, timeFilterLabel }: BestSellersCardProps) {
    return (
        <div className="admin-card">
            <div className="admin-card-header">
                <h3><Coffee size={18} /> Best Selling Products</h3>
                <span className="filter-badge">{timeFilterLabel}</span>
            </div>
            <div className="admin-card-body">
                {products.length === 0 ? (
                    <div className="admin-empty-state">
                        <Package size={32} />
                        <p>No sales data yet</p>
                    </div>
                ) : (
                    <div className="best-selling-list">
                        {products.map((product, idx) => (
                            <div key={idx} className="best-selling-item">
                                <div className="best-selling-rank">{idx + 1}</div>
                                <div className="product-thumb">
                                    {product.image ? (
                                        <ImageWithSkeleton src={product.image} alt={product.name} />
                                    ) : (
                                        <Coffee size={18} />
                                    )}
                                </div>
                                <div className="best-selling-info">
                                    <span className="best-selling-name">{product.name}</span>
                                    <span className="best-selling-stats">
                                        {product.count} sold • Rp {product.revenue.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BestSellersCard;

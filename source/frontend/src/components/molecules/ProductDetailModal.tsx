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

import { Product, Size, SugarLevel } from '@/core/types';
import { formatCurrency } from '@/utils/formatters';
import { X, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { getImageUrl } from '@/utils/image';

interface ProductDetailModalProps {
    product: Product;
    onClose: () => void;
    onAddToOrder: (product: Product, size?: Size, sugar?: SugarLevel) => void;
}

function ProductDetailModal({ product, onClose, onAddToOrder }: ProductDetailModalProps) {
    const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
    const [selectedSugar, setSelectedSugar] = useState(product.sugar_levels?.[1] || null);

    const calculatePrice = () => {
        let price = product.price;
        if (selectedSize?.price_modifier) {
            price += selectedSize.price_modifier;
        }
        return price;
    };

    const handleAddToOrder = () => {
        onAddToOrder(product, selectedSize || undefined, selectedSugar || undefined);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content product-detail-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="product-detail-image-wrapper">
                    <img
                        src={getImageUrl(product.image) || undefined}
                        alt={product.name}
                        className="product-detail-image"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>

                <div className="product-detail-info">
                    <h2 className="product-detail-name">{product.name}</h2>
                    <div className="product-detail-price">{formatCurrency(calculatePrice())}</div>

                    {product.sizes && (
                        <div className="product-detail-section">
                            <h4 className="product-detail-section-title">Size</h4>
                            <div className="product-detail-options">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size.id}
                                        className={`product-detail-option ${selectedSize?.id === size.id ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size.name}
                                        {size.price_modifier > 0 && (
                                            <span className="option-price">+{formatCurrency(size.price_modifier)}</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {product.sugar_levels && (
                        <div className="product-detail-section">
                            <h4 className="product-detail-section-title">Sugar Level</h4>
                            <div className="product-detail-options">
                                {product.sugar_levels.map((sugar) => (
                                    <button
                                        key={sugar.id}
                                        className={`product-detail-option ${selectedSugar?.id === sugar.id ? 'active' : ''}`}
                                        onClick={() => setSelectedSugar(sugar)}
                                    >
                                        {sugar.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <button className="product-detail-add-btn" onClick={handleAddToOrder}>
                        <ShoppingCart size={18} />
                        Add to Order
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailModal;

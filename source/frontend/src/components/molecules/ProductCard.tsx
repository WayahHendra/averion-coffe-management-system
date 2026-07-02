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

import { Product } from '@/core/types';
import { formatCurrency } from '@/utils/formatters';
import ImageWithSkeleton from '../atoms/ImageWithSkeleton';
import { Maximize2, Plus } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    onDetail: () => void;
    onPreview: () => void;
}

function ProductCard({ product, onDetail, onPreview }: ProductCardProps) {
    const handleDetailClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDetail();
    };

    const handlePreviewClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onPreview();
    };

    return (
        <div className="product-card fade-in">
            <div className="product-image-wrapper">
                <ImageWithSkeleton
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                />
                <button className="product-options-btn" onClick={handlePreviewClick}>
                    <Maximize2 size={14} />
                </button>
            </div>
            <div className="product-info">
                <div className="product-info-text">
                    <div className="product-name">{product.name}</div>
                    <div className="product-price">{formatCurrency(product.price)}</div>
                </div>
                <button className="product-add-btn" onClick={handleDetailClick}>
                    <Plus size={18} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}

export default ProductCard;

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
import { X } from 'lucide-react';
import { getImageUrl } from '@/utils/image';

interface ProductPreviewModalProps {
    product: Product;
    onClose: () => void;
}

function ProductPreviewModal({ product, onClose }: ProductPreviewModalProps) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content product-preview-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="product-preview-image-wrapper">
                    <img
                        src={getImageUrl(product.image) || undefined}
                        alt={product.name}
                        className="product-preview-image"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>

                <div className="product-preview-info">
                    <h2 className="product-preview-name">{product.name}</h2>
                    {product.description && (
                        <p className="product-preview-description">{product.description}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductPreviewModal;

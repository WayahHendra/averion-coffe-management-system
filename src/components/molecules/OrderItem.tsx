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

import { OrderItem as OrderItemType } from '@/core/types';
import { Trash2, Minus, Plus } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import ImageWithSkeleton from '../atoms/ImageWithSkeleton';

interface OrderItemProps {
    item: OrderItemType;
    onUpdateQuantity: (itemId: number, delta: number) => void;
    onRemove: (itemId: number) => void;
}

function OrderItem({ item, onUpdateQuantity, onRemove }: OrderItemProps) {
    return (
        <div className="order-item fade-in">
            <ImageWithSkeleton
                src={item.product.image}
                alt={item.product.name}
                className="order-item-image"
            />
            <div className="order-item-details">
                <div className="order-item-top">
                    <div className="order-item-name">{item.product.name}</div>
                    <div className="order-item-options">
                        {item.size && (
                            <span className="order-item-option">Size: {item.size.name}</span>
                        )}
                        {item.sugar_level && (
                            <span className="order-item-option">Sugar: {item.sugar_level.name}</span>
                        )}
                    </div>
                </div>
                <div className="order-item-price">{formatCurrency(item.subtotal)}</div>
            </div>
            <div className="order-item-actions">
                <button
                    className="order-item-delete"
                    onClick={() => onRemove(item.id)}
                    title="Remove item"
                >
                    <Trash2 size={14} />
                </button>
                <div className="quantity-control">
                    <button
                        className="quantity-btn"
                        onClick={() => onUpdateQuantity(item.id, -1)}
                    >
                        <Minus size={12} />
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                        className="quantity-btn"
                        onClick={() => onUpdateQuantity(item.id, 1)}
                    >
                        <Plus size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderItem;

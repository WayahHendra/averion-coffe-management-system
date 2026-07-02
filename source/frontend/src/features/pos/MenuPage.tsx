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

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Product, OrderItem as OrderItemType, Size, SugarLevel } from '@/core/types';
import { apiService } from '@/services/api';
import { preloadImages } from '@/utils/image';
import MenuSection from './components/MenuSection';
import OrderPanel from './components/OrderPanel';
import StoreClosedOverlay from './components/StoreClosedOverlay';
import ProductDetailModal from '@/components/molecules/ProductDetailModal';
import ProductPreviewModal from '@/components/molecules/ProductPreviewModal';

interface MenuPageProps {
    storeStatus: 'open' | 'closed';
}

function MenuPage({ storeStatus }: MenuPageProps) {
    const [products] = useState(() => apiService.getProducts());
    const [categories] = useState(() => apiService.getCategories());
    const [tables] = useState(() => apiService.getTables());
    const [vouchers] = useState(() => apiService.getVouchers());

    const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'>('name-asc');
    const [filterOption, setFilterOption] = useState<'best-sellers' | null>(null);

    const [orderItems, setOrderItems] = useState<OrderItemType[]>([]);
    const [detailProduct, setDetailProduct] = useState<Product | null>(null);
    const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

    // Preload product images on mount
    useEffect(() => {
        preloadImages(products.map(p => p.image));
    }, [products]);

    // Filter & sort products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Category filter (id 0 = entri "All" dari apiService)
        if (selectedCategory !== 'all' && selectedCategory !== 0) {
            result = result.filter(p => p.category_id === selectedCategory);
        }

        // Search filter
        if (searchTerm.trim()) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(p => p.name.toLowerCase().includes(lower));
        }

        // Best sellers filter
        if (filterOption === 'best-sellers') {
            result = result.filter(p => (p.sold_count || 0) > 0);
            result.sort((a, b) => (b.sold_count || 0) - (a.sold_count || 0));
            return result;
        }

        // Sort
        switch (sortOption) {
            case 'name-asc':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
        }

        return result;
    }, [products, selectedCategory, searchTerm, sortOption, filterOption]);

    // Add to order
    const handleAddToOrder = useCallback((product: Product, size?: Size, sugar?: SugarLevel) => {
        const itemId = Date.now() + Math.floor(Math.random() * 1000000); // Generate number ID
        const priceModifier = size?.price_modifier || 0;
        const itemPrice = product.price + priceModifier;

        const newItem: OrderItemType = {
            id: itemId,
            product,
            quantity: 1,
            size,
            sugar_level: sugar,
            subtotal: itemPrice,
        };

        setOrderItems(prev => [...prev, newItem]);
    }, []);

    // Update quantity
    const handleUpdateQuantity = useCallback((itemId: number, delta: number) => {
        setOrderItems(prev => prev.map(item => {
            if (item.id !== itemId) return item;
            const newQty = item.quantity + delta;
            if (newQty <= 0) return item;
            const unitPrice = (item.product.price + (item.size?.price_modifier || 0));
            return {
                ...item,
                quantity: newQty,
                subtotal: unitPrice * newQty,
            };
        }).filter(item => item.quantity > 0));
    }, []);

    // Remove item
    const handleRemoveItem = useCallback((itemId: number) => {
        setOrderItems(prev => prev.filter(item => item.id !== itemId));
    }, []);

    return (
        <div className={`menu-page-content ${storeStatus === 'closed' ? 'store-closed' : ''}`}>
            <MenuSection
                products={filteredProducts}
                categories={categories}
                loading={false}
                categoriesLoading={false}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onProductDetail={setDetailProduct}
                onProductPreview={setPreviewProduct}
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                sortOption={sortOption}
                onSortOptionChange={setSortOption}
                filterOption={filterOption}
                onFilterOptionChange={setFilterOption}
                storeStatus={storeStatus}
            />

            <OrderPanel
                orderItems={orderItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                tables={tables}
                storeStatus={storeStatus}
                vouchers={vouchers}
            />

            {/* Store Closed Overlay */}
            {storeStatus === 'closed' && <StoreClosedOverlay />}

            {/* Product Detail Modal */}
            {detailProduct && (
                <ProductDetailModal
                    product={detailProduct}
                    onClose={() => setDetailProduct(null)}
                    onAddToOrder={handleAddToOrder}
                />
            )}

            {/* Product Preview Modal */}
            {previewProduct && (
                <ProductPreviewModal
                    product={previewProduct}
                    onClose={() => setPreviewProduct(null)}
                />
            )}
        </div>
    );
}

export default MenuPage;

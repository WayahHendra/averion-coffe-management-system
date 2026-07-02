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

import { useState, useCallback } from 'react';
import { Product, Category } from '@/core/types';
import ProductCard from '@/components/molecules/ProductCard';
import { CategoryTabsSkeleton, ProductSkeleton } from '@/components/atoms/Skeleton';
import {
    Coffee,
    Grid2X2,
    Cookie,
    Croissant,
    CupSoda,
    Package,
    Search,
    ArrowUpDown,
    SlidersHorizontal,
} from 'lucide-react';

interface MenuSectionProps {
    products: Product[];
    categories: Category[];
    loading: boolean;
    categoriesLoading: boolean;
    selectedCategory: number | 'all';
    onCategoryChange: (categoryId: number | 'all') => void;
    onProductDetail: (product: Product) => void;
    onProductPreview: (product: Product) => void;
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    sortOption: string;
    onSortOptionChange: (option: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc') => void;
    filterOption: string | null;
    onFilterOptionChange: (option: 'best-sellers' | null) => void;
    storeStatus: 'open' | 'closed';
}

function MenuSection({
    products,
    categories,
    loading,
    categoriesLoading,
    selectedCategory,
    onCategoryChange,
    onProductDetail,
    onProductPreview,
    searchTerm,
    onSearchTermChange,
    sortOption,
    onSortOptionChange,
    filterOption,
    onFilterOptionChange,
    storeStatus,
}: MenuSectionProps) {
    const [activeDropdown, setActiveDropdown] = useState<'search' | 'sort' | 'filter' | null>(null);

    const getCategoryIcon = useCallback((iconName: string) => {
        const iconProps = { size: 14 };
        switch (iconName) {
            case 'grid':
                return <Grid2X2 {...iconProps} />;
            case 'coffee':
                return <Coffee {...iconProps} />;
            case 'cookie':
                return <Cookie {...iconProps} />;
            case 'croissant':
                return <Croissant {...iconProps} />;
            case 'cup-soda':
                return <CupSoda {...iconProps} />;
            default:
                return <Grid2X2 {...iconProps} />;
        }
    }, []);

    return (
        <div className="main-content">
            <div className="menu-section">
                {/* Category Tabs with Actions */}
                <div className="category-tabs-wrapper">
                    {categoriesLoading ? (
                        <CategoryTabsSkeleton />
                    ) : (
                        <div className="category-tabs">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
                                    onClick={() => onCategoryChange(category.id)}
                                    data-category={category.id}
                                >
                                    <span className="category-icon">{getCategoryIcon(category.icon)}</span>
                                    <span className="category-name">{category.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="category-actions">
                        {/* Search Dropdown */}
                        <div className="action-dropdown-wrapper">
                            <button
                                className={`header-btn ${activeDropdown === 'search' ? 'active' : ''}`}
                                title="Search"
                                onClick={() => setActiveDropdown(activeDropdown === 'search' ? null : 'search')}
                            >
                                <Search size={14} />
                            </button>
                            {activeDropdown === 'search' && (
                                <div className="action-dropdown">
                                    <div className="action-dropdown-header">
                                        <Search size={16} />
                                        <span>Search Products</span>
                                    </div>
                                    <div className="action-dropdown-content">
                                        <input
                                            type="text"
                                            placeholder="Type to search..."
                                            className="search-input"
                                            value={searchTerm}
                                            onChange={(e) => onSearchTermChange(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="action-dropdown-wrapper">
                            <button
                                className={`header-btn ${activeDropdown === 'sort' ? 'active' : ''} ${filterOption === 'best-sellers' ? 'disabled' : ''}`}
                                title={filterOption === 'best-sellers' ? 'Sort disabled (Best Sellers auto-sorts by sales)' : 'Sort'}
                                onClick={() => {
                                    if (filterOption !== 'best-sellers') {
                                        setActiveDropdown(activeDropdown === 'sort' ? null : 'sort');
                                    }
                                }}
                                disabled={filterOption === 'best-sellers'}
                            >
                                <ArrowUpDown size={14} />
                            </button>
                            {activeDropdown === 'sort' && (
                                <div className="action-dropdown">
                                    <div className="action-dropdown-header">
                                        <ArrowUpDown size={16} />
                                        <span>Sort By</span>
                                    </div>
                                    <div className="action-dropdown-content">
                                        <button
                                            className={`dropdown-option ${sortOption === 'name-asc' ? 'active' : ''}`}
                                            onClick={() => { onSortOptionChange('name-asc'); setActiveDropdown(null); }}
                                        >
                                            Name (A-Z)
                                        </button>
                                        <button
                                            className={`dropdown-option ${sortOption === 'name-desc' ? 'active' : ''}`}
                                            onClick={() => { onSortOptionChange('name-desc'); setActiveDropdown(null); }}
                                        >
                                            Name (Z-A)
                                        </button>
                                        <button
                                            className={`dropdown-option ${sortOption === 'price-asc' ? 'active' : ''}`}
                                            onClick={() => { onSortOptionChange('price-asc'); setActiveDropdown(null); }}
                                        >
                                            Price (Low to High)
                                        </button>
                                        <button
                                            className={`dropdown-option ${sortOption === 'price-desc' ? 'active' : ''}`}
                                            onClick={() => { onSortOptionChange('price-desc'); setActiveDropdown(null); }}
                                        >
                                            Price (High to Low)
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Filter Dropdown */}
                        <div className="action-dropdown-wrapper">
                            <button
                                className={`header-btn ${activeDropdown === 'filter' ? 'active' : ''}`}
                                title="Filter"
                                onClick={() => setActiveDropdown(activeDropdown === 'filter' ? null : 'filter')}
                            >
                                <SlidersHorizontal size={14} />
                            </button>
                            {activeDropdown === 'filter' && (
                                <div className="action-dropdown">
                                    <div className="action-dropdown-header">
                                        <SlidersHorizontal size={16} />
                                        <span>Filter</span>
                                    </div>
                                    <div className="action-dropdown-content">
                                        <button
                                            className={`dropdown-option ${filterOption === 'best-sellers' ? 'active' : ''}`}
                                            onClick={() => {
                                                onFilterOptionChange(filterOption === 'best-sellers' ? null : 'best-sellers');
                                                setActiveDropdown(null);
                                            }}
                                        >
                                            Best Sellers
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className={`product-grid-wrapper ${storeStatus === 'closed' ? 'store-closed' : ''}`}>
                    {loading ? (
                        <div className="product-grid">
                            {Array.from({ length: 12 }).map((_, index) => (
                                <ProductSkeleton key={index} />
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="empty-state">
                            <Package size={48} />
                            <p>No products found in this category</p>
                        </div>
                    ) : (
                        <div className="product-grid">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onDetail={() => onProductDetail(product)}
                                    onPreview={() => onProductPreview(product)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MenuSection;

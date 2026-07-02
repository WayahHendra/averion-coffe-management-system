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

import { useState, useEffect, useRef } from 'react';
import {
    Coffee,
    UploadCloud,
    Plus,
    Pencil,
    Trash2,
    Save,
    Search,
    Filter,
    ChevronDown,
    X,
    ImageIcon,
} from 'lucide-react';
import { apiService } from '@/services/api';
import { getImageUrl } from '@/utils/image';
import SkeletonBox from '@/components/atoms/SkeletonBox';
import ImageWithSkeleton from '@/components/atoms/ImageWithSkeleton';
import type { Product, Category } from '@/core/types';

// ==================== ProductsPanel ====================
interface ProductsPanelProps {
    permissions?: string[];
}

function ProductsPanel({ permissions = [] }: ProductsPanelProps) {
    const can = (perm: string) => permissions.length === 0 || permissions.includes(perm);
    const hasActions = can('menu:update') || can('menu:delete');
    const [products, setProducts] = useState<Product[]>(apiService.getProducts());
    const [categories] = useState<Category[]>(apiService.getRealCategories());
    const [loading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({ name: '', price: '', categoryId: categories[0]?.id || 0, description: '', image: '' });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Upload gambar: dipakai oleh drag & drop maupun klik pilih file
    const handleImageFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('File harus berupa gambar (png/jpg/webp).');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);

        setIsUploading(true);
        try {
            const url = await apiService.uploadImage(file);
            setFormData(prev => ({ ...prev, image: url }));
        } catch (e) {
            alert(e instanceof Error ? e.message : 'Upload gambar gagal');
            setImagePreview(null);
        } finally {
            setIsUploading(false);
        }
    };
    const [currentPage, setCurrentPage] = useState(1);
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const itemsPerPage = 10;

    const reload = () => setProducts(apiService.getProducts());

    const handleAdd = () => {
        setEditingProduct(null);
        setFormData({ name: '', price: '', categoryId: categories[0]?.id || 0, description: '', image: '' });
        setImagePreview(null);
        setShowModal(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price.toString(),
            categoryId: product.category_id,
            description: product.description || '',
            image: product.image,
        });
        setImagePreview(null);
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Delete this product?')) {
            try {
                await apiService.deleteProduct(id);
            } catch (e) {
                alert(e instanceof Error ? e.message : 'Gagal menghapus produk');
            }
            reload();
        }
    };

    const handleSubmit = async () => {
        try {
            await apiService.saveProduct(editingProduct ? editingProduct.id : null, {
                name: formData.name,
                price: parseFloat(formData.price) || 0,
                category_id: formData.categoryId,
                description: formData.description,
                image: formData.image,
            });
        } catch (e) {
            alert(e instanceof Error ? e.message : 'Gagal menyimpan produk');
        }
        setShowModal(false);
        setImagePreview(null);
        reload();
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || p.category_id === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedCategory]);

    const getCategoryName = (id: number) => categories.find(c => c.id === id)?.name || `Category ${id}`;

    return (
        <div className="admin-panel">
            <div className="admin-page-header">
                <div>
                    <h2>Products</h2>
                    <p>Manage your coffee shop menu items</p>
                </div>
                {can('menu:create') && (
                    <button className="admin-btn primary" onClick={handleAdd}><Plus size={18} /> Add Product</button>
                )}
            </div>

            <div className="admin-toolbar">
                <div className="admin-search">
                    <Search size={18} />
                    <input type="text" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div className="admin-filter" style={{ position: 'relative', background: 'transparent', border: 'none', padding: 0 }}>
                    <button
                        type="button"
                        onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px',
                            background: 'white', border: '1px solid var(--color-border-light)', borderRadius: '8px',
                            cursor: 'pointer', fontSize: 'var(--font-size-sm)', fontFamily: 'inherit',
                            fontWeight: 500, color: 'var(--color-text-secondary)', minWidth: '160px'
                        }}
                    >
                        <Filter size={18} />
                        <span style={{ flex: 1, textAlign: 'left' }}>
                            {selectedCategory === 'all' ? 'All Categories' : categories.find(c => c.id === selectedCategory)?.name || 'Unknown'}
                        </span>
                        <ChevronDown size={14} style={{ color: 'var(--color-text-muted)', transform: filterDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>
                    {filterDropdownOpen && (
                        <div style={{
                            position: 'absolute', top: 'calc(100% + 8px)', right: 0, minWidth: '180px',
                            background: 'white', borderRadius: '12px', filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.15))',
                            zIndex: 1000, padding: '8px'
                        }}>
                            <div style={{ position: 'absolute', top: '-6px', right: '16px', width: '12px', height: '12px', background: 'white', transform: 'rotate(45deg)', zIndex: 1 }} />
                            <div style={{ position: 'relative', zIndex: 2, maxHeight: '250px', overflowY: 'auto' }}>
                                <button
                                    type="button"
                                    onClick={() => { setSelectedCategory('all'); setFilterDropdownOpen(false); }}
                                    style={{
                                        width: '100%', padding: '10px 12px',
                                        background: selectedCategory === 'all' ? 'var(--color-bg-secondary)' : 'transparent',
                                        border: 'none', borderRadius: '6px', cursor: 'pointer',
                                        fontSize: 'var(--font-size-sm)', textAlign: 'left',
                                        color: selectedCategory === 'all' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                        fontWeight: selectedCategory === 'all' ? 600 : 500
                                    }}
                                >All Categories</button>
                                {categories.map(c => (
                                    <button
                                        key={c.id}
                                        type="button"
                                        onClick={() => { setSelectedCategory(c.id); setFilterDropdownOpen(false); }}
                                        style={{
                                            width: '100%', padding: '10px 12px',
                                            background: selectedCategory === c.id ? 'var(--color-bg-secondary)' : 'transparent',
                                            border: 'none', borderRadius: '6px', cursor: 'pointer',
                                            fontSize: 'var(--font-size-sm)', textAlign: 'left',
                                            color: selectedCategory === c.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                            fontWeight: selectedCategory === c.id ? 600 : 500
                                        }}
                                    >{c.name}</button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="admin-table-container">
                {loading ? (
                    <table className="admin-table">
                        <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th>{hasActions && <th>Actions</th>}</tr></thead>
                        <tbody>
                            {Array(5).fill(0).map((_, i) => (
                                <tr key={i}>
                                    <td><SkeletonBox width="48px" height="48px" style={{ borderRadius: '8px' }} /></td>
                                    <td><SkeletonBox width="140px" height="16px" /></td>
                                    <td><SkeletonBox width="100px" height="16px" /></td>
                                    <td><SkeletonBox width="80px" height="16px" /></td>
                                    {hasActions && <td><div style={{ display: 'flex', gap: 8 }}><SkeletonBox width="28px" height="28px" /><SkeletonBox width="28px" height="28px" /></div></td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table className="admin-table">
                        <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th>{hasActions && <th>Actions</th>}</tr></thead>
                        <tbody>
                            {paginatedProducts.map(product => (
                                <tr key={product.id}>
                                    <td className="product-cell">
                                        <div className="product-thumb">
                                            {product.image ? <ImageWithSkeleton src={product.image} alt={product.name} /> : <div className="no-image"><ImageIcon size={20} /></div>}
                                        </div>
                                    </td>
                                    <td><div className="product-name">{product.name}</div></td>
                                    <td><span className="product-category">{getCategoryName(product.category_id)}</span></td>
                                    <td className="price">Rp {(product.price || 0).toLocaleString('id-ID')}</td>
                                    {hasActions && (
                                        <td>
                                            <div className="action-btns">
                                                {can('menu:update') && <button className="action-btn edit" onClick={() => handleEdit(product)}><Pencil size={16} /></button>}
                                                {can('menu:delete') && <button className="action-btn delete" onClick={() => handleDelete(product.id)}><Trash2 size={16} /></button>}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {paginatedProducts.length === 0 && (
                                <tr><td colSpan={hasActions ? 5 : 4} className="admin-empty">No products found</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="admin-pagination">
                    <button className="pagination-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>← Prev</button>
                    <span className="pagination-info">Page {currentPage} of {totalPages} ({filteredProducts.length} items)</span>
                    <button className="pagination-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next →</button>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="form-group">
                                <label>Name *</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Product name" />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price (Rp) *</label>
                                    <input type="number" step="1000" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="15000" />
                                </div>
                                <div className="form-group">
                                    <label>Category *</label>
                                    <div className="custom-select-wrapper" style={{ position: 'relative' }}>
                                        <button
                                            type="button"
                                            className="custom-select-trigger"
                                            onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                                            style={{
                                                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                padding: '10px 12px', background: 'white', border: '1px solid var(--color-border-light)',
                                                borderRadius: '8px', cursor: 'pointer', fontSize: 'var(--font-size-sm)',
                                                fontFamily: 'inherit', fontWeight: 500, color: 'var(--color-text-secondary)'
                                            }}
                                        >
                                            <span>{categories.find(c => c.id === formData.categoryId)?.name || 'Select Category'}</span>
                                            <ChevronDown size={14} style={{ color: 'var(--color-text-muted)', transform: categoryDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                        </button>
                                        {categoryDropdownOpen && (
                                            <div className="custom-select-dropdown" style={{
                                                position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                                                background: 'white', borderRadius: '12px',
                                                filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.15))', zIndex: 1000, padding: '8px'
                                            }}>
                                                <div style={{ position: 'absolute', top: '-6px', right: '16px', width: '12px', height: '12px', background: 'white', transform: 'rotate(45deg)', zIndex: 1 }} />
                                                <div style={{ position: 'relative', zIndex: 2, maxHeight: '200px', overflowY: 'auto' }}>
                                                    {categories.map(c => (
                                                        <button
                                                            key={c.id}
                                                            type="button"
                                                            onClick={() => { setFormData({ ...formData, categoryId: c.id }); setCategoryDropdownOpen(false); }}
                                                            style={{
                                                                width: '100%', padding: '10px 12px',
                                                                background: formData.categoryId === c.id ? 'var(--color-bg-secondary)' : 'transparent',
                                                                border: 'none', borderRadius: '6px', cursor: 'pointer',
                                                                fontSize: 'var(--font-size-sm)', textAlign: 'left',
                                                                color: formData.categoryId === c.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                                                fontWeight: formData.categoryId === c.id ? 600 : 500
                                                            }}
                                                        >{c.name}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Optional description" rows={3} />
                            </div>
                            <div className="form-group">
                                <label>Product Image</label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={e => { const f = e.target.files?.[0]; if (f) handleImageFile(f); e.target.value = ''; }}
                                />
                                <div
                                    className="image-preview-area"
                                    onClick={() => !isUploading && fileInputRef.current?.click()}
                                    onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                                    onDragLeave={() => setIsDragOver(false)}
                                    onDrop={e => {
                                        e.preventDefault();
                                        setIsDragOver(false);
                                        const f = e.dataTransfer.files?.[0];
                                        if (f) handleImageFile(f);
                                    }}
                                    style={{
                                        border: `2px dashed ${isDragOver ? 'var(--color-primary)' : 'var(--color-border-light)'}`,
                                        background: isDragOver ? 'var(--color-bg-secondary)' : 'transparent',
                                        borderRadius: '12px', padding: '20px', textAlign: 'center',
                                        color: 'var(--color-text-muted)', cursor: 'pointer', transition: 'all 0.15s'
                                    }}
                                >
                                    {(imagePreview || formData.image) ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                            <img
                                                src={imagePreview || getImageUrl(formData.image) || formData.image || ''}
                                                alt="Preview"
                                                style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '8px', objectFit: 'cover', opacity: isUploading ? 0.5 : 1 }}
                                            />
                                            <p style={{ fontSize: '12px' }}>
                                                {isUploading ? 'Mengunggah gambar...' : 'Klik atau drag & drop untuk ganti gambar'}
                                            </p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                            {isUploading ? <Coffee size={32} /> : <UploadCloud size={32} />}
                                            <p>{isUploading ? 'Mengunggah gambar...' : 'Drag & drop gambar ke sini, atau klik untuk pilih file'}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="admin-btn secondary" onClick={() => { setShowModal(false); setImagePreview(null); }}>Cancel</button>
                            <button className="admin-btn primary" onClick={handleSubmit} disabled={isUploading}>
                                <Save size={18} /> {isUploading ? 'Menunggu upload...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductsPanel;

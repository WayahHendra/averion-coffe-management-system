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

import { useState } from 'react';
import {
    Coffee,
    Cookie,
    Croissant,
    CupSoda,
    Grid2X2,
    Layers,
    Plus,
    Pencil,
    Trash2,
    Save,
    X,
} from 'lucide-react';
import { mockService } from '@/services/mock';
import SkeletonBox from '@/components/atoms/SkeletonBox';
import type { Category } from '@/core/types';

const CategoryCardsSkeleton = () => (
    <div className="category-cards-grid">
        {[1, 2, 3, 4].map(i => (
            <div key={i} className="category-card">
                <div className="category-card-icon"><SkeletonBox width="48px" height="48px" style={{ borderRadius: '12px' }} /></div>
                <div className="category-card-info"><SkeletonBox width="80px" height="16px" /><SkeletonBox width="50px" height="12px" /></div>
            </div>
        ))}
    </div>
);

// ==================== Icon Resolver ====================
function getIconComponent(iconName: string) {
    switch (iconName) {
        case 'coffee': return <Coffee size={24} />;
        case 'cookie': return <Cookie size={24} />;
        case 'croissant': return <Croissant size={24} />;
        case 'cup-soda': return <CupSoda size={24} />;
        case 'grid': return <Grid2X2 size={24} />;
        default: return <Layers size={24} />;
    }
}

// ==================== CategoriesPanel ====================
interface CategoriesPanelProps {
    permissions?: string[];
}

function CategoriesPanel({ permissions = [] }: CategoriesPanelProps) {
    const can = (perm: string) => permissions.length === 0 || permissions.includes(perm);
    const [categories, setCategories] = useState<Category[]>(mockService.getCategories());
    const [loading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', icon: 'coffee' });

    const reload = () => setCategories(mockService.getCategories());

    const handleAdd = () => {
        setEditing(null);
        setFormData({ name: '', icon: 'coffee' });
        setShowModal(true);
    };

    const handleEdit = (cat: Category) => {
        setEditing(cat);
        setFormData({ name: cat.name, icon: cat.icon });
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete category?')) {
            // Mock delete — filter out
            console.log('Delete category:', id);
            reload();
        }
    };

    const handleSubmit = () => {
        if (editing) {
            console.log('Update category:', editing.id, formData);
        } else {
            console.log('Create category:', formData);
        }
        setShowModal(false);
        reload();
    };

    return (
        <div className="admin-panel">
            <div className="admin-page-header">
                <div><h2>Categories</h2><p>Organize your menu items</p></div>
                {can('category:create') && (
                    <button className="admin-btn primary" onClick={handleAdd}><Plus size={18} /> Add Category</button>
                )}
            </div>

            {loading ? <CategoryCardsSkeleton /> : (
                <div className="category-cards-grid">
                    {categories.map(cat => (
                        <div key={cat.id} className="category-card">
                            <div className="category-card-icon">
                                {getIconComponent(cat.icon)}
                            </div>
                            <div className="category-card-info">
                                <span className="category-card-name">{cat.name}</span>
                                <span className="category-card-icon-name">{cat.icon}</span>
                            </div>
                            {(can('category:update') || can('category:delete')) && (
                                <div className="category-card-actions">
                                    {can('category:update') && <button className="action-btn edit" onClick={() => handleEdit(cat)}><Pencil size={16} /></button>}
                                    {can('category:delete') && <button className="action-btn delete" onClick={() => handleDelete(cat.id)}><Trash2 size={16} /></button>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>{editing ? 'Edit Category' : 'Add Category'}</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="form-group">
                                <label>Name *</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Category name" />
                            </div>
                            <div className="form-group">
                                <label>Icon</label>
                                <select value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })}>
                                    <option value="grid">Grid (All)</option>
                                    <option value="coffee">Coffee</option>
                                    <option value="cookie">Cookie (Snack)</option>
                                    <option value="croissant">Croissant (Pastries)</option>
                                    <option value="cup-soda">Cup Soda (Beverages)</option>
                                </select>
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="admin-btn secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="admin-btn primary" onClick={handleSubmit}><Save size={18} /> Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoriesPanel;

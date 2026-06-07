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

import { Layers } from 'lucide-react';

interface PopularCategory {
    name: string;
    count: number;
    percentage: number;
}

interface PopularCategoriesCardProps {
    categories: PopularCategory[];
    timeFilterLabel: string;
}

function PopularCategoriesCard({ categories, timeFilterLabel }: PopularCategoriesCardProps) {
    return (
        <div className="admin-card">
            <div className="admin-card-header">
                <h3><Layers size={18} /> Popular Categories</h3>
                <span className="filter-badge">{timeFilterLabel}</span>
            </div>
            <div className="admin-card-body">
                {categories.length === 0 ? (
                    <div className="admin-empty-state">
                        <Layers size={32} />
                        <p>No category data yet</p>
                    </div>
                ) : (
                    <div className="category-stats-list">
                        {categories.map((category, idx) => (
                            <div key={idx} className="category-stat-item">
                                <div className="category-stat-info">
                                    <span className="category-stat-rank">{idx + 1}</span>
                                    <span className="category-stat-name">{category.name}</span>
                                    <span className="category-stat-count">{category.count} items sold</span>
                                </div>
                                <div className="category-stat-bar">
                                    <div
                                        className="category-stat-bar-fill"
                                        style={{ width: `${category.percentage}%` }}
                                    />
                                </div>
                                <span className="category-stat-percentage">{Math.round(category.percentage)}%</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PopularCategoriesCard;

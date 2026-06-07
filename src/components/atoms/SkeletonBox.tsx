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

interface SkeletonBoxProps {
    width?: string;
    height?: string;
    className?: string;
    style?: React.CSSProperties;
}

function SkeletonBox({ width = '100%', height = '20px', className = '', style }: SkeletonBoxProps) {
    return (
        <div
            className={`skeleton-box ${className}`}
            style={{ width, height, ...style }}
        />
    );
}

export default SkeletonBox;

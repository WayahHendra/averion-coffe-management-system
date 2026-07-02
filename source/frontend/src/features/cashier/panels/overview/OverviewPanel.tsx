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

import { useState, useEffect } from 'react';
import {
    Coffee,
    Layers,
    LayoutGrid,
    Users,
    ShoppingBag,
    Calendar,
    Ticket,
    TrendingUp,
    DollarSign,
    Clock,
    Sun,
    Sunset,
    Moon,
} from 'lucide-react';
import { apiService } from '@/services/api';
import SkeletonBox from '@/components/atoms/SkeletonBox';
import type { Order, Booking, Table } from '@/core/types';

// Sub-components
import RecentOrdersCard from './RecentOrdersCard';
import RevenueStatsCard from './RevenueStatsCard';
import BestSellersCard from './BestSellersCard';
import PeakHoursCard from './PeakHoursCard';
import PaymentMethodsCard from './PaymentMethodsCard';
import PopularCategoriesCard from './PopularCategoriesCard';
import RevenueByDayCard from './RevenueByDayCard';
import OrderDetailsModal from './OrderDetailsModal';

// ==================== Types ====================
type TimeFilter = 'today' | 'week' | 'month' | 'all';

interface TransactionItem {
    product_id?: number;
    product?: { id: number; name: string; image?: string };
    product_name?: string;
    product_image?: string;
    quantity: number;
    subtotal: number;
}

interface TransactionLike {
    created_at: string;
    payment_status?: string | null;
    payment_method?: string | null;
    total: number;
    order_items?: TransactionItem[];
    pre_order_items?: TransactionItem[];
    order_type?: string;
}

interface OverviewPanelProps {
    refreshTrigger: number;
}

// ==================== Helpers ====================
function getGreeting(): { text: string; icon: React.ReactNode; emoji: string } {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { text: 'Good Morning', icon: <Sun size={22} />, emoji: '☀️' };
    if (hour >= 12 && hour < 17) return { text: 'Good Afternoon', icon: <Sunset size={22} />, emoji: '🌤️' };
    if (hour >= 17 && hour < 21) return { text: 'Good Evening', icon: <Sunset size={22} />, emoji: '🌅' };
    return { text: 'Good Night', icon: <Moon size={22} />, emoji: '🌙' };
}


// ==================== Skeleton ====================
const OverviewSkeleton = () => (
    <div className="admin-overview">
        <div className="admin-page-header">
            <div><SkeletonBox width="200px" height="28px" /><SkeletonBox width="300px" height="16px" className="mt-2" /></div>
        </div>
        <div className="admin-stats-grid">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
                <div key={i} className="admin-stat-card skeleton-card">
                    <SkeletonBox width="52px" height="52px" className="skeleton-icon" />
                    <div className="stat-info"><SkeletonBox width="80px" height="12px" /><SkeletonBox width="60px" height="28px" className="mt-2" /></div>
                </div>
            ))}
        </div>
        <div className="admin-content-grid">
            <div className="admin-card"><div className="admin-card-header"><SkeletonBox width="120px" height="18px" /></div><div className="admin-card-body">{[1, 2, 3].map(i => <SkeletonBox key={i} height="40px" className="mb-2" />)}</div></div>
            <div className="admin-card"><div className="admin-card-header"><SkeletonBox width="100px" height="18px" /></div><div className="admin-card-body">{[1, 2, 3].map(i => <SkeletonBox key={i} height="32px" className="mb-2" />)}</div></div>
        </div>
    </div>
);

// ==================== Helper Functions ====================
function getDateRange(filter: TimeFilter): { start: Date; end: Date; prevStart: Date; prevEnd: Date } {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (filter) {
        case 'today': {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return { start: today, end: now, prevStart: yesterday, prevEnd: today };
        }
        case 'week': {
            const weekStart = new Date(today);
            weekStart.setDate(weekStart.getDate() - 7);
            const prevWeekStart = new Date(weekStart);
            prevWeekStart.setDate(prevWeekStart.getDate() - 7);
            return { start: weekStart, end: now, prevStart: prevWeekStart, prevEnd: weekStart };
        }
        case 'month': {
            const monthStart = new Date(today);
            monthStart.setMonth(monthStart.getMonth() - 1);
            const prevMonthStart = new Date(monthStart);
            prevMonthStart.setMonth(prevMonthStart.getMonth() - 1);
            return { start: monthStart, end: now, prevStart: prevMonthStart, prevEnd: monthStart };
        }
        default:
            return { start: new Date(0), end: now, prevStart: new Date(0), prevEnd: new Date(0) };
    }
}

function isInDateRange(dateStr: string, start: Date, end: Date): boolean {
    const date = new Date(dateStr);
    return date >= start && date <= end;
}

function getTimeFilterLabel(filter: TimeFilter): string {
    switch (filter) {
        case 'today': return 'Today';
        case 'week': return 'This Week';
        case 'month': return 'This Month';
        default: return 'All Time';
    }
}

function formatCurrency(value: number): string {
    return 'Rp ' + value.toLocaleString('id-ID');
}

// ==================== StatCardItem ====================
interface StatCardItemProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    subtitle?: string;
    delay?: number;
}

function StatCardItem({ label, value, icon, subtitle, delay = 0 }: StatCardItemProps) {
    return (
        <div className="admin-stat-card" style={{ animationDelay: `${delay}ms` }}>
            <div className="stat-icon-wrapper">{icon}</div>
            <div className="stat-info">
                <span className="stat-label">{label}</span>
                <span className="stat-value">{value}</span>
                {subtitle && <span className="stat-subtitle">{subtitle}</span>}
            </div>
        </div>
    );
}

// ==================== OverviewPanel Component ====================
function OverviewPanel({ refreshTrigger }: OverviewPanelProps) {
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

    const [stats, setStats] = useState({
        totalCategories: 0,
        totalProducts: 0,
        totalTables: 0,
        availableTables: 0,
        totalOrders: 0,
        totalBookings: 0,
        totalVouchers: 0,
        totalUsers: 0,
    });

    const [recentActivity, setRecentActivity] = useState<Order[]>([]);
    const [tables, setTables] = useState<Table[]>([]);

    const [analytics, setAnalytics] = useState({
        bestSellingProducts: [] as { name: string; count: number; revenue: number; image?: string }[],
        peakHours: [] as { hour: number; count: number }[],
        totalRevenue: 0,
        avgOrderValue: 0,
        orderTypeDistribution: { dineIn: 0, takeaway: 0 },
        paymentMethodStats: {} as Record<string, number>,
        revenueGrowth: 0,
        popularCategories: [] as { name: string; count: number; percentage: number }[],
        avgItemsPerOrder: 0,
        revenueByDay: [] as { day: string; revenue: number; count: number }[],
        ordersInPeriod: 0,
    });

    useEffect(() => {
        loadStats();
    }, [timeFilter, refreshTrigger]);

    const loadStats = () => {
        setLoading(true);
        try {
            const products = apiService.getProducts();
            const categories = apiService.getCategories();
            const tablesData = apiService.getTables();
            const allOrders = apiService.getOrders() as Order[];
            const allBookings = apiService.getBookings() as Booking[];
            const vouchers = apiService.getVouchers();
            const users = apiService.getUsers();

            const availableCount = tablesData.filter(t => t.status === 'available').length;

            setStats({
                totalCategories: categories.length,
                totalProducts: products.length,
                totalTables: tablesData.length,
                availableTables: availableCount,
                totalOrders: allOrders.length,
                totalBookings: allBookings.length,
                totalVouchers: vouchers.length,
                totalUsers: users.length,
            });
            setTables(tablesData);

            const allTransactionsRaw: TransactionLike[] = [...allOrders, ...allBookings];
            const { start, end, prevStart, prevEnd } = getDateRange(timeFilter);

            const filteredTransactions = timeFilter === 'all'
                ? allTransactionsRaw
                : allTransactionsRaw.filter((t) => isInDateRange(t.created_at, start, end));
            const previousTransactions = timeFilter === 'all'
                ? [] as TransactionLike[]
                : allTransactionsRaw.filter((t) => isInDateRange(t.created_at, prevStart, prevEnd));

            // Best Selling Products
            const productSales: Record<string, { name: string; count: number; revenue: number; image?: string; categoryId?: number }> = {};
            const paidForSales = filteredTransactions.filter((t) =>
                t.payment_status === 'paid' || t.payment_status === 'completed'
            );
            paidForSales.forEach((transaction) => {
                const items: TransactionItem[] = transaction.order_items || transaction.pre_order_items || [];
                items.forEach((item) => {
                    const productId = item.product?.id || item.product_id;
                    const productName = item.product?.name || item.product_name || 'Unknown';
                    const productImage = item.product?.image || item.product_image;
                    if (productId && !productSales[productId]) {
                        const productData = products.find(p => p.id === productId);
                        productSales[productId] = { name: productName, count: 0, revenue: 0, image: productImage, categoryId: productData?.category_id };
                    }
                    if (productId) {
                        productSales[productId].count += item.quantity || 1;
                        productSales[productId].revenue += item.subtotal || 0;
                    }
                });
            });
            const bestSellingProducts = Object.values(productSales).sort((a, b) => b.count - a.count).slice(0, 5);

            // Peak Hours
            const hourCounts: Record<number, number> = {};
            paidForSales.forEach((transaction) => {
                const hour = new Date(transaction.created_at).getHours();
                hourCounts[hour] = (hourCounts[hour] || 0) + 1;
            });
            const peakHours = Object.entries(hourCounts)
                .map(([hour, count]) => ({ hour: parseInt(hour), count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            // Revenue Stats
            const paidTransactions = filteredTransactions.filter((t) => t.payment_status === 'paid' || t.payment_status === 'completed');
            const totalRevenue = paidTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
            const avgOrderValue = paidTransactions.length > 0 ? totalRevenue / paidTransactions.length : 0;

            const prevPaidTransactions = previousTransactions.filter((t) => t.payment_status === 'paid' || t.payment_status === 'completed');
            const previousRevenue = prevPaidTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
            const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

            // Order Type Distribution
            const filteredOrders = timeFilter === 'all' ? allOrders : allOrders.filter((o) => isInDateRange(o.created_at, start, end));
            const filteredBookings = timeFilter === 'all' ? allBookings : allBookings.filter((b) => isInDateRange(b.created_at, start, end));

            let dineIn = 0, takeaway = 0;
            filteredOrders.forEach((order) => {
                if (order.order_type === 'dine-in') dineIn++;
                else if (order.order_type === 'takeaway') takeaway++;
            });
            dineIn += filteredBookings.length;

            // Payment Method Stats
            const paymentMethodStats: Record<string, number> = {};
            paidTransactions.forEach((t) => {
                const method = t.payment_method || 'unknown';
                paymentMethodStats[method] = (paymentMethodStats[method] || 0) + 1;
            });

            // Popular Categories
            const categorySales: Record<string, { name: string; count: number }> = {};
            Object.values(productSales).forEach((product) => {
                const categoryId = product.categoryId;
                if (categoryId) {
                    const category = categories.find(c => c.id === categoryId);
                    const categoryName = category?.name || 'Unknown';
                    if (!categorySales[categoryId]) categorySales[categoryId] = { name: categoryName, count: 0 };
                    categorySales[categoryId].count += product.count;
                }
            });
            const totalCategorySales = Object.values(categorySales).reduce((sum, c) => sum + c.count, 0);
            const popularCategories = Object.values(categorySales)
                .map(c => ({ ...c, percentage: totalCategorySales > 0 ? (c.count / totalCategorySales) * 100 : 0 }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 3);

            // Avg Items Per Order
            let totalItems = 0;
            filteredTransactions.forEach((transaction) => {
                const items: TransactionItem[] = transaction.order_items || transaction.pre_order_items || [];
                totalItems += items.reduce((sum: number, item: TransactionItem) => sum + (item.quantity || 1), 0);
            });
            const avgItemsPerOrder = filteredTransactions.length > 0 ? totalItems / filteredTransactions.length : 0;

            // Revenue by Day of Week
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const dayStats: Record<number, { revenue: number; count: number }> = {};
            for (let i = 0; i < 7; i++) dayStats[i] = { revenue: 0, count: 0 };
            paidTransactions.forEach((t) => {
                const day = new Date(t.created_at).getDay();
                dayStats[day].revenue += t.total || 0;
                dayStats[day].count += 1;
            });
            const revenueByDay = dayNames.map((day, idx) => ({ day, revenue: dayStats[idx].revenue, count: dayStats[idx].count }));

            setAnalytics({
                bestSellingProducts,
                peakHours,
                totalRevenue,
                avgOrderValue,
                orderTypeDistribution: { dineIn, takeaway },
                paymentMethodStats,
                revenueGrowth,
                popularCategories,
                avgItemsPerOrder,
                revenueByDay,
                ordersInPeriod: filteredTransactions.length,
            });

            // Recent activity (combined orders + bookings, sorted desc)
            const combined: TransactionLike[] = [...allOrders, ...allBookings].sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            setRecentActivity(combined.slice(0, 5) as Order[]);
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const greeting = getGreeting();
    const timeFilterLabel = getTimeFilterLabel(timeFilter);
    const bestDay = analytics.revenueByDay.length > 0
        ? [...analytics.revenueByDay].sort((a, b) => b.revenue - a.revenue)[0].day
        : '-';

    if (loading) return <OverviewSkeleton />;

    return (
        <div className="admin-overview">
            {/* Greeting Banner */}
            <div className="dashboard-greeting-banner">
                <div className="greeting-content">
                    <div className="greeting-icon-wrapper">
                        {greeting.icon}
                    </div>
                    <div className="greeting-text">
                        <h2>{greeting.text} {greeting.emoji}</h2>
                        <p>Here's what's happening with your coffee shop today.</p>
                    </div>
                </div>
                <div className="greeting-meta">
                    <div className="greeting-time">
                        <Clock size={14} />
                        {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="greeting-date">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                </div>
            </div>

            {/* Time Filter */}
            <div className="analytics-time-filter">
                <span className="filter-label">Analytics Period:</span>
                <div className="filter-pills">
                    {(['today', 'week', 'month', 'all'] as TimeFilter[]).map((filter) => (
                        <button
                            key={filter}
                            className={`filter-pill ${timeFilter === filter ? 'active' : ''}`}
                            onClick={() => setTimeFilter(filter)}
                        >
                            {getTimeFilterLabel(filter)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Revenue Summary */}
            <div className="revenue-summary-row">
                <div className="revenue-main-card">
                    <div className="revenue-icon-circle">
                        <DollarSign size={24} />
                    </div>
                    <div className="revenue-main-info">
                        <span className="revenue-main-label">Total Revenue</span>
                        <span className="revenue-main-value">{formatCurrency(analytics.totalRevenue)}</span>
                    </div>
                    {analytics.revenueGrowth !== 0 && (
                        <div className={`growth-indicator ${analytics.revenueGrowth > 0 ? 'positive' : 'negative'}`}>
                            <TrendingUp size={14} />
                            {analytics.revenueGrowth > 0 ? '+' : ''}{analytics.revenueGrowth.toFixed(1)}%
                        </div>
                    )}
                </div>
                <div className="revenue-sub-cards">
                    <div className="revenue-sub-card">
                        <span className="revenue-sub-label">Avg Order Value</span>
                        <span className="revenue-sub-value">{formatCurrency(Math.round(analytics.avgOrderValue))}</span>
                    </div>
                    <div className="revenue-sub-card">
                        <span className="revenue-sub-label">Orders in Period</span>
                        <span className="revenue-sub-value">{analytics.ordersInPeriod}</span>
                    </div>
                    <div className="revenue-sub-card">
                        <span className="revenue-sub-label">Avg Items/Order</span>
                        <span className="revenue-sub-value">{analytics.avgItemsPerOrder.toFixed(1)}</span>
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="admin-stats-grid">
                <StatCardItem label="Categories" value={stats.totalCategories} icon={<Layers size={20} />} delay={0} />
                <StatCardItem label="Products" value={stats.totalProducts} icon={<Coffee size={20} />} delay={50} />
                <StatCardItem label="Tables" value={`${stats.availableTables}/${stats.totalTables}`} icon={<LayoutGrid size={20} />} subtitle={`${stats.availableTables} available`} delay={100} />
                <StatCardItem label="Orders" value={stats.totalOrders} icon={<ShoppingBag size={20} />} delay={150} />
                <StatCardItem label="Bookings" value={stats.totalBookings} icon={<Calendar size={20} />} delay={200} />
                <StatCardItem label="Vouchers" value={stats.totalVouchers} icon={<Ticket size={20} />} delay={250} />
                <StatCardItem label="Users" value={stats.totalUsers} icon={<Users size={20} />} delay={300} />
            </div>

            {/* Content Grid - Recent Orders + Revenue Stats */}
            <div className="admin-content-grid">
                <RecentOrdersCard
                    recentActivity={recentActivity}
                    tables={tables}
                    onSelectOrder={(order) => setSelectedOrder(order)}
                />
                <RevenueStatsCard
                    timeFilterLabel={timeFilterLabel}
                    timeFilter={timeFilter}
                    totalRevenue={analytics.totalRevenue}
                    revenueGrowth={analytics.revenueGrowth}
                    ordersInPeriod={analytics.ordersInPeriod}
                    avgOrderValue={analytics.avgOrderValue}
                    avgItemsPerOrder={analytics.avgItemsPerOrder}
                    bestDay={bestDay}
                    orderTypeDistribution={analytics.orderTypeDistribution}
                />
            </div>

            {/* Analytics Row 1 */}
            <div className="admin-analytics-grid">
                <BestSellersCard products={analytics.bestSellingProducts} timeFilterLabel={timeFilterLabel} />
                <PeakHoursCard peakHours={analytics.peakHours} timeFilterLabel={timeFilterLabel} />
                <PaymentMethodsCard paymentMethodStats={analytics.paymentMethodStats} timeFilterLabel={timeFilterLabel} />
            </div>

            {/* Analytics Row 2 */}
            <div className="admin-analytics-grid two-col">
                <PopularCategoriesCard categories={analytics.popularCategories} timeFilterLabel={timeFilterLabel} />
                <RevenueByDayCard revenueByDay={analytics.revenueByDay} timeFilterLabel={timeFilterLabel} />
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    tables={tables}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
}

export default OverviewPanel;

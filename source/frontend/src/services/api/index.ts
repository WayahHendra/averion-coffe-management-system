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

import type {
    Product,
    Category,
    Table,
    Voucher,
    User,
    Role,
    Branch,
    Order,
    Booking,
    Size,
    SugarLevel,
} from '@/core/types';
import { mockService } from '@/services/mock';
import branchesData from '@/services/mock/branches.json';

const API = '/api';

interface Cache {
    products: Product[];
    categories: Category[];
    tables: Table[];
    vouchers: Voucher[];
    users: User[];
    orders: Order[];
    bookings: Booking[];
    roles: Role[];
}

let cache: Cache = {
    products: [], categories: [], tables: [], vouchers: [],
    users: [], orders: [], bookings: [], roles: [],
};

/** true kalau backend Spring Boot terjangkau; false = fallback data mock lokal. */
let online = false;

async function http<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${API}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
        throw new Error((data as { message?: string } | null)?.message || `Request gagal (${res.status})`);
    }
    return data as T;
}

/** Muat seluruh data awal dari backend. Dipanggil sekali sebelum render (main.tsx). */
export async function bootstrap(): Promise<void> {
    try {
        cache = await http<Cache>('/bootstrap');
        online = true;
    } catch (e) {
        console.warn('[api] Backend tidak terjangkau, memakai data mock lokal.', e);
        cache = {
            products: mockService.getProducts(),
            categories: (mockService.getCategories()).filter(c => c.name !== 'All'),
            tables: mockService.getTables(),
            vouchers: mockService.getVouchers(),
            users: mockService.getUsers(),
            orders: mockService.getOrders() as Order[],
            bookings: mockService.getBookings() as Booking[],
            roles: mockService.getRoles(),
        };
        online = false;
    }
}

/** Sinkronkan ulang cache setelah ada perubahan data. */
async function refresh(): Promise<void> {
    if (online) {
        cache = await http<Cache>('/bootstrap');
    }
}

export interface OrderItemPayload {
    product_id: number;
    quantity: number;
    size?: Size | null;
    sugar_level?: SugarLevel | null;
}

/**
 * Service data utama aplikasi. Getter-nya sinkron (membaca cache hasil
 * bootstrap) supaya kompatibel dengan pola pemakaian mockService lama;
 * semua operasi tulis async ke REST API backend.
 */
export const apiService = {
    isOnline: (): boolean => online,

    // ---------- Getter sinkron (kompatibel mockService) ----------
    getProducts: (): Product[] => cache.products,
    getCategories: (): Category[] => [{ id: 0, name: 'All', icon: 'grid' }, ...cache.categories],
    /** Kategori asli tanpa entri "All" (untuk panel kelola kategori/produk). */
    getRealCategories: (): Category[] => cache.categories,
    getTables: (): Table[] => cache.tables,
    getVouchers: (): Voucher[] => cache.vouchers,
    getUsers: (): User[] => cache.users,
    getOrders: (): unknown[] => cache.orders,
    getBookings: (): unknown[] => cache.bookings,
    getRoles: (): Role[] => cache.roles,
    getBranches: (): Branch[] => branchesData as Branch[],

    // ---------- Autentikasi ----------
    login: async (identifier: string, password: string) => {
        if (!online) {
            return mockService.login(identifier, password);
        }
        return http<{ success: boolean; data: User | null; permissions: string[]; message?: string }>(
            '/auth/login',
            { method: 'POST', body: JSON.stringify({ identifier, password }) },
        );
    },

    // ---------- Transaksi POS ----------
    createOrder: async (payload: {
        order_type: 'dine-in' | 'takeaway';
        table_id?: number | null;
        payment_method: string;
        voucher_code?: string | null;
        items: OrderItemPayload[];
    }): Promise<unknown> => {
        if (!online) {
            console.warn('[api] offline - order tidak tersimpan ke server', payload);
            return null;
        }
        const order = await http('/orders', { method: 'POST', body: JSON.stringify(payload) });
        await refresh();
        return order;
    },

    createBooking: async (payload: {
        customer_name: string;
        table_id: number;
        number_of_guests: number;
        booking_date_time: string;
        payment_method: string;
        voucher_code?: string | null;
        items: OrderItemPayload[];
    }): Promise<unknown> => {
        if (!online) {
            console.warn('[api] offline - booking tidak tersimpan ke server', payload);
            return null;
        }
        const booking = await http('/bookings', { method: 'POST', body: JSON.stringify(payload) });
        await refresh();
        return booking;
    },

    // ---------- Kelola Kategori ----------
    saveCategory: async (id: number | null, data: { name: string; icon: string }): Promise<void> => {
        if (!online) return;
        if (id == null) {
            await http('/categories', { method: 'POST', body: JSON.stringify(data) });
        } else {
            await http(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        }
        await refresh();
    },

    deleteCategory: async (id: number): Promise<void> => {
        if (!online) return;
        await http(`/categories/${id}`, { method: 'DELETE' });
        await refresh();
    },

    /** Upload file gambar ke backend, mengembalikan URL gambar yang tersimpan. */
    uploadImage: async (file: File): Promise<string> => {
        if (!online) {
            throw new Error('Backend tidak terjangkau, upload gambar butuh backend menyala.');
        }
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${API}/upload`, { method: 'POST', body: formData });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
            throw new Error((data as { message?: string } | null)?.message || 'Upload gambar gagal.');
        }
        return (data as { url: string }).url;
    },

    // ---------- Kelola Produk ----------
    saveProduct: async (id: number | null, data: {
        name: string; price: number; category_id: number; description?: string; image?: string;
    }): Promise<void> => {
        if (!online) return;
        if (id == null) {
            await http('/products', { method: 'POST', body: JSON.stringify(data) });
        } else {
            await http(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        }
        await refresh();
    },

    deleteProduct: async (id: number): Promise<void> => {
        if (!online) return;
        await http(`/products/${id}`, { method: 'DELETE' });
        await refresh();
    },

    // ---------- Kelola Meja ----------
    createTable: async (data: { name: string; table_number?: string; capacity?: number }): Promise<void> => {
        if (!online) return;
        await http('/tables', { method: 'POST', body: JSON.stringify(data) });
        await refresh();
    },

    deleteTable: async (id: number): Promise<void> => {
        if (!online) return;
        await http(`/tables/${id}`, { method: 'DELETE' });
        await refresh();
    },

    // ---------- Kelola Voucher ----------
    saveVoucher: async (originalCode: string | null, data: {
        code: string; type: string; value: number; limit: number; expiry_date: string;
    }): Promise<void> => {
        if (!online) return;
        await http('/vouchers', {
            method: 'POST',
            body: JSON.stringify({ original_code: originalCode, ...data }),
        });
        await refresh();
    },

    deleteVoucher: async (code: string): Promise<void> => {
        if (!online) return;
        await http(`/vouchers/${encodeURIComponent(code)}`, { method: 'DELETE' });
        await refresh();
    },

    // ---------- Manajemen User ----------
    saveUser: async (id: number | null, data: {
        display_name: string; username: string; email: string; role_id: number; status?: string;
    }): Promise<void> => {
        if (!online) return;
        if (id == null) {
            await http('/users', { method: 'POST', body: JSON.stringify(data) });
        } else {
            await http(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        }
        await refresh();
    },

    deleteUser: async (id: number): Promise<void> => {
        if (!online) return;
        await http(`/users/${id}`, { method: 'DELETE' });
        await refresh();
    },
};

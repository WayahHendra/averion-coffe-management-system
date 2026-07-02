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

import type { Product, Category, Table, Voucher, User, Tenant, Subscription, Role, Branch, Payment, Permission, RolePermission, IoTDevice } from '@/core/types';

import productsData from './products.json';
import categoriesData from './categories.json';
import tablesData from './tables.json';
import vouchersData from './vouchers.json';
import usersData from './users.json';
import ordersData from './orders.json';
import bookingsData from './bookings.json';
import cartsData from './carts.json';
import tenantsData from './tenants.json';
import subscriptionsData from './subscriptions.json';
import rolesData from './roles.json';
import branchesData from './branches.json';
import paymentsData from './payments.json';
import permissionsData from './permissions.json';
import rolePermissionsData from './role_permissions.json';
import devicesData from './devices.json';

// Mock data service — replaces API calls with local JSON data
export const mockService = {
  getProducts: (): Product[] => productsData as Product[],
  
  getCategories: (): Category[] => {
    const allCategory: Category = { id: 1, name: 'All', icon: 'grid' };
    return [allCategory, ...(categoriesData as Category[])];
  },
  
  getTables: (): Table[] => tablesData as Table[],
  
  getVouchers: (): Voucher[] => vouchersData as Voucher[],
  
  getUsers: (): User[] => usersData as User[],
  
  getOrders: (): unknown[] => ordersData as unknown[],
  
  getBookings: (): unknown[] => bookingsData as unknown[],
  
  getCarts: (): unknown[] => cartsData as unknown[],
  
  getTenants: (): Tenant[] => tenantsData as Tenant[],
  
  getSubscriptions: (): Subscription[] => subscriptionsData as Subscription[],
  
  getRoles: (): Role[] => rolesData as Role[],
  
  getBranches: (): Branch[] => branchesData as Branch[],
  
  getPayments: (): Payment[] => paymentsData as Payment[],
  
  getDevices: (): IoTDevice[] => devicesData as IoTDevice[],
  
  getDevicesByBranch: (branchId: string): IoTDevice[] => (devicesData as IoTDevice[]).filter(d => d.branch_id === branchId),
  
  getPermissions: (): Permission[] => permissionsData as Permission[],
  
  getRolePermissions: (): RolePermission[] => rolePermissionsData as RolePermission[],
  
  getPermissionsByRoleId: (roleId: number): string[] => {
    const rpList = rolePermissionsData.filter(rp => rp.role_id === roleId);
    const permissionIds = rpList.map(rp => rp.permission_id);
    return (permissionsData as Permission[]).filter(p => permissionIds.includes(p.id)).map(p => p.name);
  },
  
  // Mock login - checks against users.json
  login: (identifier: string, password: string): { success: boolean; data: User | null; permissions: string[]; message?: string } => {
    const user = (usersData as User[]).find(
      u => (u.username === identifier || u.email === identifier) && u.password_hash === password
    );
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash: _, ...userWithoutPassword } = user;
      const roleObj = rolesData.find(r => r.id === user.role_id);
      const permissions = mockService.getPermissionsByRoleId(user.role_id);
      return { 
        success: true, 
        data: { 
          ...userWithoutPassword, 
          role: roleObj?.name 
        } as User,
        permissions,
      };
    }
    return { success: false, data: null, permissions: [], message: 'Invalid credentials' };
  },
};

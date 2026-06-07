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

export interface Tenant {
  id: string;
  company_name: string;
  owner_email: string;
  status: "active" | "suspended";
  created_at: string;
}

export interface Subscription {
  id: string;
  tenant_id: string;
  plan_type: "basic" | "pro" | "enterprise";
  start_date: string;
  end_date: string;
  status: "active" | "expired" | "cancelled";
  monthly_price: number;
}

export interface IoTDevice {
  id: string;
  table_id: number;
  branch_id: string;
  mac_address: string;
  battery_level: number;
  health_status: "good" | "warning" | "critical" | "offline";
  firmware_version: string;
  wifi_rssi_dbm: number;
  last_seen: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
}

export interface Permission {
  id: number;
  name: string;
  resource: string;
  action: string;
}

export interface RolePermission {
  role_id: number;
  permission_id: number;
}

export interface Branch {
  id: string;
  tenant_id: string;
  name: string;
  location: string;
  created_at: string;
}

export interface Payment {
  id: number;
  order_id: number;
  method: "cash" | "qris" | string;
  amount: number;
  status: "pending" | "success" | "failed";
  transaction_id: string;
  paid_at: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface Table {
  id: number;
  branch_id?: string;
  table_number?: string;
  name: string;
  capacity?: number;
  status: "available" | "occupied" | "reserved";
  mac_address?: string;
  device_battery_level?: number;
  firmware_version?: string;
  device_health_status?: "good" | "warning" | "critical" | "offline" | string;
  last_seen?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category_id: number;
  description?: string;
  sizes?: Size[] | null;
  sugar_levels?: SugarLevel[] | null;
  sold_count?: number | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface Size {
  id: string;
  name: string;
  price_modifier: number;
}

export interface SugarLevel {
  id: string;
  name: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  size?: Size;
  sugar_level?: SugarLevel;
  subtotal: number;
}

export interface Order {
  id: number;
  order_code?: string;
  branch_id?: string;
  order_items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  table_id?: number | null;
  order_type: "dine-in" | "takeaway";
  payment_method?: string | null;
  payment_status?: string | null;
  voucher_code?: string;
  created_at: string;
  updated_at?: string | null;
}

export interface Voucher {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  limit: number;
  expiry_date: string;
}

export interface BookingPreOrderItem {
  id?: number;
  product_id: number;
  product_name: string;
  product_image?: string;
  quantity: number;
  size?: Size;
  sugar_level?: SugarLevel;
  price: number;
  subtotal: number;
}

export interface Booking {
  id: number;
  branch_id?: string;
  customer_name: string;
  table_id: number;
  number_of_guests: number;
  booking_date_time: string;
  pre_order_items: BookingPreOrderItem[];
  status: "confirmed" | "reserved" | "completed" | "cancelled";
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  payment_method?: string | null;
  voucher_code?: string;
  created_at: string;
  updated_at?: string | null;
}

export interface User {
  id: number;
  tenant_id?: string;
  branch_id?: string;
  display_name: string;
  username: string;
  email: string;
  role_id: number;
  role?: string;
  password_hash?: string;
  status?: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
  payment_method?: string;
  payment_status?: string;
  order_type?: "dine-in" | "takeaway";
}

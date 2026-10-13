export type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image: string;
  sizes: string; // Comma separated e.g., "S,M,L,XL"
  colors?: string;
  stock: number;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id?: number;
  orderCode?: string;
  customerName: string;
  phone: string;
  address: string;
  size: Size | string;
  quantity: number;
  totalPrice: number;
  status?: OrderStatus;
  note?: string;
  productId: number;
  product?: Product;
  createdAt?: string;
}

export interface ContactMessage {
  id?: number;
  name: string;
  phone: string;
  message: string;
  isRead?: boolean;
  createdAt?: string;
}

export interface User {
  id: number;
  email: string;
  role: string;
}
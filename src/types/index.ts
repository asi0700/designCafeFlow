export type UserRole = 'owner' | 'manager' | 'cashier' | 'waiter';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  email: string;
  phone?: string;
  hourlyRate: number;
  status: 'active' | 'inactive' | 'on_break';
  hireDate: string;
  permissions: string[];
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

export type TableStatus = 'free' | 'reserved' | 'waiting' | 'occupied' | 'waiting_payment' | 'needs_cleaning';
export type TableShape = 'round' | 'square' | 'rectangle' | 'bar';

export interface TablePosition {
  x: number;
  y: number;
}

export interface CafeTable {
  id: string;
  number: number;
  name: string;
  seats: number;
  shape: TableShape;
  status: TableStatus;
  position: TablePosition;
  width: number;
  height: number;
  zone: string;
  waiterId?: string;
  guestCount?: number;
  openedAt?: string;
  currentOrderId?: string;
  reservationId?: string;
  material?: 'wood_light' | 'wood_dark' | 'stone' | 'white';
}

export interface Zone {
  id: string;
  name: string;
  color: string;
  floorPattern: 'wood_light' | 'wood_dark' | 'tile' | 'carpet' | 'concrete';
  x: number;
  y: number;
  width: number;
  height: number;
  isActive: boolean;
  description?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  status: 'pending' | 'cooking' | 'ready' | 'served';
}

export type OrderStatus = 'open' | 'cooking' | 'ready' | 'closed' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'mixed';

export interface Order {
  id: string;
  tableId: string;
  tableName: string;
  waiterId: string;
  waiterName: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  closedAt?: string;
  guestCount: number;
  total: number;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  isAvailable: boolean;
  isStopList: boolean;
  prepTime: number;
  modifiers?: string[];
  popular?: boolean;
}

export interface Shift {
  id: string;
  employeeId: string;
  employeeName: string;
  role: UserRole;
  date: string;
  startTime: string;
  endTime: string;
  actualStart?: string;
  actualEnd?: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled' | 'no_show';
  hourlyRate: number;
  earned?: number;
  notes?: string;
}

export interface Reservation {
  id: string;
  guestName: string;
  guestPhone: string;
  date: string;
  time: string;
  guests: number;
  tableId?: string;
  tableName?: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no_show';
  notes?: string;
}

export interface Notification {
  id: string;
  type: 'reservation' | 'shift' | 'stoplist' | 'payment' | 'shift_unclosed' | 'late' | 'info';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface DailyStats {
  date: string;
  revenue: number;
  orders: number;
  guests: number;
  avgCheck: number;
}

export interface HourlyStats {
  hour: number;
  revenue: number;
  orders: number;
}

export interface FurnitureItem {
  id: string;
  type: string;
  name: string;
  category: 'tables' | 'chairs' | 'sofas' | 'bar' | 'dividers' | 'decor' | 'service';
  width: number;
  height: number;
  seats?: number;
  shape?: 'round' | 'square' | 'rectangle';
}

export interface FloorItem {
  id: string;
  furnitureId: string;
  type: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color?: string;
  seats?: number;
  tableNumber?: number;
  zone?: string;
  locked?: boolean;
  material?: string;
}


export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  email: string;
  phone?: string;
  hourlyRate: number;
  status: 'active' | 'inactive' | 'on_break';
  hireDate: string;
  permissions: string[];
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

export type TableStatus = 'free' | 'reserved' | 'waiting' | 'occupied' | 'waiting_payment' | 'needs_cleaning';
export type TableShape = 'round' | 'square' | 'rectangle' | 'bar';

export interface TablePosition {
  x: number;
  y: number;
}

export interface CafeTable {
  id: string;
  number: number;
  name: string;
  seats: number;
  shape: TableShape;
  status: TableStatus;
  position: TablePosition;
  width: number;
  height: number;
  zone: string;
  waiterId?: string;
  guestCount?: number;
  openedAt?: string;
  currentOrderId?: string;
  reservationId?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  status: 'pending' | 'cooking' | 'ready' | 'served';
}

export type OrderStatus = 'open' | 'cooking' | 'ready' | 'closed' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'mixed';

export interface Order {
  id: string;
  tableId: string;
  tableName: string;
  waiterId: string;
  waiterName: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  closedAt?: string;
  guestCount: number;
  total: number;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  isAvailable: boolean;
  isStopList: boolean;
  prepTime: number;
  modifiers?: string[];
  popular?: boolean;
}

export interface Shift {
  id: string;
  employeeId: string;
  employeeName: string;
  role: UserRole;
  date: string;
  startTime: string;
  endTime: string;
  actualStart?: string;
  actualEnd?: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled' | 'no_show';
  hourlyRate: number;
  earned?: number;
  notes?: string;
}

export interface Reservation {
  id: string;
  guestName: string;
  guestPhone: string;
  date: string;
  time: string;
  guests: number;
  tableId?: string;
  tableName?: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no_show';
  notes?: string;
}

export interface Notification {
  id: string;
  type: 'reservation' | 'shift' | 'stoplist' | 'payment' | 'shift_unclosed' | 'late' | 'info';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface DailyStats {
  date: string;
  revenue: number;
  orders: number;
  guests: number;
  avgCheck: number;
}

export interface HourlyStats {
  hour: number;
  revenue: number;
  orders: number;
}

export interface FurnitureItem {
  id: string;
  type: string;
  name: string;
  category: 'tables' | 'chairs' | 'sofas' | 'bar' | 'dividers' | 'decor' | 'service';
  width: number;
  height: number;
  seats?: number;
  shape?: 'round' | 'square' | 'rectangle';
}

export interface FloorItem {
  id: string;
  furnitureId: string;
  type: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color?: string;
  seats?: number;
  tableNumber?: number;
  zone?: string;
}

import type { CafeTable } from '../types';

export const mockTables: CafeTable[] = [
  {
    id: 'tbl-1', number: 1, name: 'Стол 1', seats: 2, shape: 'round',
    status: 'occupied', position: { x: 120, y: 100 }, width: 80, height: 80,
    zone: 'main', waiterId: 'emp-3', guestCount: 2, openedAt: '12:30',
    currentOrderId: 'ord-1',
  },
  {
    id: 'tbl-2', number: 2, name: 'Стол 2', seats: 4, shape: 'round',
    status: 'free', position: { x: 260, y: 100 }, width: 100, height: 100,
    zone: 'main',
  },
  {
    id: 'tbl-3', number: 3, name: 'Стол 3', seats: 4, shape: 'square',
    status: 'reserved', position: { x: 400, y: 100 }, width: 100, height: 100,
    zone: 'main', reservationId: 'res-2',
  },
  {
    id: 'tbl-4', number: 4, name: 'Стол 4', seats: 4, shape: 'square',
    status: 'occupied', position: { x: 120, y: 250 }, width: 100, height: 100,
    zone: 'main', waiterId: 'emp-4', guestCount: 3, openedAt: '13:15',
    currentOrderId: 'ord-2',
  },
  {
    id: 'tbl-5', number: 5, name: 'Стол у окна', seats: 2, shape: 'rectangle',
    status: 'waiting_payment', position: { x: 280, y: 250 }, width: 120, height: 70,
    zone: 'window', waiterId: 'emp-3', guestCount: 2, openedAt: '11:45',
    currentOrderId: 'ord-3',
  },
  {
    id: 'tbl-6', number: 6, name: 'Стол у окна 2', seats: 4, shape: 'rectangle',
    status: 'free', position: { x: 430, y: 250 }, width: 120, height: 70,
    zone: 'window',
  },
  {
    id: 'tbl-7', number: 7, name: 'VIP-стол', seats: 8, shape: 'rectangle',
    status: 'occupied', position: { x: 120, y: 400 }, width: 220, height: 90,
    zone: 'vip', waiterId: 'emp-4', guestCount: 6, openedAt: '13:00',
    currentOrderId: 'ord-4',
  },
  {
    id: 'tbl-8', number: 8, name: 'Диван-зона', seats: 6, shape: 'rectangle',
    status: 'needs_cleaning', position: { x: 390, y: 390 }, width: 160, height: 110,
    zone: 'lounge',
  },
  {
    id: 'tbl-9', number: 9, name: 'Барная стойка 1', seats: 1, shape: 'bar',
    status: 'occupied', position: { x: 620, y: 100 }, width: 50, height: 50,
    zone: 'bar', waiterId: 'emp-3', guestCount: 1, openedAt: '14:00',
  },
  {
    id: 'tbl-10', number: 10, name: 'Барная стойка 2', seats: 1, shape: 'bar',
    status: 'free', position: { x: 680, y: 100 }, width: 50, height: 50,
    zone: 'bar',
  },
  {
    id: 'tbl-11', number: 11, name: 'Терраса 1', seats: 4, shape: 'square',
    status: 'free', position: { x: 120, y: 560 }, width: 100, height: 100,
    zone: 'terrace',
  },
  {
    id: 'tbl-12', number: 12, name: 'Терраса 2', seats: 4, shape: 'square',
    status: 'reserved', position: { x: 260, y: 560 }, width: 100, height: 100,
    zone: 'terrace', reservationId: 'res-3',
  },
];

export const tableZones = [
  { id: 'all', name: 'Все зоны' },
  { id: 'main', name: 'Основной зал' },
  { id: 'window', name: 'У окна' },
  { id: 'vip', name: 'VIP' },
  { id: 'lounge', name: 'Диван-зона' },
  { id: 'bar', name: 'Барная' },
  { id: 'terrace', name: 'Терраса' },
];

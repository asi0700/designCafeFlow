import type { Order, Reservation } from '../types';

export const mockOrders: Order[] = [
  {
    id: 'ord-1', tableId: 'tbl-1', tableName: 'Стол 1',
    waiterId: 'emp-3', waiterName: 'Дмитрий Волков',
    guestCount: 2, status: 'cooking', createdAt: '2024-01-15T12:30:00',
    total: 860,
    items: [
      { id: 'oi-1', menuItemId: 'mi-2', name: 'Капучино', price: 280, quantity: 2, status: 'served' },
      { id: 'oi-2', menuItemId: 'mi-11', name: 'Яичница Флорентин', price: 450, quantity: 1, status: 'cooking' },
      { id: 'oi-3', menuItemId: 'mi-9', name: 'Круассан классический', price: 220, quantity: 0, status: 'pending' },
    ],
  },
  {
    id: 'ord-2', tableId: 'tbl-4', tableName: 'Стол 4',
    waiterId: 'emp-4', waiterName: 'Екатерина Смирнова',
    guestCount: 3, status: 'open', createdAt: '2024-01-15T13:15:00',
    total: 1680,
    items: [
      { id: 'oi-4', menuItemId: 'mi-14', name: 'Паста Карбонара', price: 680, quantity: 2, status: 'cooking' },
      { id: 'oi-5', menuItemId: 'mi-3', name: 'Латте', price: 320, quantity: 1, status: 'served' },
    ],
  },
  {
    id: 'ord-3', tableId: 'tbl-5', tableName: 'Стол у окна',
    waiterId: 'emp-3', waiterName: 'Дмитрий Волков',
    guestCount: 2, status: 'ready', createdAt: '2024-01-15T11:45:00',
    total: 1220,
    items: [
      { id: 'oi-6', menuItemId: 'mi-12', name: 'Авокадо тост', price: 520, quantity: 2, status: 'served' },
      { id: 'oi-7', menuItemId: 'mi-1', name: 'Эспрессо', price: 180, quantity: 1, status: 'served' },
    ],
  },
  {
    id: 'ord-4', tableId: 'tbl-7', tableName: 'VIP-стол',
    waiterId: 'emp-4', waiterName: 'Екатерина Смирнова',
    guestCount: 6, status: 'cooking', createdAt: '2024-01-15T13:00:00',
    total: 4560,
    items: [
      { id: 'oi-8', menuItemId: 'mi-14', name: 'Паста Карбонара', price: 680, quantity: 3, status: 'cooking' },
      { id: 'oi-9', menuItemId: 'mi-15', name: 'Ризотто с грибами', price: 720, quantity: 2, status: 'pending' },
      { id: 'oi-10', menuItemId: 'mi-2', name: 'Капучино', price: 280, quantity: 5, status: 'served' },
      { id: 'oi-11', menuItemId: 'mi-17', name: 'Тирамису', price: 380, quantity: 3, status: 'pending' },
    ],
  },
  {
    id: 'ord-5', tableId: 'tbl-9', tableName: 'Барная стойка 1',
    waiterId: 'emp-3', waiterName: 'Дмитрий Волков',
    guestCount: 1, status: 'open', createdAt: '2024-01-15T14:00:00',
    total: 500,
    items: [
      { id: 'oi-12', menuItemId: 'mi-3', name: 'Латте', price: 320, quantity: 1, status: 'served' },
      { id: 'oi-13', menuItemId: 'mi-9', name: 'Круассан', price: 220, quantity: 1, status: 'served' },
    ],
  },
];

const today = new Date();
const fmt = (d: Date, time: string) => {
  const dd = d.toISOString().split('T')[0];
  return `${dd}T${time}:00`;
};
const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

export const mockReservations: Reservation[] = [
  {
    id: 'res-1', guestName: 'Анна Соколова', guestPhone: '+7 (916) 111-22-33',
    date: today.toISOString().split('T')[0], time: '15:00', guests: 2,
    tableId: undefined, status: 'pending', notes: 'Аллергия на лактозу',
  },
  {
    id: 'res-2', guestName: 'Михаил Попов', guestPhone: '+7 (903) 333-44-55',
    date: today.toISOString().split('T')[0], time: '18:00', guests: 4,
    tableId: 'tbl-3', tableName: 'Стол 3', status: 'confirmed',
  },
  {
    id: 'res-3', guestName: 'Семья Ивановых', guestPhone: '+7 (925) 555-66-77',
    date: addDays(today, 1).toISOString().split('T')[0], time: '13:00', guests: 4,
    tableId: 'tbl-12', tableName: 'Терраса 2', status: 'confirmed',
    notes: 'День рождения, нужен торт',
  },
  {
    id: 'res-4', guestName: 'Корпоратив ООО Техно', guestPhone: '+7 (916) 777-88-99',
    date: addDays(today, 2).toISOString().split('T')[0], time: '19:00', guests: 12,
    status: 'confirmed', notes: 'Нужна сервировка для корпоратива',
  },
  {
    id: 'res-5', guestName: 'Дарья Романова', guestPhone: '+7 (903) 222-11-00',
    date: today.toISOString().split('T')[0], time: '20:00', guests: 2,
    status: 'confirmed',
  },
];

export { fmt, addDays };

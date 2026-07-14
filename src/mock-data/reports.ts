import type { DailyStats, HourlyStats } from '../types';

export const mockDailyStats: DailyStats[] = [
  { date: '2024-01-09', revenue: 38400, orders: 64, guests: 112, avgCheck: 600 },
  { date: '2024-01-10', revenue: 42100, orders: 71, guests: 128, avgCheck: 593 },
  { date: '2024-01-11', revenue: 35800, orders: 59, guests: 98, avgCheck: 607 },
  { date: '2024-01-12', revenue: 51200, orders: 84, guests: 152, avgCheck: 609 },
  { date: '2024-01-13', revenue: 61400, orders: 97, guests: 188, avgCheck: 633 },
  { date: '2024-01-14', revenue: 58700, orders: 91, guests: 172, avgCheck: 645 },
  { date: '2024-01-15', revenue: 47300, orders: 78, guests: 134, avgCheck: 607 },
];

export const mockWeeklyStats: DailyStats[] = [
  { date: '2023-12-18', revenue: 198400, orders: 312, guests: 542, avgCheck: 635 },
  { date: '2023-12-25', revenue: 221600, orders: 348, guests: 612, avgCheck: 637 },
  { date: '2024-01-01', revenue: 187200, orders: 294, guests: 498, avgCheck: 637 },
  { date: '2024-01-08', revenue: 335700, orders: 545, guests: 984, avgCheck: 616 },
];

export const mockHourlyStats: HourlyStats[] = [
  { hour: 8, revenue: 1200, orders: 4 },
  { hour: 9, revenue: 3400, orders: 8 },
  { hour: 10, revenue: 5800, orders: 12 },
  { hour: 11, revenue: 8200, orders: 18 },
  { hour: 12, revenue: 12400, orders: 24 },
  { hour: 13, revenue: 14600, orders: 28 },
  { hour: 14, revenue: 11200, orders: 22 },
  { hour: 15, revenue: 8600, orders: 16 },
  { hour: 16, revenue: 6800, orders: 14 },
  { hour: 17, revenue: 9200, orders: 18 },
  { hour: 18, revenue: 13400, orders: 26 },
  { hour: 19, revenue: 16800, orders: 32 },
  { hour: 20, revenue: 14200, orders: 28 },
  { hour: 21, revenue: 8600, orders: 16 },
  { hour: 22, revenue: 3800, orders: 8 },
];

export const mockTopDishes = [
  { name: 'Паста Карбонара', sales: 84, revenue: 57120 },
  { name: 'Авокадо тост', sales: 71, revenue: 36920 },
  { name: 'Капучино', sales: 156, revenue: 43680 },
  { name: 'Латте', sales: 134, revenue: 42880 },
  { name: 'Тирамису', sales: 63, revenue: 23940 },
  { name: 'Яичница Флорентин', sales: 48, revenue: 21600 },
  { name: 'Эспрессо', sales: 98, revenue: 17640 },
  { name: 'Чизкейк', sales: 52, revenue: 21840 },
];

export const mockPaymentMethods = [
  { method: 'Карта', amount: 284600, percent: 74 },
  { method: 'Наличные', amount: 76200, percent: 20 },
  { method: 'СБП', amount: 23100, percent: 6 },
];

export const mockVenueInfo = {
  id: 'venue-1',
  name: 'CafeFlow Demo',
  address: 'Москва, ул. Кофейная, 12',
  phone: '+7 (495) 123-45-67',
  email: 'hello@cafeflow.demo',
  openTime: '08:00',
  closeTime: '23:00',
  isOpen: true,
};

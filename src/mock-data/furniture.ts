import type { FurnitureItem } from '../types';

export const furnitureCatalog: FurnitureItem[] = [
  { id: 'f-rt2', type: 'round_table_2', name: 'Стол круглый 2', category: 'tables', width: 80, height: 80, seats: 2, shape: 'round' },
  { id: 'f-rt4', type: 'round_table_4', name: 'Стол круглый 4', category: 'tables', width: 100, height: 100, seats: 4, shape: 'round' },
  { id: 'f-sq4', type: 'square_table_4', name: 'Стол квадрат 4', category: 'tables', width: 100, height: 100, seats: 4, shape: 'square' },
  { id: 'f-rect4', type: 'rect_table_4', name: 'Стол прямоугольный', category: 'tables', width: 140, height: 80, seats: 4, shape: 'rectangle' },
  { id: 'f-long8', type: 'long_table_8', name: 'Большой стол 8', category: 'tables', width: 240, height: 90, seats: 8, shape: 'rectangle' },
  { id: 'f-bar', type: 'bar_seat', name: 'Барное место', category: 'bar', width: 50, height: 50, seats: 1, shape: 'round' },
  { id: 'f-barcounter', type: 'bar_counter', name: 'Барная стойка', category: 'bar', width: 200, height: 60 },
  { id: 'f-chair', type: 'chair', name: 'Стул', category: 'chairs', width: 40, height: 40 },
  { id: 'f-bchair', type: 'bar_chair', name: 'Барный стул', category: 'chairs', width: 35, height: 35 },
  { id: 'f-armchair', type: 'armchair', name: 'Кресло', category: 'chairs', width: 60, height: 60 },
  { id: 'f-sofa', type: 'sofa', name: 'Диван', category: 'sofas', width: 180, height: 70 },
  { id: 'f-sofa2', type: 'sofa_corner', name: 'Диван угловой', category: 'sofas', width: 150, height: 150 },
  { id: 'f-div', type: 'divider', name: 'Перегородка', category: 'dividers', width: 120, height: 20 },
  { id: 'f-plant', type: 'plant', name: 'Растение', category: 'decor', width: 50, height: 50 },
  { id: 'f-cash', type: 'cashier', name: 'Касса', category: 'service', width: 80, height: 50 },
  { id: 'f-enter', type: 'entrance', name: 'Вход', category: 'service', width: 80, height: 20 },
  { id: 'f-window', type: 'window', name: 'Окно', category: 'service', width: 100, height: 15 },
  { id: 'f-kitchen', type: 'kitchen', name: 'Кухня', category: 'service', width: 120, height: 60 },
  { id: 'f-wc', type: 'toilet', name: 'Туалет', category: 'service', width: 60, height: 60 },
];

export const furnitureCategories = [
  { id: 'tables', name: 'Столы' },
  { id: 'chairs', name: 'Стулья' },
  { id: 'sofas', name: 'Диваны' },
  { id: 'bar', name: 'Барные' },
  { id: 'dividers', name: 'Перегородки' },
  { id: 'decor', name: 'Декор' },
  { id: 'service', name: 'Служебные' },
];

export const floorTemplates = [
  { id: 'coffee', name: 'Кофейня', description: '8 столов, барная стойка' },
  { id: 'cafe', name: 'Классическое кафе', description: '12 столов, VIP-зона' },
  { id: 'restaurant', name: 'Ресторан', description: '16 столов, разные зоны' },
  { id: 'bar', name: 'Бар', description: 'Барная стойка, высокие столики' },
  { id: 'terrace', name: 'Летняя терраса', description: '8 уличных столов' },
];

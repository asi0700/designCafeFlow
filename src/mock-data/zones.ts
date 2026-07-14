import type { Zone } from '../types';

export const mockZones: Zone[] = [
  {
    id: 'main', name: 'Основной зал', color: '#f59e0b',
    floorPattern: 'wood_light',
    x: 40, y: 40, width: 560, height: 300, isActive: true,
    description: 'Центральный зал для гостей',
  },
  {
    id: 'window', name: 'У окна', color: '#3b82f6',
    floorPattern: 'wood_light',
    x: 40, y: 40, width: 560, height: 150, isActive: true,
    description: 'Столики у панорамных окон',
  },
  {
    id: 'vip', name: 'VIP', color: '#8b5cf6',
    floorPattern: 'carpet',
    x: 40, y: 340, width: 360, height: 120, isActive: true,
    description: 'Приватная зона',
  },
  {
    id: 'lounge', name: 'Диван-зона', color: '#f97316',
    floorPattern: 'carpet',
    x: 360, y: 310, width: 240, height: 150, isActive: true,
    description: 'Мягкая мебель и диваны',
  },
  {
    id: 'bar', name: 'Бар', color: '#06b6d4',
    floorPattern: 'wood_dark',
    x: 620, y: 40, width: 200, height: 260, isActive: true,
    description: 'Барная стойка и коктейли',
  },
  {
    id: 'terrace', name: 'Терраса', color: '#10b981',
    floorPattern: 'tile',
    x: 40, y: 480, width: 440, height: 150, isActive: true,
    description: 'Летняя открытая терраса',
  },
];

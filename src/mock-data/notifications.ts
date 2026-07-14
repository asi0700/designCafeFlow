import type { Notification } from '../types';

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1', type: 'reservation', priority: 'high',
    title: 'Новая бронь',
    message: 'Анна Соколова забронировала стол на 15:00 сегодня (2 чел.)',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    isRead: false,
  },
  {
    id: 'notif-2', type: 'payment', priority: 'high',
    title: 'Ожидает оплаты',
    message: 'Стол у окна (Стол 5) ожидает оплату уже 15 минут',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    isRead: false,
  },
  {
    id: 'notif-3', type: 'stoplist', priority: 'medium',
    title: 'Стоп-лист обновлён',
    message: 'Раф кофе добавлен в стоп-лист — нет сливок',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    isRead: false,
  },
  {
    id: 'notif-4', type: 'late', priority: 'medium',
    title: 'Сотрудник опоздал',
    message: 'Екатерина Смирнова опоздала на 15 минут',
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    isRead: true,
  },
  {
    id: 'notif-5', type: 'shift_unclosed', priority: 'low',
    title: 'Смена не закрыта',
    message: 'Сергей Тихонов не закрыл смену 13 января',
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    isRead: true,
  },
  {
    id: 'notif-6', type: 'info', priority: 'low',
    title: 'Расписание на неделю опубликовано',
    message: 'Менеджер Марина Козлова опубликовала расписание на следующую неделю',
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    isRead: true,
  },
];

import React, { useState } from 'react';
import { Bell, Calendar, AlertTriangle, AlertCircle, Info, Check, CheckCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { mockNotifications } from '../../mock-data/notifications';
import type { Notification } from '../../types';

const typeIcons: Record<Notification['type'], React.ReactNode> = {
  reservation: <Calendar size={16} className="text-blue-500" />,
  shift: <Calendar size={16} className="text-teal-500" />,
  stoplist: <AlertTriangle size={16} className="text-amber-500" />,
  payment: <AlertCircle size={16} className="text-orange-500" />,
  shift_unclosed: <AlertTriangle size={16} className="text-rose-500" />,
  late: <AlertCircle size={16} className="text-rose-500" />,
  info: <Info size={16} className="text-stone-400" />,
};

const priorityVariant: Record<Notification['priority'], 'danger' | 'warning' | 'default'> = {
  high: 'danger',
  medium: 'warning',
  low: 'default',
};

const priorityLabel: Record<Notification['priority'], string> = {
  high: 'Важно',
  medium: 'Внимание',
  low: 'Инфо',
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'только что';
  if (mins < 60) return `${mins} мин назад`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ч назад`;
  return `${Math.floor(hours / 24)} дн назад`;
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const displayed = filter === 'unread' ? notifications.filter(n => !n.isRead) : notifications;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Уведомления</h1>
          {unreadCount > 0 && <p className="text-sm text-stone-500 mt-0.5">{unreadCount} непрочитанных</p>}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" icon={<CheckCheck size={14} />} onClick={markAllRead}>
            Прочитать все
          </Button>
        )}
      </div>

      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl w-fit">
        {[{ key: 'all', label: `Все (${notifications.length})` }, { key: 'unread', label: `Непрочитанные (${unreadCount})` }].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as 'all' | 'unread')}
            className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all ${filter === key ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {displayed.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <Bell size={36} className="mx-auto mb-3 opacity-30" />
            <p>Нет уведомлений</p>
          </div>
        ) : displayed.map(n => (
          <div
            key={n.id}
            className={`rounded-2xl border p-4 transition-all cursor-pointer hover:shadow-sm ${n.isRead ? 'bg-white border-stone-100 opacity-75' : 'bg-white border-stone-200 shadow-sm'}`}
            onClick={() => markRead(n.id)}
          >
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${n.isRead ? 'bg-stone-100' : 'bg-amber-50'}`}>
                {typeIcons[n.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold ${n.isRead ? 'text-stone-600' : 'text-stone-900'}`}>{n.title}</p>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Badge variant={priorityVariant[n.priority]} size="sm">{priorityLabel[n.priority]}</Badge>
                    {!n.isRead && <span className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />}
                  </div>
                </div>
                <p className="text-sm text-stone-500 mt-0.5 leading-snug">{n.message}</p>
                <p className="text-xs text-stone-400 mt-1.5">{timeAgo(n.createdAt)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

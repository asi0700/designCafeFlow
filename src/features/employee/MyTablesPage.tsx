import React, { useState } from 'react';
import { Users, Clock, DollarSign, ShoppingBag, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { mockTables } from '../../mock-data/tables';
import { mockOrders } from '../../mock-data/orders';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency, getStatusLabel } from '../../utils/formatters';
import { useAppToast } from '../../hooks/useToastContext';
import type { CafeTable } from '../../types';

const statusConfig: Record<string, { label: string; color: string }> = {
  free: { label: 'Свободен', color: 'bg-teal-50 border-teal-200' },
  occupied: { label: 'Занят', color: 'bg-amber-50 border-amber-300' },
  waiting_payment: { label: 'Ожидает оплату', color: 'bg-orange-50 border-orange-300' },
  needs_cleaning: { label: 'Нужна уборка', color: 'bg-rose-50 border-rose-300' },
  reserved: { label: 'Забронирован', color: 'bg-blue-50 border-blue-200' },
  waiting: { label: 'Ожидает гостя', color: 'bg-amber-50 border-amber-200' },
};

export function MyTablesPage() {
  const { currentUser } = useAuth();
  const { addToast } = useAppToast();
  const [selectedTable, setSelectedTable] = useState<CafeTable | null>(null);

  if (!currentUser) return null;

  const myTables = mockTables.filter(t => t.waiterId === currentUser.id);
  const allTables = mockTables;
  const displayTables = currentUser.role === 'waiter' ? myTables : allTables;

  const getOrder = (tableId: string) => mockOrders.find(o => o.tableId === tableId && o.status !== 'closed');

  const stats = {
    occupied: myTables.filter(t => t.status === 'occupied').length,
    payment: myTables.filter(t => t.status === 'waiting_payment').length,
    guests: myTables.reduce((a, t) => a + (t.guestCount ?? 0), 0),
    revenue: myTables.reduce((a, t) => {
      const order = getOrder(t.id);
      return a + (order?.total ?? 0);
    }, 0),
  };

  return (
    <div className="p-4 sm:p-6 max-w-lg mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Мои столы</h1>
        <p className="text-stone-500 text-sm mt-0.5">
          {currentUser.role === 'waiter' ? `${myTables.length} назначенных столов` : 'Все столы'}
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-2xl font-bold text-amber-700">{stats.occupied}</p>
          <p className="text-xs text-amber-600 mt-0.5">занятых столов</p>
        </div>
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4">
          <p className="text-2xl font-bold text-teal-700">{stats.guests}</p>
          <p className="text-xs text-teal-600 mt-0.5">гостей за столами</p>
        </div>
        <div className="bg-white border border-stone-200 rounded-2xl p-4">
          <p className="text-2xl font-bold text-stone-800">{formatCurrency(stats.revenue)}</p>
          <p className="text-xs text-stone-500 mt-0.5">в открытых заказах</p>
        </div>
        <div className={`${stats.payment > 0 ? 'bg-orange-50 border-orange-200' : 'bg-white border-stone-200'} border rounded-2xl p-4`}>
          <p className={`text-2xl font-bold ${stats.payment > 0 ? 'text-orange-600' : 'text-stone-800'}`}>{stats.payment}</p>
          <p className="text-xs text-stone-500 mt-0.5">ожидают оплату</p>
        </div>
      </div>

      {/* Tables grid */}
      <div className="space-y-2.5">
        {displayTables.map(table => {
          const order = getOrder(table.id);
          const sc = statusConfig[table.status] ?? { label: table.status, color: 'bg-stone-50 border-stone-200' };
          return (
            <div
              key={table.id}
              onClick={() => setSelectedTable(table)}
              className={`rounded-2xl border p-4 cursor-pointer hover:shadow-sm transition-all ${sc.color}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-stone-900 text-lg leading-none">{table.number}</p>
                    <p className="font-medium text-stone-700">{table.name}</p>
                  </div>
                  <p className="text-xs text-stone-500">{table.seats} мест</p>
                </div>
                <Badge
                  variant={table.status === 'free' ? 'success' : table.status === 'waiting_payment' ? 'warning' : table.status === 'needs_cleaning' ? 'danger' : table.status === 'reserved' ? 'info' : 'amber'}
                  size="sm"
                >
                  {sc.label}
                </Badge>
              </div>
              {(table.guestCount || table.openedAt) && (
                <div className="flex items-center gap-3 mt-2 text-xs text-stone-600">
                  {table.guestCount && <span className="flex items-center gap-1"><Users size={11} />{table.guestCount} гостей</span>}
                  {table.openedAt && <span className="flex items-center gap-1"><Clock size={11} />с {table.openedAt}</span>}
                  {order && <span className="flex items-center gap-1 font-medium text-amber-700"><DollarSign size={11} />{formatCurrency(order.total)}</span>}
                </div>
              )}
              {order && (
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-stone-500">{order.items.length} позиций</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-amber-600 hover:bg-amber-50 p-0 h-auto font-medium"
                    onClick={e => { e.stopPropagation(); addToast(`Заказ стола "${table.name}" открыт`, 'info'); }}
                  >
                    Заказ <ChevronRight size={12} />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
        {displayTables.length === 0 && (
          <div className="text-center py-12 text-stone-400">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="font-medium text-stone-600">Нет назначенных столов</p>
            <p className="text-sm mt-1">Менеджер назначит вам столы перед сменой</p>
          </div>
        )}
      </div>

      {selectedTable && (
        <Modal isOpen={true} onClose={() => setSelectedTable(null)} title={selectedTable.name} size="sm">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Мест', value: String(selectedTable.seats) },
                { label: 'Статус', value: statusConfig[selectedTable.status]?.label ?? selectedTable.status },
                { label: 'Гостей', value: String(selectedTable.guestCount ?? 0) },
                { label: 'Открыт', value: selectedTable.openedAt ?? '—' },
              ].map(s => (
                <div key={s.label} className="bg-stone-50 rounded-xl p-3">
                  <p className="text-xs text-stone-500">{s.label}</p>
                  <p className="text-sm font-semibold text-stone-800 mt-0.5">{s.value}</p>
                </div>
              ))}
            </div>
            {getOrder(selectedTable.id) && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                <p className="font-semibold text-stone-800 text-sm mb-1">Заказ</p>
                {getOrder(selectedTable.id)!.items.map(item => (
                  <div key={item.id} className="flex justify-between text-xs text-stone-600 py-0.5">
                    <span>{item.name} ×{item.quantity}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-sm text-stone-800 pt-2 border-t border-amber-200 mt-1.5">
                  <span>Итого</span>
                  <span>{formatCurrency(getOrder(selectedTable.id)!.total)}</span>
                </div>
              </div>
            )}
            <Button variant="primary" fullWidth onClick={() => { addToast(`Действие для "${selectedTable.name}" выполнено`, 'success'); setSelectedTable(null); }}>
              {selectedTable.status === 'waiting_payment' ? 'Принять оплату' : selectedTable.status === 'free' ? 'Открыть стол' : 'Открыть заказ'}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

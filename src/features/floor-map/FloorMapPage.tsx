import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Edit3, Plus, X, ChevronRight, Users, Clock, CreditCard,
  Trash2, Settings2, Search, Filter,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { ConfirmDialog } from '../../components/ui/EmptyState';
import { mockTables } from '../../mock-data/tables';
import { mockZones } from '../../mock-data/zones';
import { mockOrders, mockReservations } from '../../mock-data/orders';
import { mockEmployees } from '../../mock-data/employees';
import { getStatusLabel, formatCurrency } from '../../utils/formatters';
import { useAppToast } from '../../hooks/useToastContext';
import type { CafeTable, TableStatus, Zone } from '../../types';
import { TableCanvas } from './TableCanvas';

const STATUS_CONFIG: Record<TableStatus, {
  label: string; ring: string; badge: 'success'|'info'|'warning'|'amber'|'danger'|'default';
  primaryAction: string;
}> = {
  free:            { label: 'Свободен',        ring: 'border-teal-300',   badge: 'success', primaryAction: 'Посадить гостей' },
  reserved:        { label: 'Забронирован',    ring: 'border-blue-300',   badge: 'info',    primaryAction: 'Гости пришли' },
  waiting:         { label: 'Ожидает гостя',   ring: 'border-amber-300',  badge: 'warning', primaryAction: 'Гости пришли' },
  occupied:        { label: 'Занят',           ring: 'border-amber-400',  badge: 'amber',   primaryAction: 'Открыть заказ' },
  waiting_payment: { label: 'Ожидает оплату',  ring: 'border-orange-400', badge: 'warning', primaryAction: 'Принять оплату' },
  needs_cleaning:  { label: 'Нужна уборка',    ring: 'border-rose-400',   badge: 'danger',  primaryAction: 'Стол готов' },
};

const FLOOR_PATTERN_LABELS: Record<Zone['floorPattern'], string> = {
  wood_light: 'Светлое дерево',
  wood_dark: 'Тёмное дерево',
  tile: 'Плитка',
  carpet: 'Ковёр',
  concrete: 'Бетон',
};

export function FloorMapPage() {
  const navigate = useNavigate();
  const { addToast } = useAppToast();
  const [tables, setTables] = useState<CafeTable[]>(mockTables);
  const [zones, setZones] = useState<Zone[]>(mockZones);
  const [selectedTable, setSelectedTable] = useState<CafeTable | null>(null);
  const [activeZone, setActiveZone] = useState('all');
  const [showZoneManager, setShowZoneManager] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [search, setSearch] = useState('');

  const waiters = mockEmployees.filter(e => e.role === 'waiter' || e.role === 'manager');

  const filteredTables = tables.filter(t => {
    const zoneMatch = activeZone === 'all' || t.zone === activeZone;
    const searchMatch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || String(t.number) === search;
    return zoneMatch && searchMatch;
  });

  const updateStatus = (id: string, status: TableStatus) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    setSelectedTable(prev => prev?.id === id ? { ...prev, status } : prev);
    addToast(`Статус: ${STATUS_CONFIG[status].label}`, 'success');
  };

  const handlePrimaryAction = (table: CafeTable) => {
    const actions: Record<TableStatus, () => void> = {
      free: () => { updateStatus(table.id, 'occupied'); addToast('Стол открыт', 'success'); },
      reserved: () => { updateStatus(table.id, 'occupied'); addToast('Гости приняты', 'success'); },
      waiting: () => { updateStatus(table.id, 'occupied'); addToast('Гости приняты', 'success'); },
      occupied: () => setShowOrderModal(true),
      waiting_payment: () => { updateStatus(table.id, 'needs_cleaning'); addToast('Оплата принята, стол на уборку', 'success'); },
      needs_cleaning: () => { updateStatus(table.id, 'free'); addToast('Стол убран', 'success'); },
    };
    actions[table.status]?.();
  };

  const getOrder = (tableId: string) => mockOrders.find(o => o.tableId === tableId && o.status !== 'closed' && o.status !== 'cancelled');
  const getReservation = (resId?: string) => resId ? mockReservations.find(r => r.id === resId) : undefined;
  const getWaiter = (waiterId?: string) => waiterId ? mockEmployees.find(e => e.id === waiterId) : undefined;

  const stats = {
    free: tables.filter(t => t.status === 'free').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
    payment: tables.filter(t => t.status === 'waiting_payment').length,
    cleaning: tables.filter(t => t.status === 'needs_cleaning').length,
  };

  const allZoneTabs = [{ id: 'all', name: 'Все зоны', color: '#78716c' }, ...zones.filter(z => z.isActive)];

  return (
    <div className="flex flex-col h-screen bg-stone-50 overflow-hidden">
      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-stone-100 px-4 sm:px-5 py-3 flex-shrink-0">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-lg font-bold text-stone-900">Карта зала</h1>
            <p className="text-xs text-stone-400">{tables.length} столов · {stats.occupied} занято</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="relative hidden sm:block">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Стол или гость..."
                className="border border-stone-200 rounded-xl pl-7 pr-3 py-1.5 text-xs w-40 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              />
            </div>
            <Button variant="outline" size="sm" icon={<Settings2 size={13} />} onClick={() => setShowZoneManager(true)}>
              <span className="hidden sm:inline">Зоны</span>
            </Button>
            <Button variant="outline" size="sm" icon={<Edit3 size={13} />} onClick={() => navigate('/app/floor/edit')}>
              <span className="hidden sm:inline">Редактор</span>
            </Button>
            <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => addToast('Новая бронь — форма бронирования', 'info')}>
              <span className="hidden sm:inline">Новая бронь</span>
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-2 mb-2.5 overflow-x-auto pb-0.5">
          {[
            { label: 'Свободно', count: stats.free, color: 'text-teal-600 bg-teal-50 border-teal-200' },
            { label: 'Занято', count: stats.occupied, color: 'text-amber-700 bg-amber-50 border-amber-200' },
            { label: 'Бронь', count: stats.reserved, color: 'text-blue-700 bg-blue-50 border-blue-200' },
            { label: 'Оплата', count: stats.payment, color: 'text-orange-700 bg-orange-50 border-orange-200' },
            { label: 'Уборка', count: stats.cleaning, color: 'text-rose-600 bg-rose-50 border-rose-200' },
          ].map(s => (
            <div key={s.label} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium flex-shrink-0 ${s.color}`}>
              <span className="font-bold text-sm leading-none">{s.count}</span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Zone tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {allZoneTabs.map(z => (
            <button
              key={z.id}
              onClick={() => setActiveZone(z.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeZone === z.id ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {z.id !== 'all' && (
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: z.color }} />
              )}
              {z.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main area ────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 overflow-hidden">
          <TableCanvas
            tables={filteredTables}
            zones={zones}
            selectedId={selectedTable?.id}
            activeZone={activeZone}
            onTableClick={t => setSelectedTable(t)}
          />
        </div>

        {/* Sidebar (desktop) */}
        {selectedTable && (
          <div className="w-72 bg-white border-l border-stone-100 flex flex-col flex-shrink-0 overflow-y-auto animate-slide-right hidden lg:flex">
            <TableSidebar
              table={selectedTable}
              order={getOrder(selectedTable.id)}
              reservation={getReservation(selectedTable.reservationId)}
              waiter={getWaiter(selectedTable.waiterId)}
              onClose={() => setSelectedTable(null)}
              onStatusChange={(s) => updateStatus(selectedTable.id, s)}
              onPrimaryAction={() => handlePrimaryAction(selectedTable)}
              onOpenOrder={() => setShowOrderModal(true)}
            />
          </div>
        )}
      </div>

      {/* Mobile detail modal */}
      {selectedTable && (
        <div className="lg:hidden">
          <Modal isOpen={true} onClose={() => setSelectedTable(null)} size="lg">
            <TableSidebar
              table={selectedTable}
              order={getOrder(selectedTable.id)}
              reservation={getReservation(selectedTable.reservationId)}
              waiter={getWaiter(selectedTable.waiterId)}
              onClose={() => setSelectedTable(null)}
              onStatusChange={(s) => updateStatus(selectedTable.id, s)}
              onPrimaryAction={() => handlePrimaryAction(selectedTable)}
              onOpenOrder={() => setShowOrderModal(true)}
            />
          </Modal>
        </div>
      )}

      {/* Order modal */}
      <Modal isOpen={showOrderModal} onClose={() => setShowOrderModal(false)}
        title={`Заказ — ${selectedTable?.name}`} size="lg">
        {selectedTable && (
          <OrderView table={selectedTable} onClose={() => setShowOrderModal(false)} addToast={addToast} />
        )}
      </Modal>

      {/* Zone manager modal */}
      <Modal isOpen={showZoneManager} onClose={() => setShowZoneManager(false)} title="Управление зонами" size="md">
        <ZoneManager
          zones={zones}
          onChange={setZones}
          onClose={() => setShowZoneManager(false)}
          addToast={addToast}
        />
      </Modal>
    </div>
  );
}

// ─── Table Sidebar ────────────────────────────────────────────────────────────
function TableSidebar({ table, order, reservation, waiter, onClose, onStatusChange, onPrimaryAction, onOpenOrder }: {
  table: CafeTable;
  order: ReturnType<typeof mockOrders.find>;
  reservation: ReturnType<typeof mockReservations.find> | undefined;
  waiter: ReturnType<typeof mockEmployees.find> | undefined;
  onClose: () => void;
  onStatusChange: (s: TableStatus) => void;
  onPrimaryAction: () => void;
  onOpenOrder: () => void;
}) {
  const cfg = STATUS_CONFIG[table.status];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-4 border-b border-stone-100 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-stone-900">{table.name}</h3>
            <Badge variant={cfg.badge} size="sm">{cfg.label}</Badge>
          </div>
          <p className="text-stone-500 text-xs mt-0.5">{table.seats} мест · зона: {table.zone}</p>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-stone-100 text-stone-400"><X size={15} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Quick info */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Гостей', value: table.guestCount ? `${table.guestCount} / ${table.seats}` : `0 / ${table.seats}`, icon: Users },
            { label: 'Открыт', value: table.openedAt ?? '—', icon: Clock },
          ].map(s => (
            <div key={s.label} className="bg-stone-50 rounded-xl p-2.5">
              <div className="flex items-center gap-1.5 text-stone-400 mb-0.5">
                <s.icon size={11} /><span className="text-xs">{s.label}</span>
              </div>
              <p className="text-sm font-semibold text-stone-800">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Waiter */}
        {waiter && (
          <div className="flex items-center gap-2.5 p-2.5 bg-stone-50 rounded-xl">
            <Avatar name={waiter.name} size="sm" />
            <div>
              <p className="text-xs text-stone-500">Официант</p>
              <p className="text-sm font-medium text-stone-800">{waiter.name}</p>
            </div>
          </div>
        )}

        {/* Active order */}
        {order && (
          <button
            onClick={onOpenOrder}
            className="w-full text-left bg-amber-50 border border-amber-200 rounded-xl p-3 hover:bg-amber-100 transition-colors"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-amber-900">Текущий заказ</span>
              <span className="text-base font-bold text-amber-700">{formatCurrency(order.total)}</span>
            </div>
            <div className="space-y-0.5">
              {order.items.slice(0, 3).map(item => (
                <div key={item.id} className="flex justify-between text-xs text-amber-800">
                  <span>{item.name} ×{item.quantity}</span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
              {order.items.length > 3 && (
                <p className="text-xs text-amber-600">+{order.items.length - 3} ещё</p>
              )}
            </div>
            <div className="flex items-center justify-end gap-1 mt-1.5 text-xs text-amber-700 font-medium">
              Открыть заказ <ChevronRight size={11} />
            </div>
          </button>
        )}

        {/* Reservation */}
        {reservation && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <p className="text-xs font-semibold text-blue-900 mb-1">Бронь</p>
            <p className="text-sm font-medium text-blue-800">{reservation.guestName}</p>
            <p className="text-xs text-blue-600">{reservation.time} · {reservation.guests} чел.</p>
            {reservation.notes && <p className="text-xs text-blue-500 mt-1">{reservation.notes}</p>}
          </div>
        )}

        {/* Status change */}
        <div>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Изменить статус</p>
          <div className="grid grid-cols-2 gap-1.5">
            {(Object.entries(STATUS_CONFIG) as [TableStatus, typeof STATUS_CONFIG[TableStatus]][]).map(([key, c]) => (
              <button
                key={key}
                onClick={() => onStatusChange(key)}
                className={`text-xs px-2.5 py-2 rounded-xl border transition-all text-left font-medium ${
                  table.status === key
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'border-stone-200 text-stone-600 hover:border-stone-300 bg-white hover:bg-stone-50'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary action */}
      <div className="p-4 border-t border-stone-100 space-y-2">
        <Button variant="primary" fullWidth onClick={onPrimaryAction} size="md">
          {STATUS_CONFIG[table.status].primaryAction}
        </Button>
        <Button variant="ghost" fullWidth size="sm" className="text-stone-500"
          onClick={() => { onStatusChange('needs_cleaning'); }}>
          Отправить на уборку
        </Button>
      </div>
    </div>
  );
}

// ─── Order View ────────────────────────────────────────────────────────────────
function OrderView({ table, onClose, addToast }: {
  table: CafeTable;
  onClose: () => void;
  addToast: (m: string, t?: 'success'|'error'|'info'|'warning') => void;
}) {
  const order = mockOrders.find(o => o.tableId === table.id && o.status !== 'closed');
  const sColors: Record<string, string> = { pending: 'text-stone-400', cooking: 'text-amber-600', ready: 'text-teal-600', served: 'text-stone-500' };
  const sLabels: Record<string, string> = { pending: 'Ожидает', cooking: 'Готовится', ready: 'Готово', served: 'Подано' };

  if (!order) return (
    <div className="text-center py-8">
      <p className="text-4xl mb-3">📋</p>
      <p className="text-stone-600 font-medium">Заказ не найден</p>
      <Button variant="primary" size="sm" className="mt-4" onClick={() => { addToast('Новый заказ создан', 'success'); onClose(); }}>
        Создать заказ
      </Button>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
        <div>
          <p className="text-sm text-stone-500">Официант: <span className="font-medium text-stone-800">{order.waiterName}</span></p>
          <p className="text-sm text-stone-500">{order.guestCount} гостей · открыт в {table.openedAt}</p>
        </div>
        <Badge variant={order.status === 'ready' ? 'success' : 'warning'}>
          {order.status === 'cooking' ? 'Готовится' : order.status === 'ready' ? 'Готово' : 'Открыт'}
        </Badge>
      </div>

      <div className="space-y-1.5 mb-4">
        {order.items.map(item => (
          <div key={item.id} className="flex items-center justify-between py-2 border-b border-stone-50">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-800">{item.name} <span className="text-stone-400">×{item.quantity}</span></p>
              <p className={`text-xs ${sColors[item.status]}`}>{sLabels[item.status]}</p>
            </div>
            <p className="text-sm font-semibold text-stone-800">{formatCurrency(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between bg-stone-50 rounded-xl p-3 mb-4">
        <span className="font-semibold text-stone-800">Итого</span>
        <span className="text-xl font-bold text-stone-900">{formatCurrency(order.total)}</span>
      </div>

      <div className="flex gap-2">
        <Button variant="success" fullWidth icon={<CreditCard size={16} />}
          onClick={() => { addToast(`Оплата принята: ${formatCurrency(order.total)}`, 'success'); onClose(); }}>
          Принять оплату
        </Button>
        <Button variant="outline" icon={<Plus size={16} />}
          onClick={() => addToast('Добавление блюд — будет в полной версии', 'info')}>
          Добавить
        </Button>
      </div>
    </div>
  );
}

// ─── Zone Manager ─────────────────────────────────────────────────────────────
function ZoneManager({ zones, onChange, onClose, addToast }: {
  zones: Zone[];
  onChange: (z: Zone[]) => void;
  onClose: () => void;
  addToast: (m: string, t?: 'success'|'error'|'info'|'warning') => void;
}) {
  const [editZone, setEditZone] = useState<Zone | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const deleteZone = (id: string) => {
    onChange(zones.filter(z => z.id !== id));
    setDeleteId(null);
    addToast('Зона удалена', 'info');
  };

  const saveZone = (data: Partial<Zone>) => {
    if (editZone) {
      onChange(zones.map(z => z.id === editZone.id ? { ...z, ...data } : z));
      addToast('Зона обновлена', 'success');
    } else {
      const nz: Zone = {
        id: `zone-${Date.now()}`,
        name: data.name ?? 'Новая зона',
        color: data.color ?? '#94a3b8',
        floorPattern: data.floorPattern ?? 'wood_light',
        x: 60, y: 60, width: 200, height: 150,
        isActive: true,
        description: data.description,
      };
      onChange([...zones, nz]);
      addToast(`Зона "${nz.name}" создана`, 'success');
    }
    setShowForm(false);
    setEditZone(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500">{zones.length} зон настроено</p>
        <Button variant="primary" size="sm" icon={<Plus size={14} />}
          onClick={() => { setEditZone(null); setShowForm(true); }}>
          Добавить зону
        </Button>
      </div>

      <div className="space-y-2">
        {zones.map(z => (
          <div key={z.id} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
            <div className="w-4 h-4 rounded-full flex-shrink-0 border-2 border-white shadow" style={{ background: z.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-800">{z.name}</p>
              <p className="text-xs text-stone-500">{FLOOR_PATTERN_LABELS[z.floorPattern]}{z.description ? ` · ${z.description}` : ''}</p>
            </div>
            <div className="flex items-center gap-1">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={z.isActive} onChange={e => {
                  onChange(zones.map(oz => oz.id === z.id ? { ...oz, isActive: e.target.checked } : oz));
                }} className="sr-only peer" />
                <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:bg-amber-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
              </label>
              <button className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-400 hover:text-stone-700"
                onClick={() => { setEditZone(z); setShowForm(true); }}>
                <Edit3 size={13} />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-rose-50 text-stone-400 hover:text-rose-500"
                onClick={() => setDeleteId(z.id)}>
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <Modal isOpen={true} onClose={() => { setShowForm(false); setEditZone(null); }}
          title={editZone ? 'Редактировать зону' : 'Новая зона'} size="sm">
          <ZoneForm zone={editZone} onSave={saveZone} onCancel={() => { setShowForm(false); setEditZone(null); }} />
        </Modal>
      )}

      <ConfirmDialog isOpen={!!deleteId} title="Удалить зону?"
        message="Столы в этой зоне не будут удалены, только их привязка к зоне пропадёт."
        onConfirm={() => deleteZone(deleteId!)} onCancel={() => setDeleteId(null)} />
    </div>
  );
}

function ZoneForm({ zone, onSave, onCancel }: { zone: Zone | null; onSave: (d: Partial<Zone>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    name: zone?.name ?? '',
    color: zone?.color ?? '#f59e0b',
    floorPattern: zone?.floorPattern ?? 'wood_light' as Zone['floorPattern'],
    description: zone?.description ?? '',
  });

  const COLORS = ['#f59e0b', '#14b8a6', '#3b82f6', '#8b5cf6', '#f97316', '#10b981', '#ef4444', '#06b6d4', '#ec4899', '#78716c'];

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <Input label="Название зоны" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Основной зал" required />

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">Цвет</label>
        <div className="flex gap-2 flex-wrap">
          {COLORS.map(c => (
            <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
              className={`w-8 h-8 rounded-full border-2 transition-all ${form.color === c ? 'border-stone-800 scale-110' : 'border-transparent'}`}
              style={{ background: c }} />
          ))}
          <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
            className="w-8 h-8 rounded-full border border-stone-200 cursor-pointer" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">Покрытие пола</label>
        <div className="grid grid-cols-2 gap-1.5">
          {(Object.entries(FLOOR_PATTERN_LABELS) as [Zone['floorPattern'], string][]).map(([key, label]) => (
            <button key={key} type="button"
              onClick={() => setForm(f => ({ ...f, floorPattern: key }))}
              className={`text-xs py-2 px-3 rounded-xl border transition-all ${form.floorPattern === key ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 text-stone-600 hover:border-stone-300 bg-white'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <Input label="Описание (необязательно)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Приватная зона для VIP-гостей" />

      <div className="flex gap-2 pt-1">
        <Button type="button" variant="outline" fullWidth onClick={onCancel}>Отмена</Button>
        <Button type="submit" variant="primary" fullWidth>Сохранить</Button>
      </div>
    </form>
  );
}

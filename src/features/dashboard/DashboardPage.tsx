import React from 'react';
import { TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign, Clock, AlertCircle, Coffee, CheckCircle, ChevronRight, MapPin } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { Card, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { mockDailyStats, mockHourlyStats, mockTopDishes, mockVenueInfo } from '../../mock-data/reports';
import { mockTables } from '../../mock-data/tables';
import { mockOrders } from '../../mock-data/orders';
import { mockShifts } from '../../mock-data/shifts';
import { mockReservations } from '../../mock-data/orders';
import { mockNotifications } from '../../mock-data/notifications';
import { formatCurrency, getStatusLabel } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const dayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const weekData = mockDailyStats.map((d, i) => ({ ...d, day: dayLabels[i] }));

function KPICard({ label, value, change, changeLabel, icon: Icon, color }: {
  label: string; value: string; change: number; changeLabel: string;
  icon: React.ElementType; color: string;
}) {
  const positive = change >= 0;
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <p className="text-stone-500 text-sm font-medium">{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={16} />
        </div>
      </div>
      <p className="text-2xl font-bold text-stone-900">{value}</p>
      <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${positive ? 'text-teal-600' : 'text-rose-500'}`}>
        {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        <span>{positive ? '+' : ''}{changeLabel} к прошлой неделе</span>
      </div>
    </div>
  );
}

function TableStatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    free: 'bg-teal-400',
    reserved: 'bg-blue-400',
    waiting: 'bg-amber-400',
    occupied: 'bg-amber-500',
    waiting_payment: 'bg-orange-500',
    needs_cleaning: 'bg-rose-400',
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${colors[status] ?? 'bg-stone-300'}`} />;
}

export function DashboardPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const todayStats = mockDailyStats[mockDailyStats.length - 1];
  const prevDayStats = mockDailyStats[mockDailyStats.length - 2];

  const activeShifts = mockShifts.filter(s => s.status === 'active');
  const openTables = mockTables.filter(t => t.status === 'occupied').length;
  const activeOrders = mockOrders.filter(o => o.status !== 'closed' && o.status !== 'cancelled').length;
  const todayReservations = mockReservations.filter(r => r.date === today);
  const unreadNotifs = mockNotifications.filter(n => !n.isRead);

  const revenueChange = Math.round(((todayStats.revenue - prevDayStats.revenue) / prevDayStats.revenue) * 100);
  const ordersChange = todayStats.orders - prevDayStats.orders;

  const tableStats = {
    free: mockTables.filter(t => t.status === 'free').length,
    occupied: mockTables.filter(t => t.status === 'occupied').length,
    reserved: mockTables.filter(t => t.status === 'reserved').length,
    payment: mockTables.filter(t => t.status === 'waiting_payment').length,
    cleaning: mockTables.filter(t => t.status === 'needs_cleaning').length,
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2.5 h-2.5 rounded-full ${mockVenueInfo.isOpen ? 'bg-teal-500' : 'bg-stone-400'} animate-pulse`} />
            <span className={`text-sm font-medium ${mockVenueInfo.isOpen ? 'text-teal-700' : 'text-stone-500'}`}>
              {mockVenueInfo.isOpen ? 'Заведение открыто' : 'Заведение закрыто'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Добрый день, {currentUser?.name?.split(' ')[0]} 👋</h1>
          <p className="text-stone-500 text-sm mt-0.5">{mockVenueInfo.name} · {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={<MapPin size={14} />} onClick={() => navigate('/app/floor')}>
            Карта зала
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {unreadNotifs.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-amber-900 text-sm">Требует внимания</p>
            <div className="mt-1.5 space-y-1">
              {unreadNotifs.slice(0, 2).map(n => (
                <p key={n.id} className="text-amber-800 text-xs">{n.title}: {n.message}</p>
              ))}
            </div>
          </div>
          <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-100 flex-shrink-0" onClick={() => navigate('/app/notifications')}>
            Все {unreadNotifs.length}
          </Button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard label="Выручка" value={formatCurrency(todayStats.revenue)} change={revenueChange} changeLabel={`${Math.abs(revenueChange)}%`} icon={DollarSign} color="bg-amber-50 text-amber-600" />
        <KPICard label="Заказов" value={String(todayStats.orders)} change={ordersChange} changeLabel={String(Math.abs(ordersChange))} icon={ShoppingBag} color="bg-teal-50 text-teal-600" />
        <KPICard label="Гостей" value={String(todayStats.guests)} change={18} changeLabel="18" icon={Users} color="bg-blue-50 text-blue-600" />
        <KPICard label="Средний чек" value={formatCurrency(todayStats.avgCheck)} change={-3} changeLabel="3%" icon={Coffee} color="bg-stone-100 text-stone-600" />
      </div>

      {/* Status Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Сотрудников сейчас', value: activeShifts.length, icon: Users, sub: 'на смене', color: 'text-stone-800' },
          { label: 'Столов занято', value: `${openTables}/${mockTables.length}`, icon: MapPin, sub: 'из зала', color: 'text-amber-700' },
          { label: 'Активных заказов', value: activeOrders, icon: ShoppingBag, sub: 'в работе', color: 'text-teal-700' },
          { label: 'Броней сегодня', value: todayReservations.length, icon: Clock, sub: 'на сегодня', color: 'text-blue-700' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-stone-100 p-4">
            <p className="text-stone-500 text-xs mb-2">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-stone-400 text-xs mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="p-5 pb-0">
              <CardHeader title="Выручка за неделю" subtitle="По дням, тыс. ₽" />
            </div>
            <div className="px-4 pb-4">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={weekData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}к`} />
                  <Tooltip
                    contentStyle={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: 12 }}
                    formatter={(v: number) => [formatCurrency(v), 'Выручка']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2.5} fill="url(#revGrad)" dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Hall Load */}
        <Card>
          <CardHeader title="Зал сейчас" subtitle={`${mockTables.length} столов всего`} />
          <div className="space-y-2.5">
            {[
              { key: 'free', label: 'Свободны', count: tableStats.free, color: 'bg-teal-400' },
              { key: 'occupied', label: 'Заняты', count: tableStats.occupied, color: 'bg-amber-400' },
              { key: 'reserved', label: 'Забронированы', count: tableStats.reserved, color: 'bg-blue-400' },
              { key: 'payment', label: 'Ожидают оплату', count: tableStats.payment, color: 'bg-orange-400' },
              { key: 'cleaning', label: 'Нужна уборка', count: tableStats.cleaning, color: 'bg-rose-400' },
            ].map(s => (
              <div key={s.key}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-stone-600 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${s.color}`} />
                    {s.label}
                  </span>
                  <span className="font-semibold text-stone-800">{s.count}</span>
                </div>
                <div className="bg-stone-100 rounded-full h-1.5">
                  <div className={`${s.color} h-1.5 rounded-full transition-all`} style={{ width: `${(s.count / mockTables.length) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" fullWidth className="mt-4" onClick={() => navigate('/app/floor')}>
            Открыть карту зала
          </Button>
        </Card>
      </div>

      {/* Hourly + Active Shift + Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hourly chart */}
        <Card padding="none" className="lg:col-span-1">
          <div className="p-5 pb-0">
            <CardHeader title="Загрузка по часам" subtitle="Заказов в час" />
          </div>
          <div className="px-4 pb-4">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={mockHourlyStats.slice(4, 16)} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
                <XAxis dataKey="hour" tickFormatter={h => `${h}ч`} tick={{ fontSize: 10, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 10, fontSize: 12 }}
                  formatter={(v: number) => [v, 'заказов']}
                />
                <Bar dataKey="orders" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Active Shift */}
        <Card>
          <CardHeader title="Активная смена" subtitle={`${activeShifts.length} сотрудников`} action={
            <Button variant="ghost" size="sm" iconRight={<ChevronRight size={14} />} onClick={() => navigate('/app/shifts')}>
              Смены
            </Button>
          } />
          <div className="space-y-2.5">
            {activeShifts.slice(0, 4).map(shift => (
              <div key={shift.id} className="flex items-center gap-2.5">
                <Avatar name={shift.employeeName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">{shift.employeeName}</p>
                  <p className="text-xs text-stone-500">с {shift.actualStart ?? shift.startTime} · до {shift.endTime}</p>
                </div>
                <Badge variant="success" size="sm" dot>Работает</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Reservations */}
        <Card>
          <CardHeader title="Бронирования сегодня" subtitle={`${todayReservations.length} гостей`} action={
            <Button variant="ghost" size="sm" iconRight={<ChevronRight size={14} />} onClick={() => navigate('/app/floor')}>Все</Button>
          } />
          <div className="space-y-2.5">
            {todayReservations.length === 0 ? (
              <p className="text-stone-400 text-sm text-center py-4">Броней нет</p>
            ) : todayReservations.slice(0, 4).map(r => (
              <div key={r.id} className="flex items-start gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex flex-col items-center justify-center flex-shrink-0">
                  <p className="text-blue-700 font-bold text-sm leading-none">{r.time.split(':')[0]}</p>
                  <p className="text-blue-500 text-xs leading-none">{r.time.split(':')[1]}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">{r.guestName}</p>
                  <p className="text-xs text-stone-500">{r.guests} чел.{r.tableName ? ` · ${r.tableName}` : ''}</p>
                </div>
                <Badge variant={r.status === 'confirmed' ? 'success' : 'warning'} size="sm">
                  {r.status === 'confirmed' ? 'Подтв.' : 'Ожидает'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Популярные блюда" subtitle="За эту неделю" action={
            <Button variant="ghost" size="sm" iconRight={<ChevronRight size={14} />} onClick={() => navigate('/app/menu')}>Меню</Button>
          } />
          <div className="space-y-3">
            {mockTopDishes.slice(0, 5).map((dish, i) => (
              <div key={dish.name} className="flex items-center gap-3">
                <span className="w-6 text-center text-stone-400 text-xs font-medium">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-stone-800 truncate">{dish.name}</span>
                    <span className="text-xs text-stone-500 ml-2 flex-shrink-0">{dish.sales} шт.</span>
                  </div>
                  <div className="bg-stone-100 rounded-full h-1.5">
                    <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${(dish.sales / mockTopDishes[0].sales) * 100}%` }} />
                  </div>
                </div>
                <span className="text-xs font-semibold text-stone-700 flex-shrink-0">{formatCurrency(dish.revenue)}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Requires attention */}
        <Card>
          <CardHeader title="Требует внимания" subtitle={`${unreadNotifs.length} событий`} />
          {unreadNotifs.length === 0 ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-3">
                <CheckCircle size={22} className="text-teal-500" />
              </div>
              <p className="font-medium text-stone-700">Всё хорошо</p>
              <p className="text-stone-400 text-sm mt-1">Нет событий, требующих внимания</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {unreadNotifs.slice(0, 4).map(n => {
                const priorityColors = { high: 'bg-rose-50 border-rose-200', medium: 'bg-amber-50 border-amber-200', low: 'bg-stone-50 border-stone-200' };
                const iconColors = { high: 'text-rose-500', medium: 'text-amber-500', low: 'text-stone-400' };
                return (
                  <div key={n.id} className={`flex items-start gap-2.5 p-3 rounded-xl border ${priorityColors[n.priority]}`}>
                    <AlertCircle size={14} className={`flex-shrink-0 mt-0.5 ${iconColors[n.priority]}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-stone-800">{n.title}</p>
                      <p className="text-xs text-stone-500 mt-0.5 leading-snug">{n.message}</p>
                    </div>
                  </div>
                );
              })}
              <Button variant="outline" size="sm" fullWidth onClick={() => navigate('/app/notifications')}>
                Все уведомления
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

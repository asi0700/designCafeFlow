import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingBag, CreditCard } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Card, CardHeader } from '../../components/ui/Card';
import { mockDailyStats, mockHourlyStats, mockTopDishes, mockPaymentMethods } from '../../mock-data/reports';
import { mockEmployees } from '../../mock-data/employees';
import { mockShifts } from '../../mock-data/shifts';
import { formatCurrency } from '../../utils/formatters';

type Period = 'today' | 'week' | 'month' | '3month';

const periodLabels: Record<Period, string> = {
  today: 'Сегодня',
  week: 'Неделя',
  month: 'Месяц',
  '3month': '3 месяца',
};

const dayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const chartData = mockDailyStats.map((d, i) => ({ ...d, day: dayLabels[i] }));

const PIE_COLORS = ['#f59e0b', '#14b8a6', '#3b82f6'];

export function ReportsPage() {
  const [period, setPeriod] = useState<Period>('week');

  const currentStats = mockDailyStats[mockDailyStats.length - 1];
  const prevStats = mockDailyStats[mockDailyStats.length - 2];
  const totalRevenue = mockDailyStats.reduce((a, d) => a + d.revenue, 0);
  const totalOrders = mockDailyStats.reduce((a, d) => a + d.orders, 0);
  const totalGuests = mockDailyStats.reduce((a, d) => a + d.guests, 0);
  const avgCheck = Math.round(totalRevenue / totalOrders);

  const empStats = mockEmployees.filter(e => e.role !== 'owner').map(emp => {
    const completed = mockShifts.filter(s => s.employeeId === emp.id && (s.status === 'completed' || s.status === 'active'));
    return {
      name: emp.name.split(' ')[0],
      shifts: completed.length,
      earned: completed.reduce((a, s) => a + (s.earned ?? 0), 0),
    };
  }).filter(e => e.shifts > 0).sort((a, b) => b.earned - a.earned);

  const revenueChange = Math.round(((currentStats.revenue - prevStats.revenue) / prevStats.revenue) * 100);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Отчёты</h1>
          <p className="text-stone-500 text-sm mt-0.5">Аналитика бизнеса</p>
        </div>
        <div className="flex gap-1 bg-stone-100 p-1 rounded-xl">
          {(Object.entries(periodLabels) as [Period, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${period === key ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Выручка', value: formatCurrency(period === 'today' ? currentStats.revenue : totalRevenue), change: revenueChange, icon: DollarSign, color: 'text-amber-600 bg-amber-50' },
          { label: 'Заказов', value: String(period === 'today' ? currentStats.orders : totalOrders), change: 5, icon: ShoppingBag, color: 'text-teal-600 bg-teal-50' },
          { label: 'Гостей', value: String(period === 'today' ? currentStats.guests : totalGuests), change: 12, icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: 'Средний чек', value: formatCurrency(period === 'today' ? currentStats.avgCheck : avgCheck), change: -3, icon: CreditCard, color: 'text-stone-600 bg-stone-100' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-stone-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-stone-500 text-sm">{kpi.label}</p>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${kpi.color}`}><kpi.icon size={14} /></div>
            </div>
            <p className="text-xl font-bold text-stone-900">{kpi.value}</p>
            <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${kpi.change >= 0 ? 'text-teal-600' : 'text-rose-500'}`}>
              {kpi.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {kpi.change >= 0 ? '+' : ''}{kpi.change}% к прошлому периоду
            </div>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <Card padding="none">
        <div className="p-5 pb-0">
          <CardHeader title="Динамика продаж" subtitle="Выручка по дням" />
        </div>
        <div className="px-4 pb-4">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}к`} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, fontSize: 12 }}
                formatter={(v: number) => [formatCurrency(v), 'Выручка']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2.5} fill="url(#revAreaGrad)" dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Hourly + Top dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card padding="none">
          <div className="p-5 pb-0">
            <CardHeader title="Продажи по часам" subtitle="Заказов в час" />
          </div>
          <div className="px-4 pb-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mockHourlyStats} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
                <XAxis dataKey="hour" tickFormatter={h => `${h}ч`} tick={{ fontSize: 10, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 10, fontSize: 12 }} formatter={(v: number) => [v, 'заказов']} />
                <Bar dataKey="orders" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Популярные блюда" subtitle="Топ-8 за период" />
          <div className="space-y-2.5">
            {mockTopDishes.slice(0, 6).map((dish, i) => (
              <div key={dish.name} className="flex items-center gap-2.5">
                <span className="w-5 text-xs font-bold text-stone-400 flex-shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm text-stone-700 truncate">{dish.name}</span>
                    <span className="text-xs text-stone-500 ml-2 flex-shrink-0">{dish.sales} шт.</span>
                  </div>
                  <div className="bg-stone-100 rounded-full h-1.5">
                    <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${(dish.sales / mockTopDishes[0].sales) * 100}%` }} />
                  </div>
                </div>
                <span className="text-xs font-semibold text-stone-700 w-20 text-right flex-shrink-0">{formatCurrency(dish.revenue)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Payment methods + Team */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Способы оплаты" />
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={mockPaymentMethods} dataKey="amount" nameKey="method" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                    {mockPaymentMethods.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2.5">
              {mockPaymentMethods.map((pm, i) => (
                <div key={pm.method}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                      <span className="text-sm text-stone-700">{pm.method}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-stone-800">{pm.percent}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-500 pl-4">{formatCurrency(pm.amount)}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Эффективность команды" subtitle="По начислениям за период" />
          <div className="space-y-3">
            {empStats.slice(0, 5).map(emp => (
              <div key={emp.name} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {emp.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-stone-800">{emp.name}</span>
                    <span className="text-sm font-bold text-stone-800">{formatCurrency(emp.earned)}</span>
                  </div>
                  <div className="bg-stone-100 rounded-full h-1.5 mt-1">
                    <div className="bg-teal-400 h-1.5 rounded-full" style={{ width: `${(emp.earned / (empStats[0]?.earned ?? 1)) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

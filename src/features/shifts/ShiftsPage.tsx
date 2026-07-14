import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar, List, BarChart3, Clock, AlertCircle, Check, X } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { Card, CardHeader } from '../../components/ui/Card';
import { mockShifts } from '../../mock-data/shifts';
import { mockEmployees } from '../../mock-data/employees';
import { formatCurrency, getRoleLabel, getRoleColor } from '../../utils/formatters';
import { useAppToast } from '../../hooks/useToastContext';
import type { Shift } from '../../types';

type ShiftTab = 'schedule' | 'log' | 'stats';

const ROLE_COLORS: Record<string, string> = {
  owner: 'bg-amber-100 border-amber-300 text-amber-800',
  manager: 'bg-teal-100 border-teal-300 text-teal-800',
  cashier: 'bg-blue-100 border-blue-300 text-blue-800',
  waiter: 'bg-stone-100 border-stone-300 text-stone-700',
};

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-blue-50 text-blue-700',
  active: 'bg-teal-50 text-teal-700',
  completed: 'bg-stone-50 text-stone-600',
  cancelled: 'bg-stone-50 text-stone-400',
  no_show: 'bg-rose-50 text-rose-600',
};

const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Запланирована',
  active: 'Активна',
  completed: 'Завершена',
  cancelled: 'Отменена',
  no_show: 'Неявка',
};

export function ShiftsPage() {
  const { addToast } = useAppToast();
  const [tab, setTab] = useState<ShiftTab>('schedule');
  const [shifts, setShifts] = useState<Shift[]>(mockShifts);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [showForm, setShowForm] = useState(false);
  const [filterEmployee, setFilterEmployee] = useState('all');

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const filteredEmployees = mockEmployees.filter(e => e.role !== 'owner');
  const displayEmployees = filterEmployee === 'all' ? filteredEmployees : filteredEmployees.filter(e => e.id === filterEmployee);

  const getShiftsForDay = (empId: string, date: Date) =>
    shifts.filter(s => s.employeeId === empId && isSameDay(parseISO(s.date), date));

  const addShift = (data: { employeeId: string; date: string; startTime: string; endTime: string }) => {
    const emp = mockEmployees.find(e => e.id === data.employeeId)!;
    const newShift: Shift = {
      id: `sh-${Date.now()}`,
      employeeId: data.employeeId,
      employeeName: emp.name,
      role: emp.role,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      status: 'scheduled',
      hourlyRate: emp.hourlyRate,
    };
    setShifts(prev => [...prev, newShift]);
    addToast(`Смена добавлена: ${emp.name}`, 'success');
    setShowForm(false);
  };

  const deleteShift = (id: string) => {
    setShifts(prev => prev.filter(s => s.id !== id));
    addToast('Смена удалена', 'info');
  };

  const publishSchedule = () => {
    addToast('Расписание опубликовано — сотрудники получили уведомления', 'success');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Смены</h1>
          <p className="text-stone-500 text-sm mt-0.5">Расписание и учёт рабочего времени</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={publishSchedule}>Опубликовать</Button>
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setShowForm(true)}>Добавить смену</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl w-fit">
        {[
          { key: 'schedule', label: 'Расписание', icon: Calendar },
          { key: 'log', label: 'Журнал', icon: List },
          { key: 'stats', label: 'Статистика', icon: BarChart3 },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key as ShiftTab)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${tab === key ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      {tab === 'schedule' && (
        <ScheduleView
          weekDays={weekDays}
          weekStart={weekStart}
          employees={displayEmployees}
          allEmployees={filteredEmployees}
          filterEmployee={filterEmployee}
          onFilterChange={setFilterEmployee}
          getShiftsForDay={getShiftsForDay}
          onPrevWeek={() => setWeekStart(d => addDays(d, -7))}
          onNextWeek={() => setWeekStart(d => addDays(d, 7))}
          onDeleteShift={deleteShift}
        />
      )}

      {tab === 'log' && <ShiftLog shifts={shifts} />}
      {tab === 'stats' && <ShiftStats shifts={shifts} />}

      {/* Add shift modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Добавить смену" size="sm">
        <AddShiftForm employees={filteredEmployees} onSave={addShift} onCancel={() => setShowForm(false)} />
      </Modal>
    </div>
  );
}

function ScheduleView({ weekDays, weekStart, employees, allEmployees, filterEmployee, onFilterChange, getShiftsForDay, onPrevWeek, onNextWeek, onDeleteShift }: {
  weekDays: Date[];
  weekStart: Date;
  employees: typeof mockEmployees;
  allEmployees: typeof mockEmployees;
  filterEmployee: string;
  onFilterChange: (v: string) => void;
  getShiftsForDay: (empId: string, date: Date) => Shift[];
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onDeleteShift: (id: string) => void;
}) {
  const today = new Date();
  const weekRange = `${format(weekDays[0], 'd MMM', { locale: ru })} — ${format(weekDays[6], 'd MMM yyyy', { locale: ru })}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button onClick={onPrevWeek} className="p-2 rounded-xl hover:bg-stone-100 text-stone-600"><ChevronLeft size={16} /></button>
          <span className="font-semibold text-stone-800 text-sm">{weekRange}</span>
          <button onClick={onNextWeek} className="p-2 rounded-xl hover:bg-stone-100 text-stone-600"><ChevronRight size={16} /></button>
        </div>
        <select
          value={filterEmployee}
          onChange={e => onFilterChange(e.target.value)}
          className="border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
        >
          <option value="all">Все сотрудники</option>
          {allEmployees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 overflow-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-stone-100">
              <th className="text-left py-3 px-4 text-xs font-medium text-stone-400 w-36">Сотрудник</th>
              {weekDays.map(d => {
                const isToday = isSameDay(d, today);
                return (
                  <th key={d.toISOString()} className="py-3 px-2 text-center min-w-[90px]">
                    <p className={`text-xs font-medium ${isToday ? 'text-amber-600' : 'text-stone-400'}`}>{format(d, 'EEE', { locale: ru })}</p>
                    <p className={`text-sm font-bold ${isToday ? 'text-amber-600' : 'text-stone-800'}`}>{format(d, 'd')}</p>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} className="border-b border-stone-50 hover:bg-stone-50/50">
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-2">
                    <Avatar name={emp.name} size="xs" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-stone-800 truncate">{emp.name.split(' ')[0]}</p>
                      <p className={`text-xs px-1.5 py-0.5 rounded-full inline-block ${getRoleColor(emp.role)}`}>{getRoleLabel(emp.role)}</p>
                    </div>
                  </div>
                </td>
                {weekDays.map(d => {
                  const dayShifts = getShiftsForDay(emp.id, d);
                  return (
                    <td key={d.toISOString()} className="py-2 px-1.5 text-center">
                      {dayShifts.length === 0 ? (
                        <div className="h-8 rounded-lg border border-dashed border-stone-200 hover:border-amber-300 cursor-pointer hover:bg-amber-50 transition-colors" />
                      ) : (
                        dayShifts.map(shift => (
                          <div
                            key={shift.id}
                            className={`group rounded-lg px-1.5 py-1 text-xs font-medium border relative ${ROLE_COLORS[emp.role]} mb-1`}
                          >
                            <p className="truncate">{shift.startTime}–{shift.endTime}</p>
                            <p className={`text-xs ${STATUS_COLORS[shift.status]} px-1 rounded-full inline-block`}>{STATUS_LABELS[shift.status]}</p>
                            <button
                              className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-black/10 transition-opacity"
                              onClick={() => onDeleteShift(shift.id)}
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ShiftLog({ shifts }: { shifts: Shift[] }) {
  const sorted = [...shifts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="bg-white rounded-2xl border border-stone-100 overflow-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b border-stone-100">
            {['Сотрудник', 'Дата', 'Роль', 'Плановое', 'Фактическое', 'Длительность', 'Начислено', 'Статус'].map(h => (
              <th key={h} className="text-left py-3 px-4 text-xs font-medium text-stone-400 uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(shift => {
            const planned = shift.startTime && shift.endTime
              ? `${shift.startTime}–${shift.endTime}`
              : '—';
            const actual = shift.actualStart
              ? `${shift.actualStart}–${shift.actualEnd ?? '...'}`
              : '—';
            const late = shift.actualStart && shift.startTime && shift.actualStart > shift.startTime;
            return (
              <tr key={shift.id} className="border-b border-stone-50 hover:bg-stone-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Avatar name={shift.employeeName} size="xs" />
                    <span className="text-sm font-medium text-stone-800">{shift.employeeName}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-stone-600">{format(parseISO(shift.date), 'd MMM', { locale: ru })}</td>
                <td className="py-3 px-4"><span className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(shift.role)}`}>{getRoleLabel(shift.role)}</span></td>
                <td className="py-3 px-4 text-sm text-stone-600">{planned}</td>
                <td className="py-3 px-4 text-sm">
                  <span className={late ? 'text-rose-600' : 'text-stone-600'}>{actual}</span>
                  {late && <span className="ml-1 text-xs text-rose-500">(опоздание)</span>}
                </td>
                <td className="py-3 px-4 text-sm text-stone-600">
                  {shift.actualStart && shift.actualEnd ? '12 ч' : shift.status === 'active' ? '...' : '—'}
                </td>
                <td className="py-3 px-4 text-sm font-semibold text-stone-800">{shift.earned ? formatCurrency(shift.earned) : '—'}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[shift.status]}`}>{STATUS_LABELS[shift.status]}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ShiftStats({ shifts }: { shifts: Shift[] }) {
  const completed = shifts.filter(s => s.status === 'completed' || s.status === 'active');
  const totalEarned = completed.reduce((a, s) => a + (s.earned ?? 0), 0);
  const totalShifts = completed.length;
  const lateShifts = shifts.filter(s => s.actualStart && s.startTime && s.actualStart > s.startTime).length;
  const noShows = shifts.filter(s => s.status === 'no_show').length;

  const byEmployee = mockEmployees.filter(e => e.role !== 'owner').map(emp => {
    const empShifts = completed.filter(s => s.employeeId === emp.id);
    return {
      emp,
      shifts: empShifts.length,
      earned: empShifts.reduce((a, s) => a + (s.earned ?? 0), 0),
      late: shifts.filter(s => s.employeeId === emp.id && s.actualStart && s.startTime && s.actualStart > s.startTime).length,
    };
  }).filter(r => r.shifts > 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Начислено', value: formatCurrency(totalEarned), icon: '💰' },
          { label: 'Смен', value: String(totalShifts), icon: '📋' },
          { label: 'Опозданий', value: String(lateShifts), icon: '⏰' },
          { label: 'Неявок', value: String(noShows), icon: '❌' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-stone-100 p-4">
            <span className="text-2xl">{s.icon}</span>
            <p className="text-2xl font-bold text-stone-900 mt-1">{s.value}</p>
            <p className="text-sm text-stone-500">{s.label}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader title="Эффективность команды" subtitle="По отработанным сменам" />
        <div className="space-y-3">
          {byEmployee.sort((a, b) => b.earned - a.earned).map(({ emp, shifts, earned, late }) => (
            <div key={emp.id} className="flex items-center gap-3">
              <Avatar name={emp.name} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-medium text-stone-800">{emp.name}</span>
                  <span className="text-sm font-bold text-stone-800">{formatCurrency(earned)}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <span>{shifts} смен</span>
                  {late > 0 && <span className="text-rose-500">{late} опозданий</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AddShiftForm({ employees, onSave, onCancel }: {
  employees: typeof mockEmployees;
  onSave: (data: { employeeId: string; date: string; startTime: string; endTime: string }) => void;
  onCancel: () => void;
}) {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({ employeeId: employees[0]?.id ?? '', date: today, startTime: '10:00', endTime: '22:00' });

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <Select
        label="Сотрудник"
        value={form.employeeId}
        onChange={e => setForm(f => ({ ...f, employeeId: e.target.value }))}
        options={employees.map(e => ({ value: e.id, label: `${e.name} (${getRoleLabel(e.role)})` }))}
      />
      <Input label="Дата" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Начало" type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} required />
        <Input label="Конец" type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} required />
      </div>
      <div className="flex gap-2 pt-1">
        <Button type="button" variant="outline" fullWidth onClick={onCancel}>Отмена</Button>
        <Button type="submit" variant="primary" fullWidth>Добавить</Button>
      </div>
    </form>
  );
}

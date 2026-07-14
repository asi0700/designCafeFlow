import React, { useState } from 'react';
import { Search, Plus, Filter, Phone, Mail, Edit2, Trash2, ChevronRight, Shield, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { ConfirmDialog } from '../../components/ui/EmptyState';
import { Card, CardHeader } from '../../components/ui/Card';
import { mockEmployees } from '../../mock-data/employees';
import { mockShifts } from '../../mock-data/shifts';
import { getRoleLabel, getRoleColor, formatCurrency } from '../../utils/formatters';
import { useAppToast } from '../../hooks/useToastContext';
import type { User, UserRole } from '../../types';

const roleOptions = [
  { value: 'all', label: 'Все роли' },
  { value: 'manager', label: 'Менеджер' },
  { value: 'cashier', label: 'Кассир' },
  { value: 'waiter', label: 'Официант' },
];

const statusOptions = [
  { value: 'all', label: 'Все статусы' },
  { value: 'active', label: 'Активны' },
  { value: 'on_break', label: 'На перерыве' },
  { value: 'inactive', label: 'Неактивны' },
];

const statusConfig = {
  active: { label: 'Активен', variant: 'success' as const, dot: 'bg-teal-500' },
  on_break: { label: 'Перерыв', variant: 'warning' as const, dot: 'bg-amber-500' },
  inactive: { label: 'Неактивен', variant: 'default' as const, dot: 'bg-stone-400' },
};

export function EmployeesPage() {
  const { addToast } = useAppToast();
  const [employees, setEmployees] = useState<User[]>(mockEmployees.filter(e => e.role !== 'owner'));
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editEmp, setEditEmp] = useState<User | null>(null);
  const [profileEmp, setProfileEmp] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = employees.filter(e => {
    const searchMatch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase());
    const roleMatch = roleFilter === 'all' || e.role === roleFilter;
    const statusMatch = statusFilter === 'all' || e.status === statusFilter;
    return searchMatch && roleMatch && statusMatch;
  });

  const saveEmployee = (data: Partial<User>) => {
    if (editEmp) {
      setEmployees(prev => prev.map(e => e.id === editEmp.id ? { ...e, ...data } : e));
      addToast('Данные сотрудника обновлены', 'success');
    } else {
      const newEmp: User = {
        id: `emp-${Date.now()}`,
        name: data.name ?? '',
        role: (data.role as UserRole) ?? 'waiter',
        email: data.email ?? '',
        phone: data.phone,
        hourlyRate: data.hourlyRate ?? 200,
        status: 'active',
        hireDate: new Date().toISOString().split('T')[0],
        permissions: [],
        ...data,
      };
      setEmployees(prev => [...prev, newEmp]);
      addToast(`${newEmp.name} добавлен`, 'success');
    }
    setShowForm(false);
    setEditEmp(null);
  };

  const deleteEmployee = (id: string) => {
    const emp = employees.find(e => e.id === id)!;
    setEmployees(prev => prev.filter(e => e.id !== id));
    setDeleteId(null);
    addToast(`${emp.name} удалён`, 'info');
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Команда</h1>
          <p className="text-stone-500 text-sm mt-0.5">{employees.length} сотрудников</p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => { setEditEmp(null); setShowForm(true); }}>
          Добавить сотрудника
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            className="w-full border border-stone-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            placeholder="Поиск по имени или email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white">
          {roleOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white">
          {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Employee list */}
      <div className="space-y-2">
        {filtered.map(emp => {
          const sc = statusConfig[emp.status] ?? statusConfig.inactive;
          const empShifts = mockShifts.filter(s => s.employeeId === emp.id && (s.status === 'completed' || s.status === 'active'));
          const totalEarned = empShifts.reduce((a, s) => a + (s.earned ?? 0), 0);

          return (
            <div key={emp.id} className="bg-white rounded-2xl border border-stone-100 p-4 hover:border-stone-200 transition-all hover:shadow-sm">
              <div className="flex items-center gap-3">
                <button onClick={() => setProfileEmp(emp)} className="flex-shrink-0">
                  <Avatar name={emp.name} size="md" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => setProfileEmp(emp)} className="font-semibold text-stone-900 hover:text-amber-600 transition-colors">{emp.name}</button>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRoleColor(emp.role)}`}>{getRoleLabel(emp.role)}</span>
                    <Badge variant={sc.variant} size="sm" dot>{sc.label}</Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-stone-500 flex-wrap">
                    <span className="flex items-center gap-1"><Mail size={10} />{emp.email}</span>
                    {emp.phone && <span className="flex items-center gap-1"><Phone size={10} />{emp.phone}</span>}
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-6 flex-shrink-0 text-center">
                  <div>
                    <p className="text-sm font-bold text-stone-800">{formatCurrency(emp.hourlyRate)}/ч</p>
                    <p className="text-xs text-stone-400">Ставка</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-800">{empShifts.length}</p>
                    <p className="text-xs text-stone-400">Смен</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-800">{formatCurrency(totalEarned)}</p>
                    <p className="text-xs text-stone-400">Начислено</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => { setEditEmp(emp); setShowForm(true); }}
                    className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteId(emp.id)}
                    className="p-2 rounded-xl hover:bg-rose-50 text-stone-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button onClick={() => setProfileEmp(emp)} className="p-2 rounded-xl hover:bg-stone-100 text-stone-400">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form Modal */}
      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditEmp(null); }} title={editEmp ? 'Редактировать сотрудника' : 'Новый сотрудник'} size="sm">
        <EmployeeForm employee={editEmp} onSave={saveEmployee} onCancel={() => { setShowForm(false); setEditEmp(null); }} />
      </Modal>

      {/* Profile Modal */}
      <Modal isOpen={!!profileEmp} onClose={() => setProfileEmp(null)} title="Профиль сотрудника" size="lg">
        {profileEmp && <EmployeeProfile employee={profileEmp} onEdit={() => { setEditEmp(profileEmp); setShowForm(true); setProfileEmp(null); }} />}
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Удалить сотрудника?"
        message="Все данные сотрудника будут удалены. Это действие нельзя отменить."
        onConfirm={() => deleteEmployee(deleteId!)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

function EmployeeProfile({ employee, onEdit }: { employee: User; onEdit: () => void }) {
  const empShifts = mockShifts.filter(s => s.employeeId === employee.id);
  const completedShifts = empShifts.filter(s => s.status === 'completed');
  const totalEarned = empShifts.reduce((a, s) => a + (s.earned ?? 0), 0);
  const lateCount = empShifts.filter(s => s.actualStart && s.startTime && s.actualStart > s.startTime).length;
  const sc = statusConfig[employee.status] ?? statusConfig.inactive;

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-4">
        <Avatar name={employee.name} size="xl" />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xl font-bold text-stone-900">{employee.name}</h3>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getRoleColor(employee.role)}`}>{getRoleLabel(employee.role)}</span>
          </div>
          <p className="text-stone-500 mt-0.5">{employee.email}</p>
          {employee.phone && <p className="text-stone-500 text-sm">{employee.phone}</p>}
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={sc.variant} dot>{sc.label}</Badge>
            <Button variant="outline" size="sm" icon={<Edit2 size={12} />} onClick={onEdit}>Редактировать</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Ставка', value: `${formatCurrency(employee.hourlyRate)}/ч` },
          { label: 'Начислено', value: formatCurrency(totalEarned) },
          { label: 'Смен', value: String(completedShifts.length) },
          { label: 'Опозданий', value: String(lateCount) },
        ].map(s => (
          <div key={s.label} className="bg-stone-50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-stone-900">{s.value}</p>
            <p className="text-xs text-stone-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h4 className="font-medium text-stone-700 mb-2 text-sm">Последние смены</h4>
        <div className="space-y-2">
          {empShifts.slice(0, 5).map(s => (
            <div key={s.id} className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 text-sm">
              <div>
                <span className="font-medium text-stone-800">{s.date}</span>
                <span className="text-stone-500 ml-2">{s.startTime}–{s.endTime}</span>
              </div>
              <div className="flex items-center gap-2">
                {s.earned && <span className="font-medium text-stone-700">{formatCurrency(s.earned)}</span>}
                <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === 'completed' ? 'bg-teal-50 text-teal-700' : s.status === 'active' ? 'bg-amber-50 text-amber-700' : 'bg-stone-100 text-stone-500'}`}>
                  {s.status === 'completed' ? 'Завершена' : s.status === 'active' ? 'Активна' : 'Запланирована'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmployeeForm({ employee, onSave, onCancel }: { employee: User | null; onSave: (d: Partial<User>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    name: employee?.name ?? '',
    role: (employee?.role ?? 'waiter') as UserRole,
    email: employee?.email ?? '',
    phone: employee?.phone ?? '',
    hourlyRate: employee?.hourlyRate ?? 200,
  });

  return (
    <form onSubmit={e => { e.preventDefault(); onSave({ ...form, hourlyRate: Number(form.hourlyRate) }); }} className="space-y-3">
      <Input label="Имя" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Иван Иванов" required />
      <Select
        label="Роль"
        value={form.role}
        onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))}
        options={[
          { value: 'manager', label: 'Менеджер' },
          { value: 'cashier', label: 'Кассир' },
          { value: 'waiter', label: 'Официант' },
        ]}
      />
      <Input label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="ivan@example.com" required />
      <Input label="Телефон" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+7 (900) 000-00-00" />
      <Input label="Ставка (₽/ч)" type="number" min={0} value={form.hourlyRate} onChange={e => setForm(f => ({ ...f, hourlyRate: Number(e.target.value) }))} />
      <div className="flex gap-2 pt-1">
        <Button type="button" variant="outline" fullWidth onClick={onCancel}>Отмена</Button>
        <Button type="submit" variant="primary" fullWidth>Сохранить</Button>
      </div>
    </form>
  );
}

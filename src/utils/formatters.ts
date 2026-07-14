export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(amount);
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

export function formatDuration(startIso: string, endIso?: string): string {
  const start = new Date(startIso);
  const end = endIso ? new Date(endIso) : new Date();
  const diff = Math.floor((end.getTime() - start.getTime()) / 60000);
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return h > 0 ? `${h} ч ${m} мин` : `${m} мин`;
}

export function formatTimeOnly(time: string): string {
  return time;
}

export function minutesSince(time: string): number {
  const [h, m] = time.split(':').map(Number);
  const now = new Date();
  return (now.getHours() - h) * 60 + (now.getMinutes() - m);
}

export function clsx(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    owner: 'Владелец',
    manager: 'Менеджер',
    cashier: 'Кассир',
    waiter: 'Официант',
  };
  return labels[role] ?? role;
}

export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    owner: 'bg-amber-100 text-amber-800',
    manager: 'bg-teal-100 text-teal-800',
    cashier: 'bg-blue-100 text-blue-800',
    waiter: 'bg-stone-100 text-stone-700',
  };
  return colors[role] ?? 'bg-stone-100 text-stone-700';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    free: 'Свободен',
    reserved: 'Забронирован',
    waiting: 'Ожидает гостя',
    occupied: 'Занят',
    waiting_payment: 'Ожидает оплату',
    needs_cleaning: 'Нужна уборка',
    scheduled: 'Запланирована',
    active: 'Активна',
    completed: 'Завершена',
    cancelled: 'Отменена',
    no_show: 'Неявка',
    confirmed: 'Подтверждена',
    pending: 'Ожидает',
    open: 'Открыт',
    cooking: 'Готовится',
    ready: 'Готово',
    closed: 'Закрыт',
  };
  return labels[status] ?? status;
}

export function getTableStatusColor(status: string): string {
  const colors: Record<string, string> = {
    free: 'bg-teal-50 border-teal-200 text-teal-700',
    reserved: 'bg-blue-50 border-blue-200 text-blue-700',
    waiting: 'bg-amber-50 border-amber-200 text-amber-700',
    occupied: 'bg-amber-100 border-amber-300 text-amber-800',
    waiting_payment: 'bg-orange-50 border-orange-300 text-orange-700',
    needs_cleaning: 'bg-rose-50 border-rose-200 text-rose-600',
  };
  return colors[status] ?? 'bg-stone-50 border-stone-200 text-stone-600';
}

export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + '...' : str;
}

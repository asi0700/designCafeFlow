import type { Shift } from '../types';

const today = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];

const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

export const mockShifts: Shift[] = [
  // Today
  {
    id: 'sh-1', employeeId: 'emp-2', employeeName: 'Марина Козлова', role: 'manager',
    date: fmt(today), startTime: '09:00', endTime: '21:00',
    actualStart: '09:02', status: 'active',
    hourlyRate: 350, earned: 1400,
  },
  {
    id: 'sh-2', employeeId: 'emp-3', employeeName: 'Дмитрий Волков', role: 'waiter',
    date: fmt(today), startTime: '10:00', endTime: '22:00',
    actualStart: '10:05', status: 'active',
    hourlyRate: 200, earned: 800,
  },
  {
    id: 'sh-3', employeeId: 'emp-4', employeeName: 'Екатерина Смирнова', role: 'waiter',
    date: fmt(today), startTime: '10:00', endTime: '22:00',
    actualStart: '10:00', status: 'active',
    hourlyRate: 200, earned: 800,
  },
  {
    id: 'sh-4', employeeId: 'emp-5', employeeName: 'Иван Петров', role: 'cashier',
    date: fmt(today), startTime: '09:00', endTime: '21:00',
    actualStart: '09:00', status: 'active',
    hourlyRate: 250, earned: 1000,
  },
  {
    id: 'sh-5', employeeId: 'emp-6', employeeName: 'Ольга Нечаева', role: 'waiter',
    date: fmt(today), startTime: '14:00', endTime: '23:00',
    status: 'scheduled',
    hourlyRate: 200,
  },
  // Yesterday
  {
    id: 'sh-6', employeeId: 'emp-3', employeeName: 'Дмитрий Волков', role: 'waiter',
    date: fmt(addDays(today, -1)), startTime: '10:00', endTime: '22:00',
    actualStart: '10:00', actualEnd: '22:05', status: 'completed',
    hourlyRate: 200, earned: 2400,
  },
  {
    id: 'sh-7', employeeId: 'emp-4', employeeName: 'Екатерина Смирнова', role: 'waiter',
    date: fmt(addDays(today, -1)), startTime: '10:00', endTime: '22:00',
    actualStart: '10:15', actualEnd: '22:00', status: 'completed',
    hourlyRate: 200, earned: 2400, notes: 'Опоздание 15 мин',
  },
  {
    id: 'sh-8', employeeId: 'emp-2', employeeName: 'Марина Козлова', role: 'manager',
    date: fmt(addDays(today, -1)), startTime: '09:00', endTime: '21:00',
    actualStart: '09:00', actualEnd: '21:10', status: 'completed',
    hourlyRate: 350, earned: 4200,
  },
  // Day after tomorrow
  {
    id: 'sh-9', employeeId: 'emp-3', employeeName: 'Дмитрий Волков', role: 'waiter',
    date: fmt(addDays(today, 2)), startTime: '10:00', endTime: '22:00',
    status: 'scheduled', hourlyRate: 200,
  },
  {
    id: 'sh-10', employeeId: 'emp-6', employeeName: 'Ольга Нечаева', role: 'waiter',
    date: fmt(addDays(today, 2)), startTime: '10:00', endTime: '22:00',
    status: 'scheduled', hourlyRate: 200,
  },
  {
    id: 'sh-11', employeeId: 'emp-5', employeeName: 'Иван Петров', role: 'cashier',
    date: fmt(addDays(today, 1)), startTime: '09:00', endTime: '21:00',
    status: 'scheduled', hourlyRate: 250,
  },
  {
    id: 'sh-12', employeeId: 'emp-2', employeeName: 'Марина Козлова', role: 'manager',
    date: fmt(addDays(today, 1)), startTime: '09:00', endTime: '21:00',
    status: 'scheduled', hourlyRate: 350,
  },
  {
    id: 'sh-13', employeeId: 'emp-7', employeeName: 'Сергей Тихонов', role: 'waiter',
    date: fmt(addDays(today, -2)), startTime: '14:00', endTime: '23:00',
    actualStart: '14:20', status: 'no_show',
    hourlyRate: 200, notes: 'Неявка без предупреждения',
  },
  {
    id: 'sh-14', employeeId: 'emp-4', employeeName: 'Екатерина Смирнова', role: 'waiter',
    date: fmt(addDays(today, 3)), startTime: '10:00', endTime: '22:00',
    status: 'scheduled', hourlyRate: 200,
  },
  {
    id: 'sh-15', employeeId: 'emp-3', employeeName: 'Дмитрий Волков', role: 'waiter',
    date: fmt(addDays(today, -2)), startTime: '10:00', endTime: '22:00',
    actualStart: '10:00', actualEnd: '22:00', status: 'completed',
    hourlyRate: 200, earned: 2400,
  },
];

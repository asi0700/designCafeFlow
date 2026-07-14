import React, { useState, useEffect } from 'react';
import { Clock, Play, Square, TrendingUp, Calendar, ChevronRight, DollarSign, Coffee } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { mockShifts } from '../../mock-data/shifts';
import { mockEmployees } from '../../mock-data/employees';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formatters';
import { useAppToast } from '../../hooks/useToastContext';

function useTimer(isActive: boolean, startTime: number | null) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!isActive || !startTime) { setElapsed(0); return; }
    const interval = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(interval);
  }, [isActive, startTime]);
  return elapsed;
}

function formatElapsed(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function MyShiftPage() {
  const { currentUser } = useAuth();
  const { addToast } = useAppToast();
  const [shiftActive, setShiftActive] = useState(false);
  const [shiftStartTime, setShiftStartTime] = useState<number | null>(null);
  const [shiftCompleted, setShiftCompleted] = useState(false);
  const [shiftEnd, setShiftEnd] = useState<number | null>(null);
  const elapsed = useTimer(shiftActive, shiftStartTime);

  if (!currentUser) return null;

  const myShifts = mockShifts.filter(s => s.employeeId === currentUser.id);
  const todayShift = myShifts.find(s => s.date === new Date().toISOString().split('T')[0] && (s.status === 'active' || s.status === 'scheduled'));
  const completedShifts = myShifts.filter(s => s.status === 'completed');
  const monthEarned = completedShifts.reduce((a, s) => a + (s.earned ?? 0), 0);

  const startShift = () => {
    const now = Date.now();
    setShiftStartTime(now);
    setShiftActive(true);
    setShiftCompleted(false);
    addToast('Смена начата — удачной работы!', 'success');
  };

  const endShift = () => {
    setShiftEnd(Date.now());
    setShiftActive(false);
    setShiftCompleted(true);
    const earned = Math.round((elapsed / 3600) * currentUser.hourlyRate);
    addToast(`Смена завершена! Начислено: ${formatCurrency(earned)}`, 'success');
  };

  const earnedSoFar = shiftActive ? Math.round((elapsed / 3600) * currentUser.hourlyRate) : 0;
  const totalElapsed = shiftCompleted && shiftStartTime && shiftEnd ? Math.floor((shiftEnd - shiftStartTime) / 1000) : elapsed;

  return (
    <div className="p-4 sm:p-6 max-w-lg mx-auto space-y-4">
      {/* Greeting */}
      <div className="flex items-center gap-3 mb-2">
        <Avatar name={currentUser.name} size="lg" />
        <div>
          <h1 className="text-xl font-bold text-stone-900">Привет, {currentUser.name.split(' ')[0]}!</h1>
          <p className="text-stone-500 text-sm">{new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
      </div>

      {/* Current shift block */}
      {!shiftActive && !shiftCompleted ? (
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-3xl p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-200">
            <Coffee size={28} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-amber-900 mb-1">
            {todayShift ? 'Смена ожидает' : 'Смена не запланирована'}
          </h2>
          {todayShift && (
            <p className="text-amber-700 mb-4">{todayShift.startTime} — {todayShift.endTime}</p>
          )}
          <p className="text-amber-600 text-sm mb-6">
            {todayShift ? 'Готов начать? Нажми кнопку ниже.' : 'Свяжитесь с менеджером для уточнения расписания.'}
          </p>
          <Button variant="primary" size="lg" icon={<Play size={18} />} fullWidth onClick={startShift}
            className="bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-200">
            Начать смену
          </Button>
        </div>
      ) : shiftActive ? (
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl p-6 text-white text-center shadow-xl shadow-teal-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
            <span className="text-teal-100 font-medium">Смена идёт</span>
          </div>
          <p className="text-6xl font-bold tracking-tight mb-1 font-mono">{formatElapsed(elapsed)}</p>
          <p className="text-teal-100 text-sm mb-2">началась в {new Date(shiftStartTime!).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</p>
          <div className="bg-white/20 rounded-2xl p-3 mb-5">
            <p className="text-white text-sm">Заработано за смену</p>
            <p className="text-white text-2xl font-bold">{formatCurrency(earnedSoFar)}</p>
          </div>
          <Button variant="secondary" size="lg" icon={<Square size={16} />} fullWidth onClick={endShift}
            className="bg-white text-teal-700 hover:bg-teal-50 shadow-lg">
            Завершить смену
          </Button>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-stone-50 to-stone-100 border border-stone-200 rounded-3xl p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center mx-auto mb-3">
            <Clock size={24} className="text-teal-600" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-1">Смена завершена!</h2>
          <p className="text-stone-500 text-sm mb-3">
            Отработано: {formatElapsed(totalElapsed)}
          </p>
          <div className="bg-white rounded-2xl p-3 border border-stone-100 mb-4">
            <p className="text-stone-500 text-sm">Начислено за смену</p>
            <p className="text-amber-600 text-2xl font-bold">{formatCurrency(Math.round((totalElapsed / 3600) * currentUser.hourlyRate))}</p>
          </div>
          <Button variant="outline" size="sm" fullWidth onClick={() => setShiftCompleted(false)}>
            Посмотреть итоги
          </Button>
        </div>
      )}

      {/* This month */}
      <Card>
        <CardHeader title="Этот месяц" subtitle="Январь 2024" />
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Начислено', value: formatCurrency(monthEarned + earnedSoFar), icon: '💰', highlight: true },
            { label: 'Смен', value: String(completedShifts.length + (shiftActive ? 1 : 0)), icon: '📋' },
            { label: 'Отработано', value: `${completedShifts.length * 12}ч`, icon: '⏱️' },
            { label: 'Ставка', value: `${formatCurrency(currentUser.hourlyRate)}/ч`, icon: '📈' },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl p-3 ${s.highlight ? 'bg-amber-50 border border-amber-100' : 'bg-stone-50'}`}>
              <span className="text-xl">{s.icon}</span>
              <p className={`text-lg font-bold mt-1 ${s.highlight ? 'text-amber-700' : 'text-stone-800'}`}>{s.value}</p>
              <p className="text-xs text-stone-500">{s.label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Upcoming shifts */}
      <Card>
        <CardHeader title="Ближайшие смены" />
        <div className="space-y-2">
          {myShifts.filter(s => s.status === 'scheduled').slice(0, 4).map(s => (
            <div key={s.id} className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50">
              <div>
                <p className="text-sm font-medium text-stone-800">{s.date}</p>
                <p className="text-xs text-stone-500">{s.startTime} — {s.endTime}</p>
              </div>
              <Badge variant="info" size="sm">Запланирована</Badge>
            </div>
          ))}
          {myShifts.filter(s => s.status === 'scheduled').length === 0 && (
            <p className="text-stone-400 text-sm text-center py-3">Ближайших смен нет</p>
          )}
        </div>
      </Card>
    </div>
  );
}

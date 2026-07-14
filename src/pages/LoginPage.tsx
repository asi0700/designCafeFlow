import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types';
import { Button } from '../components/ui/Button';

const roles: { role: UserRole; label: string; description: string; color: string; emoji: string }[] = [
  {
    role: 'owner', label: 'Владелец', emoji: '👑',
    description: 'Полный доступ: аналитика, команда, настройки',
    color: 'border-amber-300 bg-amber-50 hover:border-amber-500 hover:bg-amber-100',
  },
  {
    role: 'manager', label: 'Менеджер', emoji: '📋',
    description: 'Смены, расписание, карта зала, меню',
    color: 'border-teal-300 bg-teal-50 hover:border-teal-500 hover:bg-teal-100',
  },
  {
    role: 'cashier', label: 'Кассир', emoji: '💳',
    description: 'Оплаты, заказы, кассовые операции',
    color: 'border-blue-300 bg-blue-50 hover:border-blue-500 hover:bg-blue-100',
  },
  {
    role: 'waiter', label: 'Официант', emoji: '🍽️',
    description: 'Мои столы, заказы, текущая смена',
    color: 'border-stone-300 bg-stone-50 hover:border-stone-500 hover:bg-stone-100',
  },
];

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('owner');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      login(selectedRole);
      const isEmployee = selectedRole === 'waiter' || selectedRole === 'cashier';
      navigate(isEmployee ? '/app/my-shift' : '/app/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-teal-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-200">
              <Coffee size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-stone-900">CafeFlow</span>
          </div>
          <p className="text-stone-600">Система управления кафе</p>
        </div>

        <div className="bg-white rounded-3xl border border-stone-100 shadow-xl p-6">
          {/* Demo notice */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
            <Sparkles size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Демо-режим</p>
              <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">Выберите роль и исследуйте все возможности CafeFlow. Данные демонстрационные.</p>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-stone-900 mb-1">Выберите роль</h2>
          <p className="text-sm text-stone-500 mb-4">Каждая роль открывает свой интерфейс</p>

          <div className="space-y-2.5 mb-6">
            {roles.map(r => (
              <button
                key={r.role}
                onClick={() => setSelectedRole(r.role)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 ${selectedRole === r.role ? r.color : 'border-stone-100 bg-stone-50 hover:border-stone-200'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{r.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900 text-sm">{r.label}</span>
                      {selectedRole === r.role && (
                        <CheckCircle size={14} className="text-amber-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5 leading-snug">{r.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            iconRight={!loading ? <ArrowRight size={18} /> : undefined}
            onClick={handleLogin}
          >
            Войти в демо
          </Button>

          <p className="text-center text-xs text-stone-400 mt-4">
            Нет регистрации, нет платёжных данных
          </p>
        </div>

        <p className="text-center mt-6">
          <button onClick={() => navigate('/')} className="text-sm text-stone-500 hover:text-stone-700 transition-colors">
            ← Вернуться на сайт
          </button>
        </p>
      </div>
    </div>
  );
}

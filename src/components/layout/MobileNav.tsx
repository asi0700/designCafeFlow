import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, UtensilsCrossed, Calendar, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const ownerNav = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Обзор' },
  { to: '/app/floor', icon: Map, label: 'Зал' },
  { to: '/app/menu', icon: UtensilsCrossed, label: 'Меню' },
  { to: '/app/shifts', icon: Calendar, label: 'Смены' },
  { to: '/app/reports', icon: BarChart3, label: 'Отчёты' },
];

const employeeNav = [
  { to: '/app/my-shift', icon: Calendar, label: 'Смена' },
  { to: '/app/my-tables', icon: Map, label: 'Столы' },
  { to: '/app/employees', icon: Users, label: 'Команда' },
];

export function MobileNav() {
  const { currentUser } = useAuth();
  const isEmployee = currentUser?.role === 'waiter' || currentUser?.role === 'cashier';
  const items = isEmployee ? employeeNav : ownerNav;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 md:hidden safe-area-bottom">
      <div className="flex items-stretch">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-xs font-medium transition-colors ${isActive ? 'text-amber-600' : 'text-stone-500'}`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-amber-50' : ''}`}>
                  <Icon size={20} />
                </div>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

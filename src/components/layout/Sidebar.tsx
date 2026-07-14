import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Map, UtensilsCrossed, Calendar, Users, BarChart3,
  Bell, Settings, ChevronLeft, ChevronRight, LogOut, ChevronDown, Coffee, Search,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { getRoleLabel } from '../../utils/formatters';
import { mockNotifications } from '../../mock-data/notifications';
import type { UserRole } from '../../types';

const navItems = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Обзор' },
  { to: '/app/floor', icon: Map, label: 'Карта зала' },
  { to: '/app/menu', icon: UtensilsCrossed, label: 'Меню' },
  { to: '/app/shifts', icon: Calendar, label: 'Смены' },
  { to: '/app/employees', icon: Users, label: 'Сотрудники' },
  { to: '/app/reports', icon: BarChart3, label: 'Отчёты' },
  { to: '/app/notifications', icon: Bell, label: 'Уведомления' },
  { to: '/app/settings', icon: Settings, label: 'Настройки' },
];

const employeeNavItems = [
  { to: '/app/my-shift', icon: Calendar, label: 'Моя смена' },
  { to: '/app/my-tables', icon: Map, label: 'Мои столы' },
  { to: '/app/notifications', icon: Bell, label: 'Уведомления' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { currentUser, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  const isEmployee = currentUser?.role === 'waiter' || currentUser?.role === 'cashier';
  const items = isEmployee ? employeeNavItems : navItems;

  const roles: { role: UserRole; label: string }[] = [
    { role: 'owner', label: 'Владелец' },
    { role: 'manager', label: 'Менеджер' },
    { role: 'cashier', label: 'Кассир' },
    { role: 'waiter', label: 'Официант' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={`flex flex-col bg-stone-900 text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'} flex-shrink-0 relative h-screen sticky top-0`}>
      <div className={`flex items-center gap-2.5 px-4 py-5 border-b border-stone-800 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
          <Coffee size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-bold text-white text-sm leading-tight">CafeFlow</p>
            <p className="text-stone-400 text-xs">Demo Mode</p>
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="px-3 py-3 border-b border-stone-800">
          <button
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-sm text-stone-300 transition-colors"
            onClick={() => {}}
          >
            <Search size={14} />
            <span>Поиск...</span>
            <span className="ml-auto text-xs text-stone-500">⌘K</span>
          </button>
        </div>
      )}

      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                isActive
                  ? 'bg-amber-500 text-white'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span className="flex-1">{label}</span>}
            {!collapsed && label === 'Уведомления' && unreadCount > 0 && (
              <span className="bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {unreadCount}
              </span>
            )}
            {collapsed && label === 'Уведомления' && unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-2 py-3 border-t border-stone-800 space-y-1">
        {!collapsed && currentUser && (
          <div className="relative">
            <button
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-stone-800 transition-colors group"
              onClick={() => setShowRoleMenu(v => !v)}
            >
              <Avatar name={currentUser.name} size="sm" />
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
                <p className="text-xs text-stone-400">{getRoleLabel(currentUser.role)}</p>
              </div>
              <ChevronDown size={14} className={`text-stone-400 transition-transform ${showRoleMenu ? 'rotate-180' : ''}`} />
            </button>
            {showRoleMenu && (
              <div className="absolute bottom-full left-0 w-full mb-1 bg-stone-800 rounded-xl border border-stone-700 overflow-hidden z-10 animate-scale-in">
                <p className="text-xs text-stone-400 px-3 py-2 border-b border-stone-700">Сменить роль</p>
                {roles.map(r => (
                  <button
                    key={r.role}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${currentUser.role === r.role ? 'text-amber-400 bg-stone-700' : 'text-stone-300 hover:bg-stone-700'}`}
                    onClick={() => { switchRole(r.role); setShowRoleMenu(false); navigate('/app/dashboard'); }}
                  >
                    {r.label}
                  </button>
                ))}
                <div className="border-t border-stone-700">
                  <button
                    className="w-full text-left px-3 py-2 text-sm text-rose-400 hover:bg-stone-700 flex items-center gap-2 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut size={14} />
                    Выйти
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={onToggle}
          className={`flex items-center gap-2 px-3 py-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl text-xs transition-colors w-full ${collapsed ? 'justify-center' : ''}`}
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Свернуть</span></>}
        </button>
      </div>
    </aside>
  );
}

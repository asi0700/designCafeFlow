import React, { useState } from 'react';
import { Building2, Clock, Users, Bell, Palette, Link2, Save } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader } from '../../components/ui/Card';
import { mockVenueInfo } from '../../mock-data/reports';
import { useAppToast } from '../../hooks/useToastContext';

type SettingsTab = 'venue' | 'hours' | 'roles' | 'notifications' | 'integrations' | 'appearance';

const tabs: { key: SettingsTab; label: string; icon: React.ElementType }[] = [
  { key: 'venue', label: 'Заведение', icon: Building2 },
  { key: 'hours', label: 'Рабочее время', icon: Clock },
  { key: 'roles', label: 'Роли', icon: Users },
  { key: 'notifications', label: 'Уведомления', icon: Bell },
  { key: 'integrations', label: 'Интеграции', icon: Link2 },
  { key: 'appearance', label: 'Внешний вид', icon: Palette },
];

export function SettingsPage() {
  const { addToast } = useAppToast();
  const [activeTab, setActiveTab] = useState<SettingsTab>('venue');
  const [venue, setVenue] = useState({ ...mockVenueInfo });

  const save = () => addToast('Настройки сохранены', 'success');

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Настройки</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-48 flex-shrink-0">
          <nav className="space-y-0.5">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all ${activeTab === key ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'text-stone-600 hover:bg-stone-100'}`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'venue' && (
            <Card>
              <CardHeader title="Информация о заведении" subtitle="Основные данные" />
              <div className="space-y-4">
                <Input label="Название" value={venue.name} onChange={e => setVenue(v => ({ ...v, name: e.target.value }))} />
                <Input label="Адрес" value={venue.address} onChange={e => setVenue(v => ({ ...v, address: e.target.value }))} />
                <Input label="Телефон" value={venue.phone} onChange={e => setVenue(v => ({ ...v, phone: e.target.value }))} />
                <Input label="Email" type="email" value={venue.email} onChange={e => setVenue(v => ({ ...v, email: e.target.value }))} />
                <Button variant="primary" icon={<Save size={14} />} onClick={save}>Сохранить</Button>
              </div>
            </Card>
          )}

          {activeTab === 'hours' && (
            <Card>
              <CardHeader title="Рабочее время" subtitle="Часы работы заведения" />
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Открытие" type="time" value={venue.openTime} onChange={e => setVenue(v => ({ ...v, openTime: e.target.value }))} />
                  <Input label="Закрытие" type="time" value={venue.closeTime} onChange={e => setVenue(v => ({ ...v, closeTime: e.target.value }))} />
                </div>
                <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="isOpen"
                    checked={venue.isOpen}
                    onChange={e => setVenue(v => ({ ...v, isOpen: e.target.checked }))}
                    className="accent-amber-500 w-4 h-4"
                  />
                  <label htmlFor="isOpen" className="text-sm font-medium text-stone-700">Заведение открыто сейчас</label>
                </div>
                <Button variant="primary" icon={<Save size={14} />} onClick={save}>Сохранить</Button>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader title="Уведомления" subtitle="Настройте, какие события вас оповещают" />
              <div className="space-y-3">
                {[
                  { label: 'Новое бронирование', desc: 'Когда гость создаёт бронь' },
                  { label: 'Сотрудник опоздал', desc: 'Если начало смены просрочено' },
                  { label: 'Стоп-лист обновлён', desc: 'Позиция добавлена или убрана' },
                  { label: 'Стол ожидает оплату', desc: 'Долго без закрытия' },
                  { label: 'Смена не закрыта', desc: 'Сотрудник не завершил смену' },
                ].map(notif => (
                  <div key={notif.label} className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
                    <div>
                      <p className="text-sm font-medium text-stone-800">{notif.label}</p>
                      <p className="text-xs text-stone-500 mt-0.5">{notif.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-10 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:bg-amber-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4"></div>
                    </label>
                  </div>
                ))}
                <Button variant="primary" icon={<Save size={14} />} className="mt-2" onClick={save}>Сохранить</Button>
              </div>
            </Card>
          )}

          {(activeTab === 'roles' || activeTab === 'integrations' || activeTab === 'appearance') && (
            <Card>
              <CardHeader title={tabs.find(t => t.key === activeTab)?.label ?? ''} />
              <div className="py-8 text-center text-stone-400">
                <div className="text-4xl mb-3">🛠️</div>
                <p className="font-medium text-stone-600">Раздел в разработке</p>
                <p className="text-sm mt-1">Эта функция будет доступна в следующей версии CafeFlow</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

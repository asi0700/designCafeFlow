import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Coffee, ArrowRight, CheckCircle, Star, ChevronDown, BarChart3,
  Calendar, Users, Map, UtensilsCrossed, Smartphone,
  TrendingUp, Clock, Zap, ChevronRight, Menu, X, LayoutDashboard,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

const features = [
  { icon: Map, title: 'Карта зала в реальном времени', desc: 'Видите статус каждого стола: свободен, занят, ожидает оплату. Никакой путаницы между официантами.' },
  { icon: Calendar, title: 'Умное расписание смен', desc: 'Составляйте, редактируйте и публикуйте расписание за минуты. Уведомления сотрудникам отправляются автоматически.' },
  { icon: Users, title: 'Управление командой', desc: 'Профили, ставки, права доступа, статистика по каждому сотруднику — всё в одном месте.' },
  { icon: UtensilsCrossed, title: 'Меню и стоп-лист', desc: 'Управляйте позициями, ценами и наличием в реальном времени прямо с телефона.' },
  { icon: BarChart3, title: 'Аналитика бизнеса', desc: 'Выручка, средний чек, загрузка зала, популярные блюда — понятные отчёты без Excel.' },
  { icon: Smartphone, title: 'Мобильный интерфейс', desc: 'Сотрудники видят свои смены, столы и заказы со смартфона. Никаких бумажных графиков.' },
];

const problems = [
  { emoji: '😩', title: 'Бумажные графики', desc: 'Постоянно меняются, теряются, непонятно кто работает в эту субботу' },
  { emoji: '📞', title: 'Звонки и мессенджеры', desc: 'Менеджер разрывается между сотрудниками, забывает согласования' },
  { emoji: '🗂️', title: 'Разрозненные данные', desc: 'Выручка в Excel, расписание в таблице, меню на бумаге — ничего не связано' },
  { emoji: '🤷', title: 'Непонятная статистика', desc: 'Не знаете какие блюда самые прибыльные и в какие часы больше всего гостей' },
];

const testimonials = [
  {
    name: 'Наташа Климова', role: 'Владелец кофейни "Утро"', city: 'Москва',
    text: 'Раньше я тратила 2 часа каждое воскресенье на составление расписания. Теперь — 15 минут. CafeFlow просто спас меня.',
    rating: 5,
  },
  {
    name: 'Артём Белов', role: 'Менеджер ресторана "Пятница"', city: 'Санкт-Петербург',
    text: 'Карта зала — находка. Официанты теперь не путают столы, а я сразу вижу кто чем занят. Гости стали уходить счастливее.',
    rating: 5,
  },
  {
    name: 'Лиза Попова', role: 'Совладелец бара "Медь"', city: 'Казань',
    text: 'Аналитика показала, что мы теряли деньги в пятницу вечером из-за нехватки персонала. Теперь ставим больше людей и выручка выросла на 18%.',
    rating: 5,
  },
];

const faqs = [
  {
    q: 'Сколько времени занимает внедрение CafeFlow?',
    a: 'В среднем — 1 рабочий день. Вы заполняете информацию о заведении, добавляете сотрудников и меню. Мы помогаем с настройкой бесплатно.',
  },
  {
    q: 'Работает ли CafeFlow на телефоне?',
    a: 'Да, интерфейс полностью адаптирован для мобильных устройств. Сотрудники открывают смену, видят свои столы и заказы прямо со смартфона.',
  },
  {
    q: 'Можно ли работать без подключения к интернету?',
    a: 'Базовые функции доступны в офлайн-режиме с синхронизацией при восстановлении соединения.',
  },
  {
    q: 'Сколько заведений можно подключить?',
    a: 'Каждое заведение — отдельное рабочее пространство. Если у вас несколько кафе, вы переключаетесь между ними в один клик.',
  },
  {
    q: 'Нужно ли устанавливать что-то на кассу?',
    a: 'Нет. CafeFlow работает в браузере на любом устройстве — планшете, ноутбуке или телефоне.',
  },
];

const venueTypes = ['Кофейни', 'Кафе', 'Рестораны', 'Бары', 'Пекарни', 'Фастфуд'];

export function LandingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center">
              <Coffee size={16} className="text-white" />
            </div>
            <span className="font-bold text-stone-900 text-lg">CafeFlow</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {['Возможности', 'Как работает', 'Отзывы', 'FAQ'].map(item => (
              <a key={item} href={`#${item}`} className="text-sm text-stone-600 hover:text-stone-900 transition-colors">{item}</a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Войти</Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/login')}>Попробовать</Button>
          </div>
          <button className="md:hidden p-2 rounded-lg hover:bg-stone-100" onClick={() => setMobileMenu(v => !v)}>
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden border-t border-stone-100 bg-white px-4 py-4 space-y-3 animate-slide-up">
            {['Возможности', 'Как работает', 'Отзывы', 'FAQ'].map(item => (
              <a key={item} href={`#${item}`} className="block text-sm text-stone-700 py-2" onClick={() => setMobileMenu(false)}>{item}</a>
            ))}
            <Button variant="primary" fullWidth onClick={() => navigate('/login')}>Попробовать бесплатно</Button>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 to-stone-50 pt-20 pb-24 px-4">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-12 left-10 w-64 h-64 bg-amber-200 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-100 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <Zap size={12} />
              Простая система управления кафе
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-stone-900 leading-[1.1] tracking-tight mb-5">
              Управляйте кафе<br />
              <span className="text-amber-500">без хаоса</span>
            </h1>
            <p className="text-xl text-stone-600 leading-relaxed mb-8 max-w-xl mx-auto">
              Смены, команда, зал, меню и показатели бизнеса — в одной понятной системе.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="primary" size="lg" iconRight={<ArrowRight size={18} />} onClick={() => navigate('/login')}>
                Попробовать CafeFlow
              </Button>
              <Button variant="outline" size="lg" onClick={() => document.getElementById('Возможности')?.scrollIntoView({ behavior: 'smooth' })}>
                Посмотреть возможности
              </Button>
            </div>
            <p className="text-stone-400 text-sm mt-4">Бесплатный демо-доступ • Без карты • Без обязательств</p>
          </div>

          {/* UI Preview */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden">
              <div className="bg-stone-900 px-6 py-4 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-teal-400" />
                </div>
                <div className="flex-1 bg-stone-800 rounded-lg h-6 mx-8 flex items-center px-3">
                  <span className="text-stone-400 text-xs">app.cafeflow.ru/dashboard</span>
                </div>
              </div>
              <div className="flex">
                {/* Fake sidebar */}
                <div className="w-12 bg-stone-900 flex flex-col items-center py-4 gap-4 flex-shrink-0">
                  {[LayoutDashboard, Map, UtensilsCrossed, Calendar, Users, BarChart3].map((Icon, i) => (
                    <div key={i} className={`w-8 h-8 rounded-xl flex items-center justify-center ${i === 0 ? 'bg-amber-500' : 'hover:bg-stone-800'}`}>
                      <Icon size={16} className={i === 0 ? 'text-white' : 'text-stone-500'} />
                    </div>
                  ))}
                </div>
                {/* Dashboard preview */}
                <div className="flex-1 bg-stone-50 p-4 min-h-72 max-h-72 overflow-hidden">
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    {[
                      { label: 'Выручка', value: '47 300 ₽', change: '+12%', color: 'text-teal-600' },
                      { label: 'Заказов', value: '78', change: '+5', color: 'text-teal-600' },
                      { label: 'Гостей', value: '134', change: '+18', color: 'text-teal-600' },
                      { label: 'Средний чек', value: '607 ₽', change: '-3%', color: 'text-rose-500' },
                    ].map(kpi => (
                      <div key={kpi.label} className="bg-white rounded-xl p-3 border border-stone-100">
                        <p className="text-stone-500 text-xs">{kpi.label}</p>
                        <p className="font-bold text-stone-900 text-sm mt-0.5">{kpi.value}</p>
                        <p className={`text-xs ${kpi.color}`}>{kpi.change}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 bg-white rounded-xl p-3 border border-stone-100 h-36">
                      <p className="text-xs font-medium text-stone-700 mb-2">Выручка за неделю</p>
                      <div className="flex items-end gap-1 h-24">
                        {[38, 42, 35, 51, 61, 59, 47].map((v, i) => (
                          <div key={i} className="flex-1 rounded-sm" style={{ height: `${(v / 65) * 100}%`, background: i === 6 ? '#f59e0b' : '#e7e5e4' }} />
                        ))}
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-stone-100 h-36 overflow-hidden">
                      <p className="text-xs font-medium text-stone-700 mb-2">Столы сейчас</p>
                      <div className="grid grid-cols-3 gap-1">
                        {['#f59e0b', '#14b8a6', '#f59e0b', '#e7e5e4', '#fbbf24', '#fb923c', '#14b8a6', '#e7e5e4', '#f59e0b'].map((c, i) => (
                          <div key={i} className="w-6 h-6 rounded-md" style={{ background: c }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-amber-200/30 blur-2xl rounded-full" />
          </div>
        </div>
      </section>

      {/* Venue types */}
      <section className="py-8 bg-white border-y border-stone-100">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-stone-500 text-sm mb-6">Работает для любых заведений</p>
          <div className="flex flex-wrap justify-center gap-3">
            {venueTypes.map(v => (
              <div key={v} className="flex items-center gap-2 bg-stone-50 border border-stone-200 text-stone-700 text-sm px-4 py-2 rounded-full font-medium">
                <Coffee size={14} className="text-amber-500" />
                {v}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="py-20 px-4 bg-stone-50" id="Как работает">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3">Знакомо?</h2>
            <p className="text-stone-600 text-lg max-w-xl mx-auto">Большинство кафе работают в режиме постоянного хаоса. CafeFlow это исправляет.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {problems.map(p => (
              <div key={p.title} className="bg-white rounded-2xl p-6 border border-stone-100 flex gap-4 items-start">
                <span className="text-3xl flex-shrink-0">{p.emoji}</span>
                <div>
                  <h3 className="font-semibold text-stone-900 mb-1">{p.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white" id="Возможности">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3">Всё для работы заведения</h2>
            <p className="text-stone-600 text-lg">Один инструмент вместо множества таблиц и мессенджеров</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="group p-6 rounded-2xl border border-stone-100 bg-stone-50 hover:bg-amber-50 hover:border-amber-200 transition-all duration-200">
                <div className="w-11 h-11 rounded-xl bg-amber-100 group-hover:bg-amber-200 flex items-center justify-center mb-4 transition-colors">
                  <f.icon size={20} className="text-amber-600" />
                </div>
                <h3 className="font-semibold text-stone-900 mb-2">{f.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floor map highlight */}
      <section className="py-20 px-4 bg-gradient-to-br from-stone-900 to-stone-800 text-white overflow-hidden relative">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
              <Map size={12} />
              Карта зала
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">Видите весь зал в один взгляд</h2>
            <p className="text-stone-300 text-lg leading-relaxed mb-6">
              Интерактивная схема зала показывает статус каждого стола в реальном времени. Свободен, занят, ожидает оплату — сразу понятно без лишних слов.
            </p>
            <ul className="space-y-3">
              {['Назначайте официантов на столы', 'Открывайте заказы одним касанием', 'Управляйте бронированием', 'Настраивайте схему под своё заведение'].map(item => (
                <li key={item} className="flex items-center gap-3 text-stone-300">
                  <CheckCircle size={16} className="text-teal-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {/* Floor map visual */}
          <div className="bg-stone-800 rounded-2xl p-6 border border-stone-700">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-stone-300">Основной зал</p>
              <div className="flex gap-2 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-teal-500 inline-block" />Свободен</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-400 inline-block" />Занят</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-400 inline-block" />Оплата</span>
              </div>
            </div>
            <div className="bg-stone-900/60 rounded-xl p-4 min-h-52 relative">
              {[
                { x: 20, y: 20, w: 60, h: 60, color: '#f59e0b', label: '1', guests: 2 },
                { x: 100, y: 20, w: 70, h: 70, color: '#14b8a6', label: '2', guests: 0 },
                { x: 190, y: 20, w: 70, h: 70, color: '#14b8a6', label: '3', guests: 0 },
                { x: 20, y: 110, w: 80, h: 55, color: '#fb923c', label: '4', guests: 2 },
                { x: 120, y: 110, w: 140, h: 55, color: '#f59e0b', label: 'VIP', guests: 6 },
              ].map(t => (
                <div key={t.label} className="absolute rounded-xl flex items-center justify-center flex-col gap-0.5 cursor-pointer hover:brightness-110 transition-all"
                  style={{ left: t.x, top: t.y, width: t.w, height: t.h, background: t.color + '33', border: `2px solid ${t.color}` }}>
                  <span className="text-white text-xs font-bold">{t.label}</span>
                  {t.guests > 0 && <span className="text-white/70 text-xs">{t.guests} ч.</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Shifts */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">Расписание на неделю</p>
            {[
              { name: 'Марина К.', role: 'Менеджер', days: [1,1,0,1,1,1,0], color: 'bg-teal-100 text-teal-700' },
              { name: 'Дмитрий В.', role: 'Официант', days: [1,0,1,1,0,1,1], color: 'bg-amber-100 text-amber-700' },
              { name: 'Екатерина С.', role: 'Официант', days: [0,1,1,0,1,1,1], color: 'bg-amber-100 text-amber-700' },
              { name: 'Иван П.', role: 'Кассир', days: [1,1,0,1,1,0,1], color: 'bg-blue-100 text-blue-700' },
            ].map(emp => (
              <div key={emp.name} className="flex items-center gap-3 mb-3">
                <div className="w-28 flex-shrink-0">
                  <p className="text-sm font-medium text-stone-800">{emp.name}</p>
                  <p className="text-xs text-stone-500">{emp.role}</p>
                </div>
                <div className="flex gap-1 flex-1">
                  {['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map((day, i) => (
                    <div key={day} className="flex-1 text-center">
                      <p className="text-xs text-stone-400 mb-1">{day}</p>
                      <div className={`h-7 rounded-lg text-xs flex items-center justify-center font-medium ${emp.days[i] ? emp.color : 'bg-stone-100 text-stone-300'}`}>
                        {emp.days[i] ? '10-22' : '—'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
              <Calendar size={12} />
              Планирование смен
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4 leading-tight">Расписание за 15 минут</h2>
            <p className="text-stone-600 text-lg leading-relaxed mb-6">
              Перетаскивайте смены, копируйте прошлую неделю, публикуйте и сотрудники сразу видят свой график.
            </p>
            <ul className="space-y-3">
              {['Предупреждения о конфликтах', 'Учёт фактического времени', 'Автоматический расчёт зарплаты', 'История и журнал смен'].map(item => (
                <li key={item} className="flex items-center gap-3 text-stone-700">
                  <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={12} className="text-teal-600" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Analytics */}
      <section className="py-20 px-4 bg-amber-50" id="Аналитика">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
            <TrendingUp size={12} />
            Аналитика
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">Цифры, которые помогают зарабатывать</h2>
          <p className="text-stone-600 text-lg max-w-xl mx-auto mb-12">
            Динамика выручки, популярные блюда, загрузка по часам — всё в понятных графиках без Excel.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '+18%', label: 'рост выручки', sub: 'за 3 месяца с CafeFlow' },
              { value: '2 ч', label: 'экономия в неделю', sub: 'на составление расписания' },
              { value: '94%', label: 'довольных клиентов', sub: 'оценка сервиса' },
              { value: '< 1 дня', label: 'до запуска', sub: 'среднее время внедрения' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 border border-amber-200 text-center">
                <p className="text-3xl font-bold text-amber-600 mb-1">{stat.value}</p>
                <p className="text-stone-800 font-medium text-sm">{stat.label}</p>
                <p className="text-stone-500 text-xs mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-stone-100 text-stone-700 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
            <Smartphone size={12} />
            Мобильный интерфейс
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">Всё нужное — в кармане</h2>
          <p className="text-stone-600 text-lg max-w-xl mx-auto mb-10">
            Официанты и кассиры работают со смартфона. Видят свою смену, столы и заказы.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Начало и конец смены', 'Мои столы', 'Активные заказы', 'Расписание', 'Заработок за месяц', 'Уведомления'].map(f => (
              <div key={f} className="flex items-center gap-2 bg-stone-50 border border-stone-200 text-stone-700 text-sm px-4 py-2.5 rounded-full">
                <CheckCircle size={14} className="text-teal-500" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-stone-50" id="Отзывы">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3">Что говорят владельцы</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-stone-700 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-stone-900 text-sm">{t.name}</p>
                  <p className="text-stone-500 text-xs mt-0.5">{t.role} · {t.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-white" id="FAQ">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3">Частые вопросы</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-stone-200 rounded-2xl overflow-hidden">
                <button
                  className="w-full text-left px-5 py-4 flex items-center justify-between font-medium text-stone-900 hover:bg-stone-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown size={16} className={`flex-shrink-0 text-stone-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-stone-600 text-sm leading-relaxed border-t border-stone-100 pt-3 animate-slide-up">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Готовы навести порядок в кафе?</h2>
          <p className="text-amber-100 text-lg mb-8 leading-relaxed">
            Начните бесплатно. Никаких установок, никаких карт. Первый результат — уже в первый день.
          </p>
          <Button
            variant="secondary" size="lg"
            iconRight={<ChevronRight size={18} />}
            className="bg-white text-amber-700 hover:bg-amber-50 shadow-lg"
            onClick={() => navigate('/login')}
          >
            Попробовать CafeFlow
          </Button>
          <p className="text-amber-200 text-sm mt-4">Демо-режим · Все функции открыты</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center">
                  <Coffee size={16} className="text-white" />
                </div>
                <span className="font-bold text-white">CafeFlow</span>
              </div>
              <p className="text-sm leading-relaxed">Система управления кафе для тех, кто ценит простоту и результат.</p>
            </div>
            {[
              { title: 'Продукт', links: ['Карта зала', 'Смены', 'Меню', 'Аналитика', 'Мобильное приложение'] },
              { title: 'Компания', links: ['О нас', 'Блог', 'Карьера', 'Пресс-кит'] },
              { title: 'Поддержка', links: ['Документация', 'FAQ', 'Контакты', 'Статус сервиса'] },
            ].map(col => (
              <div key={col.title}>
                <p className="font-medium text-white text-sm mb-3">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map(link => (
                    <li key={link}><a href="#" className="text-sm hover:text-white transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm">© 2024 CafeFlow. Все права защищены.</p>
            <div className="flex gap-4 text-sm">
              <a href="#" className="hover:text-white transition-colors">Конфиденциальность</a>
              <a href="#" className="hover:text-white transition-colors">Условия</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}



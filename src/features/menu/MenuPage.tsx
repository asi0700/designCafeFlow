import React, { useState } from 'react';
import { Search, Plus, Filter, Edit2, Copy, Trash2, EyeOff, Eye, AlertTriangle, X, ChevronDown } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { EmptyState, ConfirmDialog } from '../../components/ui/EmptyState';
import { mockMenuItems, mockCategories } from '../../mock-data/menu';
import { formatCurrency, truncate } from '../../utils/formatters';
import { useAppToast } from '../../hooks/useToastContext';
import type { MenuItem, MenuCategory } from '../../types';

export function MenuPage() {
  const { addToast } = useAppToast();
  const [items, setItems] = useState<MenuItem[]>(mockMenuItems);
  const [categories, setCategories] = useState<MenuCategory[]>(mockCategories);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = items.filter(item => {
    const catMatch = activeCat === 'all' || item.categoryId === activeCat;
    const searchMatch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  const toggleAvailability = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, isAvailable: !i.isAvailable, isStopList: i.isAvailable ? i.isStopList : false } : i));
    const item = items.find(i => i.id === id)!;
    addToast(item.isAvailable ? `"${item.name}" скрыт из меню` : `"${item.name}" доступен`, item.isAvailable ? 'warning' : 'success');
  };

  const toggleStopList = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, isStopList: !i.isStopList, isAvailable: i.isStopList } : i));
    const item = items.find(i => i.id === id)!;
    addToast(item.isStopList ? `"${item.name}" удалён из стоп-листа` : `"${item.name}" добавлен в стоп-лист`, item.isStopList ? 'success' : 'warning');
  };

  const deleteItem = (id: string) => {
    const item = items.find(i => i.id === id)!;
    setItems(prev => prev.filter(i => i.id !== id));
    setDeleteId(null);
    addToast(`"${item.name}" удалён`, 'info');
  };

  const duplicateItem = (id: string) => {
    const item = items.find(i => i.id === id)!;
    const newItem: MenuItem = { ...item, id: `mi-${Date.now()}`, name: item.name + ' (копия)' };
    setItems(prev => [...prev, newItem]);
    addToast(`"${item.name}" скопирован`, 'success');
  };

  const saveItem = (data: Partial<MenuItem>) => {
    if (editItem) {
      setItems(prev => prev.map(i => i.id === editItem.id ? { ...i, ...data } : i));
      addToast('Блюдо обновлено', 'success');
    } else {
      const newItem: MenuItem = {
        id: `mi-${Date.now()}`,
        categoryId: data.categoryId ?? categories[0]?.id ?? 'cat-1',
        name: data.name ?? '',
        description: data.description ?? '',
        price: data.price ?? 0,
        isAvailable: true,
        isStopList: false,
        prepTime: data.prepTime ?? 10,
        ...data,
      };
      setItems(prev => [...prev, newItem]);
      addToast('Блюдо добавлено', 'success');
    }
    setShowForm(false);
    setEditItem(null);
  };

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name ?? 'Без категории';
  const stopListCount = items.filter(i => i.isStopList).length;

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Меню</h1>
          <p className="text-stone-500 text-sm mt-0.5">{items.length} позиций · {stopListCount > 0 && <span className="text-rose-600 font-medium">{stopListCount} в стоп-листе</span>}</p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => { setEditItem(null); setShowForm(true); }}>
          Добавить блюдо
        </Button>
      </div>

      {/* Stop list alert */}
      {stopListCount > 0 && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-2xl p-3.5">
          <AlertTriangle size={16} className="text-rose-500 flex-shrink-0" />
          <p className="text-rose-700 text-sm">{stopListCount} позиций в стоп-листе: недоступны для заказа</p>
          <Button variant="outline" size="sm" className="ml-auto border-rose-300 text-rose-600 hover:bg-rose-100 flex-shrink-0" onClick={() => setActiveCat('all')}>
            Показать
          </Button>
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            className="w-full border border-stone-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            placeholder="Поиск по названию или описанию..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveCat('all')}
          className={`px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${activeCat === 'all' ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'}`}
        >
          Все ({items.length})
        </button>
        {categories.filter(c => c.isActive).map(cat => {
          const count = items.filter(i => i.categoryId === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1.5 ${activeCat === cat.id ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'}`}
            >
              <span>{cat.icon}</span>
              {cat.name}
              <span className="opacity-60 text-xs">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Items grid */}
      {filtered.length === 0 ? (
        <EmptyState title="Ничего не найдено" description="Попробуйте изменить фильтры или поисковый запрос" action={{ label: 'Сбросить', onClick: () => { setSearch(''); setActiveCat('all'); } }} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(item => (
            <MenuItemCard
              key={item.id}
              item={item}
              categoryName={getCategoryName(item.categoryId)}
              onEdit={() => { setEditItem(item); setShowForm(true); }}
              onDuplicate={() => duplicateItem(item.id)}
              onDelete={() => setDeleteId(item.id)}
              onToggleAvailability={() => toggleAvailability(item.id)}
              onToggleStopList={() => toggleStopList(item.id)}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditItem(null); }}
        title={editItem ? 'Редактировать блюдо' : 'Новое блюдо'}
        size="md"
      >
        <MenuItemForm
          item={editItem}
          categories={categories}
          onSave={saveItem}
          onCancel={() => { setShowForm(false); setEditItem(null); }}
        />
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Удалить блюдо?"
        message="Это действие нельзя отменить. Блюдо будет удалено из меню."
        onConfirm={() => deleteItem(deleteId!)}
        onCancel={() => setDeleteId(null)}
        confirmLabel="Удалить"
      />
    </div>
  );
}

function MenuItemCard({ item, categoryName, onEdit, onDuplicate, onDelete, onToggleAvailability, onToggleStopList }: {
  item: MenuItem;
  categoryName: string;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleAvailability: () => void;
  onToggleStopList: () => void;
}) {
  const [showActions, setShowActions] = useState(false);
  const isDisabled = !item.isAvailable || item.isStopList;

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden group transition-all hover:shadow-md ${isDisabled ? 'opacity-70 border-stone-100' : 'border-stone-100'}`}>
      <div className="relative h-36 overflow-hidden bg-stone-100">
        {item.image ? (
          <img src={item.image} alt={item.name} className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${isDisabled ? 'grayscale' : ''}`} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-amber-50 to-stone-100">🍽️</div>
        )}
        {item.isStopList && (
          <div className="absolute inset-0 bg-rose-900/40 flex items-center justify-center">
            <span className="bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">СТОП-ЛИСТ</span>
          </div>
        )}
        {!item.isAvailable && !item.isStopList && (
          <div className="absolute inset-0 bg-stone-900/30 flex items-center justify-center">
            <span className="bg-stone-700 text-white text-xs font-medium px-2.5 py-1 rounded-full">Недоступно</span>
          </div>
        )}
        {item.popular && !isDisabled && (
          <div className="absolute top-2 left-2">
            <span className="bg-amber-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">Хит</span>
          </div>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); setShowActions(v => !v); }}
            className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center shadow-sm hover:bg-white"
          >
            <ChevronDown size={12} className="text-stone-600" />
          </button>
          {showActions && (
            <div className="absolute right-0 mt-1 bg-white rounded-xl border border-stone-200 shadow-lg z-10 overflow-hidden min-w-36 animate-scale-in">
              <button className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2" onClick={() => { onEdit(); setShowActions(false); }}>
                <Edit2 size={12} />Редактировать
              </button>
              <button className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2" onClick={() => { onDuplicate(); setShowActions(false); }}>
                <Copy size={12} />Дублировать
              </button>
              <button className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2" onClick={() => { onToggleAvailability(); setShowActions(false); }}>
                {item.isAvailable ? <EyeOff size={12} /> : <Eye size={12} />}
                {item.isAvailable ? 'Скрыть' : 'Показать'}
              </button>
              <button className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2" onClick={() => { onToggleStopList(); setShowActions(false); }}>
                <AlertTriangle size={12} />{item.isStopList ? 'Убрать из стоп' : 'В стоп-лист'}
              </button>
              <button className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-stone-100" onClick={() => { onDelete(); setShowActions(false); }}>
                <Trash2 size={12} />Удалить
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-1 mb-1">
          <p className="font-semibold text-stone-900 text-sm leading-tight">{item.name}</p>
          <p className="text-base font-bold text-amber-600 flex-shrink-0 ml-1">{formatCurrency(item.price)}</p>
        </div>
        <p className="text-xs text-stone-500 leading-snug mb-2">{truncate(item.description, 60)}</p>
        <div className="flex items-center justify-between">
          <Badge variant="default" size="sm">{categoryName}</Badge>
          <span className="text-xs text-stone-400">{item.prepTime} мин</span>
        </div>
      </div>
    </div>
  );
}

function MenuItemForm({ item, categories, onSave, onCancel }: {
  item: MenuItem | null;
  categories: MenuCategory[];
  onSave: (data: Partial<MenuItem>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: item?.name ?? '',
    categoryId: item?.categoryId ?? categories[0]?.id ?? '',
    description: item?.description ?? '',
    price: item?.price ?? 0,
    prepTime: item?.prepTime ?? 10,
    isAvailable: item?.isAvailable ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || form.price <= 0) return;
    onSave({ ...form, price: Number(form.price), prepTime: Number(form.prepTime) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Название" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Капучино" required />
      <Select
        label="Категория"
        value={form.categoryId}
        onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
        options={categories.map(c => ({ value: c.id, label: `${c.icon} ${c.name}` }))}
      />
      <Textarea label="Описание" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Нежный капучино с воздушной молочной пеной" />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Цена (₽)" type="number" min={0} value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} required />
        <Input label="Время готовки (мин)" type="number" min={1} value={form.prepTime} onChange={e => setForm(f => ({ ...f, prepTime: Number(e.target.value) }))} />
      </div>
      <div className="flex items-center gap-3">
        <input type="checkbox" id="avail" checked={form.isAvailable} onChange={e => setForm(f => ({ ...f, isAvailable: e.target.checked }))} className="accent-amber-500 w-4 h-4" />
        <label htmlFor="avail" className="text-sm text-stone-700 font-medium">Доступно для заказа</label>
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" fullWidth onClick={onCancel}>Отмена</Button>
        <Button type="submit" variant="primary" fullWidth>Сохранить</Button>
      </div>
    </form>
  );
}

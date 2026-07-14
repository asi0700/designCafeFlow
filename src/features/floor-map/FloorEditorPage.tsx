import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, RotateCw, Trash2, Copy, Save, Undo2, Redo2,
  ZoomIn, ZoomOut, Maximize2, Lock, Unlock, Plus, ChevronDown, Layers,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { FloorPatternDefs } from './RoomBackground';
import { TableChair } from './TableVisual';
import { furnitureCatalog, furnitureCategories, floorTemplates } from '../../mock-data/furniture';
import type { FloorItem, FurnitureItem } from '../../types';
import type { Zone } from '../../types';
import { mockZones } from '../../mock-data/zones';
import { useAppToast } from '../../hooks/useToastContext';

// ─── Initial demo items ───────────────────────────────────────────────────────
const DEMO_ITEMS: FloorItem[] = [
  { id: 'fi-1', furnitureId: 'f-rt2', type: 'round_table_2', name: 'Стол 1', x: 120, y: 80, width: 80, height: 80, rotation: 0, seats: 2, tableNumber: 1, zone: 'main' },
  { id: 'fi-2', furnitureId: 'f-rt4', type: 'round_table_4', name: 'Стол 2', x: 270, y: 75, width: 100, height: 100, rotation: 0, seats: 4, tableNumber: 2, zone: 'window' },
  { id: 'fi-3', furnitureId: 'f-sq4', type: 'square_table_4', name: 'Стол 3', x: 430, y: 75, width: 100, height: 100, rotation: 0, seats: 4, tableNumber: 3, zone: 'window' },
  { id: 'fi-4', furnitureId: 'f-barcounter', type: 'bar_counter', name: 'Барная стойка', x: 630, y: 50, width: 180, height: 55, rotation: 0, zone: 'bar' },
  { id: 'fi-5', furnitureId: 'f-enter', type: 'entrance', name: 'Вход', x: 100, y: 490, width: 80, height: 18, rotation: 0, zone: 'service' },
  { id: 'fi-6', furnitureId: 'f-plant', type: 'plant', name: 'Растение', x: 60, y: 55, width: 40, height: 40, rotation: 0, zone: 'main' },
  { id: 'fi-7', furnitureId: 'f-rect4', type: 'rect_table_4', name: 'Стол 4', x: 120, y: 250, width: 140, height: 80, rotation: 0, seats: 4, tableNumber: 4, zone: 'main' },
  { id: 'fi-8', furnitureId: 'f-long8', type: 'long_table_8', name: 'VIP-стол', x: 100, y: 380, width: 240, height: 90, rotation: 0, seats: 8, tableNumber: 5, zone: 'vip' },
  { id: 'fi-9', furnitureId: 'f-bar', type: 'bar_seat', name: 'Барное место 1', x: 638, y: 135, width: 45, height: 45, rotation: 0, seats: 1, tableNumber: 9, zone: 'bar' },
  { id: 'fi-10', furnitureId: 'f-bar', type: 'bar_seat', name: 'Барное место 2', x: 690, y: 135, width: 45, height: 45, rotation: 0, seats: 1, tableNumber: 10, zone: 'bar' },
  { id: 'fi-11', furnitureId: 'f-sq4', type: 'square_table_4', name: 'Терраса 1', x: 100, y: 510, width: 100, height: 100, rotation: 0, seats: 4, tableNumber: 11, zone: 'terrace' },
  { id: 'fi-12', furnitureId: 'f-sq4', type: 'square_table_4', name: 'Терраса 2', x: 250, y: 510, width: 100, height: 100, rotation: 0, seats: 4, tableNumber: 12, zone: 'terrace' },
];

// ─── Appearance helpers ───────────────────────────────────────────────────────
const TABLE_TYPES = new Set(['round_table_2', 'round_table_4', 'square_table_4', 'rect_table_4', 'long_table_8', 'bar_seat']);
const isTable = (type: string) => TABLE_TYPES.has(type);
const isRoundType = (type: string) => ['round_table_2', 'round_table_4', 'bar_seat'].includes(type);

const TYPE_STYLE: Record<string, { fill: [string, string]; stroke: string; text: string }> = {
  round_table_2:  { fill: ['#d4a06a', '#c08848'], stroke: '#a06830', text: '#fff' },
  round_table_4:  { fill: ['#d4a06a', '#c08848'], stroke: '#a06830', text: '#fff' },
  square_table_4: { fill: ['#c89858', '#b08040'], stroke: '#906828', text: '#fff' },
  rect_table_4:   { fill: ['#d4a06a', '#c08848'], stroke: '#a06830', text: '#fff' },
  long_table_8:   { fill: ['#8b5e3c', '#7a4f2d'], stroke: '#5c3820', text: '#fff' },
  bar_seat:       { fill: ['#4a7eaa', '#3a6890'], stroke: '#2a5070', text: '#fff' },
  bar_counter:    { fill: ['#7a4e80', '#6a3870'], stroke: '#5a2860', text: '#fff' },
  sofa:           { fill: ['#5a8060', '#4a7050'], stroke: '#3a6040', text: '#fff' },
  sofa_corner:    { fill: ['#5a8060', '#4a7050'], stroke: '#3a6040', text: '#fff' },
  armchair:       { fill: ['#8a7060', '#7a6050'], stroke: '#6a5040', text: '#fff' },
  chair:          { fill: ['#d4c8b8', '#c8bca8'], stroke: '#a8a898', text: '#555' },
  bar_chair:      { fill: ['#d4c8b8', '#c8bca8'], stroke: '#a8a898', text: '#555' },
  divider:        { fill: ['#a0a098', '#909088'], stroke: '#707068', text: '#fff' },
  plant:          { fill: ['#4a8040', '#3a7030'], stroke: '#2a6020', text: '#fff' },
  cashier:        { fill: ['#8080c0', '#7070b0'], stroke: '#5050a0', text: '#fff' },
  entrance:       { fill: ['#c0c890', '#b0b880'], stroke: '#909060', text: '#555' },
  window:         { fill: ['#a0d4e8', '#88c4d8'], stroke: '#68a4c0', text: '#444' },
  kitchen:        { fill: ['#d8d090', '#c8c080'], stroke: '#a8a060', text: '#555' },
  toilet:         { fill: ['#b0c8d4', '#a0b8c4'], stroke: '#80a0b0', text: '#444' },
};

const getStyle = (type: string) => TYPE_STYLE[type] ?? { fill: ['#d0c8c0', '#c0b8b0'] as [string,string], stroke: '#a09888', text: '#555' };

// ─── Chair count from rect table ─────────────────────────────────────────────
function getChairPositionsRect(item: FloorItem): { cx: number; cy: number; angle: number }[] {
  const { x, y, width: w, height: h, seats = 4 } = item;
  const res: { cx: number; cy: number; angle: number }[] = [];
  const top = Math.ceil(seats / 2), bottom = seats - top;
  for (let i = 0; i < top; i++) res.push({ cx: x + (w / (top + 1)) * (i + 1), cy: y - 22, angle: 180 });
  for (let i = 0; i < bottom; i++) res.push({ cx: x + (w / (bottom + 1)) * (i + 1), cy: y + h + 22, angle: 0 });
  if (seats > 6) { res.push({ cx: x - 22, cy: y + h / 2, angle: 90 }); res.push({ cx: x + w + 22, cy: y + h / 2, angle: -90 }); }
  return res;
}

function getChairPositionsRound(item: FloorItem): { cx: number; cy: number; angle: number }[] {
  const { x, y, width: w, height: h, seats = 2 } = item;
  const cx = x + w / 2, cy = y + h / 2, r = Math.min(w, h) / 2 + 18;
  return Array.from({ length: seats }, (_, i) => {
    const a = (i / seats) * 2 * Math.PI - Math.PI / 2;
    return { cx: cx + r * Math.cos(a), cy: cy + r * Math.sin(a), angle: (a * 180 / Math.PI) + 90 };
  });
}

// ─── Canvas item render ───────────────────────────────────────────────────────
interface EditorItemProps {
  item: FloorItem;
  isSelected: boolean;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
}

function EditorItem({ item, isSelected, onPointerDown }: EditorItemProps) {
  const s = getStyle(item.type);
  const cx = item.x + item.width / 2;
  const cy = item.y + item.height / 2;
  const rnd = isRoundType(item.type);
  const gradId = `eg-${item.id}`;

  const chairPositions = isTable(item.type) && item.seats
    ? (rnd ? getChairPositionsRound(item) : getChairPositionsRect(item))
    : [];

  return (
    <g
      transform={`rotate(${item.rotation},${cx},${cy})`}
      onPointerDown={e => { if (!item.locked) onPointerDown(e, item.id); }}
      style={{ cursor: item.locked ? 'default' : 'grab' }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={s.fill[0]} />
          <stop offset="100%" stopColor={s.fill[1]} />
        </linearGradient>
      </defs>

      {/* Chairs */}
      {chairPositions.map((c, i) => <TableChair key={i} cx={c.cx} cy={c.cy} angle={c.angle} size={16} />)}

      {/* Shadow */}
      {rnd
        ? <circle cx={cx + 3} cy={cy + 4} r={item.width / 2} fill="rgba(0,0,0,0.1)" />
        : <rect x={item.x + 3} y={item.y + 4} width={item.width} height={item.height} rx={6} fill="rgba(0,0,0,0.1)" />
      }

      {/* Body */}
      {rnd
        ? <circle cx={cx} cy={cy} r={item.width / 2}
            fill={`url(#${gradId})`}
            stroke={isSelected ? '#1e40af' : s.stroke}
            strokeWidth={isSelected ? 2.5 : 1.5} />
        : <rect x={item.x} y={item.y} width={item.width} height={item.height} rx={6}
            fill={`url(#${gradId})`}
            stroke={isSelected ? '#1e40af' : s.stroke}
            strokeWidth={isSelected ? 2.5 : 1.5} />
      }

      {/* Label */}
      {item.width > 32 && (
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
          fontSize={Math.min(11, item.width / 6)} fontWeight={600} fill={s.text}
          style={{ pointerEvents: 'none', userSelect: 'none' }}>
          {item.tableNumber ? `${item.tableNumber}` : item.name.length < 10 ? item.name : item.name.slice(0, 8)}
        </text>
      )}

      {/* Lock icon */}
      {item.locked && (
        <text x={cx} y={cy + 16} textAnchor="middle" fontSize={10} fill="rgba(255,255,255,0.7)" style={{ pointerEvents: 'none' }}>🔒</text>
      )}

      {/* Selection box + handles */}
      {isSelected && !item.locked && (
        <>
          {rnd
            ? <circle cx={cx} cy={cy} r={item.width / 2 + 8}
                fill="none" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 3" />
            : <rect x={item.x - 8} y={item.y - 8} width={item.width + 16} height={item.height + 16} rx={10}
                fill="none" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 3" />
          }
          {/* Resize handles at corners */}
          {[
            { hx: item.x - 8,              hy: item.y - 8,               cursor: 'nw-resize', handle: 'nw' },
            { hx: item.x + item.width + 2,  hy: item.y - 8,               cursor: 'ne-resize', handle: 'ne' },
            { hx: item.x - 8,              hy: item.y + item.height + 2,  cursor: 'sw-resize', handle: 'sw' },
            { hx: item.x + item.width + 2,  hy: item.y + item.height + 2, cursor: 'se-resize', handle: 'se' },
          ].map(h => (
            <rect key={h.handle} x={h.hx - 4} y={h.hy - 4} width={8} height={8} rx={2}
              fill="white" stroke="#3b82f6" strokeWidth={1.5}
              style={{ cursor: h.cursor }}
              onPointerDown={e => { e.stopPropagation(); /* resize handled separately */ }}
            />
          ))}
        </>
      )}
    </g>
  );
}

// ─── Furniture catalogue thumbnail ───────────────────────────────────────────
function FurnitureThumbnail({ type }: { type: string }) {
  const s = getStyle(type);
  const rnd = isRoundType(type);
  return (
    <svg width={36} height={36} viewBox="0 0 36 36">
      <defs>
        <linearGradient id={`th-${type}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={s.fill[0]} />
          <stop offset="100%" stopColor={s.fill[1]} />
        </linearGradient>
      </defs>
      {rnd
        ? <circle cx={18} cy={18} r={14} fill={`url(#th-${type})`} stroke={s.stroke} strokeWidth={1.5} />
        : type === 'sofa' || type === 'sofa_corner'
          ? <>
              <rect x={3} y={12} width={30} height={18} rx={4} fill={`url(#th-${type})`} stroke={s.stroke} strokeWidth={1.5} />
              <rect x={5} y={8} width={26} height={8} rx={3} fill={s.stroke} />
            </>
          : <rect x={3} y={3} width={30} height={30} rx={5} fill={`url(#th-${type})`} stroke={s.stroke} strokeWidth={1.5} />
      }
    </svg>
  );
}

// ─── Main FloorEditorPage ─────────────────────────────────────────────────────
interface DragState { id: string; startPX: number; startPY: number; itemX: number; itemY: number }

export function FloorEditorPage() {
  const navigate = useNavigate();
  const { addToast } = useAppToast();
  const svgRef = useRef<SVGSVGElement>(null);

  const [items, setItems] = useState<FloorItem[]>(DEMO_ITEMS);
  const [past, setPast] = useState<FloorItem[][]>([]);
  const [future, setFuture] = useState<FloorItem[][]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeCat, setActiveCat] = useState('tables');
  const [drag, setDrag] = useState<DragState | null>(null);
  const [vp, setVp] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const panRef = useRef({ sx: 0, sy: 0, vx: 0, vy: 0 });
  const [showTemplates, setShowTemplates] = useState(false);
  const [zones] = useState<Zone[]>(mockZones);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const GRID = 20;

  // ── History helpers ─────────────────────────────────────────────────────
  const commit = useCallback((next: FloorItem[]) => {
    setPast(p => [...p.slice(-30), items]);
    setFuture([]);
    setItems(next);
  }, [items]);

  const undo = () => {
    if (past.length === 0) return;
    setFuture(f => [items, ...f]);
    setItems(past[past.length - 1]);
    setPast(p => p.slice(0, -1));
    setSelected(null);
  };

  const redo = () => {
    if (future.length === 0) return;
    setPast(p => [...p, items]);
    setItems(future[0]);
    setFuture(f => f.slice(1));
  };

  // ── Keyboard shortcuts ──────────────────────────────────────────────────
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') { e.preventDefault(); if (e.shiftKey) redo(); else undo(); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') { e.preventDefault(); redo(); }
      if (e.key === 'Delete' || e.key === 'Backspace') { if (selected) deleteSelected(); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') { e.preventDefault(); if (selected) duplicateSelected(); }
      if (e.key === '0') setVp({ x: 0, y: 0, scale: 1 });
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  // ── Zoom ──────────────────────────────────────────────────────────────
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    setVp(v => {
      const ns = Math.min(Math.max(v.scale * factor, 0.2), 6);
      const ratio = ns / v.scale;
      return { scale: ns, x: mx - ratio * (mx - v.x), y: my - ratio * (my - v.y) };
    });
  }, []);
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // ── Add furniture ────────────────────────────────────────────────────
  const addFurniture = (f: FurnitureItem) => {
    const tableCount = items.filter(i => isTable(i.type)).length;
    const newItem: FloorItem = {
      id: `fi-${Date.now()}`,
      furnitureId: f.id,
      type: f.type,
      name: isTable(f.type) ? `Стол ${tableCount + 1}` : f.name,
      x: 80 + (tableCount % 5) * 30,
      y: 80 + Math.floor(tableCount / 5) * 30,
      width: f.width, height: f.height, rotation: 0,
      seats: f.seats,
      tableNumber: isTable(f.type) ? tableCount + 1 : undefined,
      zone: 'main',
    };
    commit([...items, newItem]);
    setSelected(newItem.id);
    addToast(`${f.name} добавлен`, 'success');
  };

  // ── Selection & drag ────────────────────────────────────────────────
  const onItemPointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    const item = items.find(i => i.id === id);
    if (!item || item.locked) return;
    setSelected(id);
    (e.currentTarget as SVGElement).setPointerCapture(e.pointerId);
    setDrag({ id, startPX: e.clientX, startPY: e.clientY, itemX: item.x, itemY: item.y });
  };

  const onSvgPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.target === svgRef.current) {
      setSelected(null);
      setIsPanning(true);
      panRef.current = { sx: e.clientX, sy: e.clientY, vx: vp.x, vy: vp.y };
      (e.currentTarget as SVGElement).setPointerCapture(e.pointerId);
    }
  };

  const snap = (v: number) => snapToGrid ? Math.round(v / GRID) * GRID : v;

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (drag) {
      const dx = (e.clientX - drag.startPX) / vp.scale;
      const dy = (e.clientY - drag.startPY) / vp.scale;
      setItems(prev => prev.map(i => i.id === drag.id
        ? { ...i, x: snap(Math.max(0, drag.itemX + dx)), y: snap(Math.max(0, drag.itemY + dy)) }
        : i));
    } else if (isPanning) {
      const dx = e.clientX - panRef.current.sx;
      const dy = e.clientY - panRef.current.sy;
      setVp(v => ({ ...v, x: panRef.current.vx + dx, y: panRef.current.vy + dy }));
    }
  };

  const onPointerUp = () => {
    if (drag) {
      setPast(p => [...p.slice(-30), items]);
      setFuture([]);
    }
    setDrag(null);
    setIsPanning(false);
  };

  // ── Item actions ────────────────────────────────────────────────────
  const selectedItem = items.find(i => i.id === selected);

  const deleteSelected = () => {
    if (!selected) return;
    commit(items.filter(i => i.id !== selected));
    setSelected(null);
  };

  const duplicateSelected = () => {
    if (!selectedItem) return;
    const dup: FloorItem = { ...selectedItem, id: `fi-${Date.now()}`, x: selectedItem.x + 24, y: selectedItem.y + 24 };
    commit([...items, dup]);
    setSelected(dup.id);
  };

  const rotateSelected = () => {
    if (!selectedItem) return;
    commit(items.map(i => i.id === selected ? { ...i, rotation: (i.rotation + 45) % 360 } : i));
  };

  const toggleLock = () => {
    if (!selected) return;
    commit(items.map(i => i.id === selected ? { ...i, locked: !i.locked } : i));
  };

  const updateProp = (patch: Partial<FloorItem>) => {
    if (!selected) return;
    setItems(prev => prev.map(i => i.id === selected ? { ...i, ...patch } : i));
  };

  const zoneOptions = [{ value: '', label: '— без зоны —' }, ...zones.map(z => ({ value: z.id, label: z.name }))];

  return (
    <div className="flex flex-col h-screen bg-stone-100 overflow-hidden">
      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-stone-200 px-4 py-2.5 flex items-center gap-2 flex-wrap flex-shrink-0">
        <Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />} onClick={() => navigate('/app/floor')}>
          Карта зала
        </Button>
        <div className="h-4 border-l border-stone-200" />
        <span className="text-sm font-semibold text-stone-700">Редактор зала</span>
        <div className="flex items-center gap-1 ml-1">
          <button onClick={() => setSnapToGrid(v => !v)}
            className={`px-2 py-1 text-xs rounded-lg border transition-colors ${snapToGrid ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 text-stone-500'}`}>
            Сетка {GRID}px
          </button>
        </div>
        <div className="flex-1" />

        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" icon={<Undo2 size={13} />} onClick={undo} disabled={past.length === 0} />
          <Button variant="outline" size="sm" icon={<Redo2 size={13} />} onClick={redo} disabled={future.length === 0} />
          {selectedItem && (
            <>
              <div className="h-4 border-l border-stone-200 mx-0.5" />
              <Button variant="outline" size="sm" icon={<RotateCw size={13} />} onClick={rotateSelected} />
              <Button variant="outline" size="sm" icon={<Copy size={13} />} onClick={duplicateSelected} />
              <Button variant="outline" size="sm"
                icon={selectedItem.locked ? <Unlock size={13} /> : <Lock size={13} />}
                onClick={toggleLock}
                className={selectedItem.locked ? 'text-amber-600 border-amber-300' : ''} />
              <Button variant="danger" size="sm" icon={<Trash2 size={13} />} onClick={deleteSelected} />
            </>
          )}
          <div className="h-4 border-l border-stone-200 mx-0.5" />
          <div className="relative">
            <Button variant="outline" size="sm" iconRight={<ChevronDown size={12} />}
              onClick={() => setShowTemplates(v => !v)}>
              Шаблон
            </Button>
            {showTemplates && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-xl border border-stone-200 shadow-lg z-30 overflow-hidden w-52 animate-scale-in">
                {floorTemplates.map(t => (
                  <button key={t.id} className="w-full text-left px-4 py-2.5 hover:bg-stone-50 text-sm text-stone-700"
                    onClick={() => { addToast(`Шаблон "${t.name}" применён`, 'success'); setShowTemplates(false); }}>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs text-stone-400">{t.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button variant="primary" size="sm" icon={<Save size={13} />}
            onClick={() => addToast('Схема зала сохранена', 'success')}>
            Сохранить
          </Button>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Catalogue sidebar */}
        <div className="w-52 bg-white border-r border-stone-200 flex flex-col flex-shrink-0 overflow-hidden">
          <div className="px-3 py-2.5 border-b border-stone-100">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Объекты</p>
          </div>
          <div className="flex flex-wrap gap-1 px-2 py-2 border-b border-stone-100">
            {furnitureCategories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCat(cat.id)}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${activeCat === cat.id ? 'bg-stone-900 text-white' : 'text-stone-500 hover:bg-stone-100'}`}>
                {cat.name}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {furnitureCatalog.filter(f => f.category === activeCat).map(f => (
              <button key={f.id} onClick={() => addFurniture(f)}
                className="w-full flex items-center gap-2.5 p-2 rounded-xl border border-stone-100 hover:border-amber-300 hover:bg-amber-50 transition-all group text-left">
                <div className="w-10 h-10 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 group-hover:border-amber-200 transition-colors">
                  <FurnitureThumbnail type={f.type} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-stone-800 truncate">{f.name}</p>
                  <p className="text-xs text-stone-400">{f.seats ? `${f.seats} мест` : `${f.width}×${f.height}`}</p>
                </div>
                <Plus size={12} className="text-stone-300 group-hover:text-amber-500 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-hidden relative bg-stone-200">
          {/* Zoom controls */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
            <button onClick={() => setVp(v => ({ ...v, scale: Math.min(v.scale * 1.25, 6) }))}
              className="w-8 h-8 bg-white border border-stone-200 rounded-lg shadow flex items-center justify-center hover:bg-stone-50 text-stone-600">
              <ZoomIn size={14} />
            </button>
            <button onClick={() => setVp(v => ({ ...v, scale: Math.max(v.scale / 1.25, 0.2) }))}
              className="w-8 h-8 bg-white border border-stone-200 rounded-lg shadow flex items-center justify-center hover:bg-stone-50 text-stone-600">
              <ZoomOut size={14} />
            </button>
            <button onClick={() => setVp({ x: 0, y: 0, scale: 1 })}
              className="w-8 h-8 bg-white border border-stone-200 rounded-lg shadow flex items-center justify-center hover:bg-stone-50 text-stone-600">
              <Maximize2 size={14} />
            </button>
            <div className="bg-white border border-stone-200 rounded-lg shadow px-1.5 py-1 text-center">
              <span className="text-xs text-stone-500 font-medium">{Math.round(vp.scale * 100)}%</span>
            </div>
          </div>

          {/* Hint */}
          <div className="absolute bottom-3 left-3 z-10 bg-white/80 text-xs text-stone-400 px-2.5 py-1.5 rounded-lg border border-stone-200 select-none">
            Drag — перемещение · Ctrl+Z — отмена · Del — удалить
          </div>

          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            style={{ display: 'block', userSelect: 'none', cursor: drag ? 'grabbing' : isPanning ? 'grabbing' : 'default', minHeight: 500 }}
            onPointerDown={onSvgPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            <FloorPatternDefs />

            <g transform={`translate(${vp.x},${vp.y}) scale(${vp.scale})`}>
              {/* Grid */}
              <defs>
                <pattern id="edGrid" width={GRID} height={GRID} patternUnits="userSpaceOnUse">
                  <path d={`M ${GRID} 0 L 0 0 0 ${GRID}`} fill="none" stroke="#e0dcd8" strokeWidth="0.6" />
                </pattern>
                <pattern id="edGrid2" width={100} height={100} patternUnits="userSpaceOnUse">
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#d0ccc8" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width={1000} height={750} fill="white" />
              <rect width={1000} height={750} fill="url(#edGrid)" />
              <rect width={1000} height={750} fill="url(#edGrid2)" />

              {/* Zone overlays */}
              {zones.filter(z => z.isActive).map(z => (
                <rect key={z.id} x={z.x} y={z.y} width={z.width} height={z.height}
                  fill={z.color} opacity={0.06}
                  stroke={z.color} strokeWidth={1.5} strokeDasharray="6 4" />
              ))}
              {zones.filter(z => z.isActive).map(z => (
                <text key={`zl-${z.id}`} x={z.x + 8} y={z.y + 16} fontSize={10} fill={z.color}
                  fontWeight={600} opacity={0.6} style={{ userSelect: 'none', pointerEvents: 'none' }}>
                  {z.name.toUpperCase()}
                </text>
              ))}

              {/* Items */}
              {items.map(item => (
                <EditorItem key={item.id} item={item} isSelected={selected === item.id} onPointerDown={onItemPointerDown} />
              ))}
            </g>
          </svg>
        </div>

        {/* Properties panel */}
        {selectedItem ? (
          <div className="w-56 bg-white border-l border-stone-200 flex flex-col flex-shrink-0 overflow-y-auto">
            <div className="px-3 py-2.5 border-b border-stone-100">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Свойства</p>
            </div>
            <div className="p-3 space-y-3">
              <div>
                <label className="text-xs text-stone-500 block mb-1">Название</label>
                <input className="w-full border border-stone-200 rounded-lg px-2.5 py-1.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={selectedItem.name}
                  onChange={e => updateProp({ name: e.target.value })} />
              </div>

              {selectedItem.tableNumber !== undefined && (
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Номер стола</label>
                  <input type="number" min={1}
                    className="w-full border border-stone-200 rounded-lg px-2.5 py-1.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    value={selectedItem.tableNumber}
                    onChange={e => updateProp({ tableNumber: Number(e.target.value) })} />
                </div>
              )}

              {selectedItem.seats !== undefined && (
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Количество мест</label>
                  <input type="number" min={1} max={20}
                    className="w-full border border-stone-200 rounded-lg px-2.5 py-1.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    value={selectedItem.seats}
                    onChange={e => updateProp({ seats: Number(e.target.value) })} />
                </div>
              )}

              <div>
                <label className="text-xs text-stone-500 block mb-1">Зона</label>
                <select className="w-full border border-stone-200 rounded-lg px-2.5 py-1.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                  value={selectedItem.zone ?? ''}
                  onChange={e => updateProp({ zone: e.target.value || undefined })}>
                  {zoneOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-stone-500 block mb-1">X</label>
                  <input type="number" readOnly value={Math.round(selectedItem.x)}
                    className="w-full border border-stone-100 rounded-lg px-2 py-1.5 text-xs text-stone-500 bg-stone-50" />
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Y</label>
                  <input type="number" readOnly value={Math.round(selectedItem.y)}
                    className="w-full border border-stone-100 rounded-lg px-2 py-1.5 text-xs text-stone-500 bg-stone-50" />
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Ш</label>
                  <input type="number" min={20} value={selectedItem.width}
                    onChange={e => updateProp({ width: Number(e.target.value) })}
                    className="w-full border border-stone-200 rounded-lg px-2 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-1">В</label>
                  <input type="number" min={20} value={selectedItem.height}
                    onChange={e => updateProp({ height: Number(e.target.value) })}
                    className="w-full border border-stone-200 rounded-lg px-2 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>
              </div>

              <div>
                <label className="text-xs text-stone-500 block mb-1">Поворот: {selectedItem.rotation}°</label>
                <input type="range" min={0} max={315} step={45}
                  value={selectedItem.rotation}
                  onChange={e => updateProp({ rotation: Number(e.target.value) })}
                  className="w-full accent-amber-500" />
              </div>

              <div className="border-t border-stone-100 pt-3 space-y-1.5">
                <Button variant="outline" size="sm" fullWidth icon={<RotateCw size={12} />} onClick={rotateSelected}>Повернуть 45°</Button>
                <Button variant="outline" size="sm" fullWidth icon={<Copy size={12} />} onClick={duplicateSelected}>Дублировать</Button>
                <Button variant="outline" size="sm" fullWidth
                  icon={selectedItem.locked ? <Unlock size={12} /> : <Lock size={12} />}
                  className={selectedItem.locked ? 'text-amber-600 border-amber-300' : ''}
                  onClick={toggleLock}>
                  {selectedItem.locked ? 'Разблокировать' : 'Заблокировать'}
                </Button>
                <Button variant="danger" size="sm" fullWidth icon={<Trash2 size={12} />} onClick={deleteSelected}>Удалить</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-52 bg-white border-l border-stone-200 flex flex-col items-center justify-center p-4 text-center flex-shrink-0">
            <Layers size={28} className="text-stone-300 mb-2" />
            <p className="text-xs text-stone-400">Выберите объект на холсте для редактирования свойств</p>
          </div>
        )}
      </div>
    </div>
  );
}

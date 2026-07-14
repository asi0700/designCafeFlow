import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { RoomBackground, FloorPatternDefs } from './RoomBackground';
import { TableVisual } from './TableVisual';
import type { CafeTable } from '../../types';
import type { Zone } from '../../types';
import { mockOrders, mockReservations } from '../../mock-data/orders';

interface Viewport { x: number; y: number; scale: number }
const DEFAULT_VP: Viewport = { x: 0, y: 0, scale: 1 };

interface TableCanvasProps {
  tables: CafeTable[];
  zones: Zone[];
  selectedId?: string;
  activeZone?: string;
  onTableClick: (table: CafeTable) => void;
}

export function TableCanvas({
  tables, zones, selectedId, activeZone, onTableClick,
}: TableCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [vp, setVp] = useState<Viewport>(DEFAULT_VP);
  const [isPanning, setIsPanning] = useState(false);
  const panRef = useRef({ startX: 0, startY: 0, vpX: 0, vpY: 0 });

  // Wheel zoom toward cursor
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    setVp(v => {
      const ns = Math.min(Math.max(v.scale * factor, 0.25), 5);
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

  // Pan: drag on background
  const onBgMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    panRef.current = { startX: e.clientX, startY: e.clientY, vpX: vp.x, vpY: vp.y };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - panRef.current.startX;
    const dy = e.clientY - panRef.current.startY;
    setVp(v => ({ ...v, x: panRef.current.vpX + dx, y: panRef.current.vpY + dy }));
  };

  const onMouseUp = () => setIsPanning(false);

  // Keyboard shortcuts
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === '0') setVp(DEFAULT_VP);
      if (e.key === '+' || e.key === '=') setVp(v => ({ ...v, scale: Math.min(v.scale * 1.2, 5) }));
      if (e.key === '-') setVp(v => ({ ...v, scale: Math.max(v.scale / 1.2, 0.25) }));
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // Fit to view
  const fitView = () => setVp(DEFAULT_VP);

  const zoomIn  = () => setVp(v => ({ ...v, scale: Math.min(v.scale * 1.25, 5) }));
  const zoomOut = () => setVp(v => ({ ...v, scale: Math.max(v.scale / 1.25, 0.25) }));

  // Get order/reservation data for a table
  const getOrder = (tableId: string) =>
    mockOrders.find(o => o.tableId === tableId && o.status !== 'closed' && o.status !== 'cancelled');
  const getReservation = (resId?: string) =>
    resId ? mockReservations.find(r => r.id === resId) : undefined;
  const getMinutes = (openedAt?: string) => {
    if (!openedAt) return undefined;
    const [h, m] = openedAt.split(':').map(Number);
    const now = new Date();
    return (now.getHours() - h) * 60 + (now.getMinutes() - m);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-stone-200" style={{ overflow: 'hidden', minHeight: 500 }}>
      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
        <button onClick={zoomIn}
          className="w-8 h-8 bg-white border border-stone-200 rounded-lg shadow flex items-center justify-center hover:bg-stone-50 transition-colors text-stone-600">
          <ZoomIn size={14} />
        </button>
        <button onClick={zoomOut}
          className="w-8 h-8 bg-white border border-stone-200 rounded-lg shadow flex items-center justify-center hover:bg-stone-50 transition-colors text-stone-600">
          <ZoomOut size={14} />
        </button>
        <button onClick={fitView}
          className="w-8 h-8 bg-white border border-stone-200 rounded-lg shadow flex items-center justify-center hover:bg-stone-50 transition-colors text-stone-600">
          <Maximize2 size={14} />
        </button>
        <div className="bg-white border border-stone-200 rounded-lg shadow px-1.5 py-1 text-center">
          <span className="text-xs text-stone-500 font-medium">{Math.round(vp.scale * 100)}%</span>
        </div>
      </div>

      {/* Hint */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/80 backdrop-blur-sm text-xs text-stone-400 px-2.5 py-1.5 rounded-lg border border-stone-200 select-none">
        Колесо — zoom · Drag — pan · Нажмите 0 — сброс
      </div>

      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{ cursor: isPanning ? 'grabbing' : 'grab', userSelect: 'none', display: 'block', minHeight: 500 }}
        onMouseDown={onBgMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* Pattern defs */}
        <FloorPatternDefs />

        {/* Transformed world */}
        <g transform={`translate(${vp.x},${vp.y}) scale(${vp.scale})`}>
          {/* Layer 1+2: Room background (premises + zones) */}
          <RoomBackground zones={zones} activeZoneId={activeZone !== 'all' ? activeZone : undefined} />

          {/* Layer 3+4: Tables (furniture + working info) */}
          {tables.map(table => {
            const order = getOrder(table.id);
            const res = getReservation(table.reservationId);
            return (
              <TableVisual
                key={table.id}
                table={table}
                isSelected={selectedId === table.id}
                onClick={t => { if (!isPanning) onTableClick(t); }}
                orderTotal={order?.total}
                reservationTime={res?.time}
                minutesOccupied={getMinutes(table.openedAt)}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

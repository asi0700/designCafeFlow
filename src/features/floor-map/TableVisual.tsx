import React from 'react';
import type { CafeTable, TableStatus } from '../../types';
import { formatCurrency } from '../../utils/formatters';

// ─── Status configuration ────────────────────────────────────────────────────
const STATUS_RING: Record<TableStatus, string> = {
  free: 'transparent',
  reserved: '#3b82f6',
  waiting: '#fbbf24',
  occupied: '#f59e0b',
  waiting_payment: '#f97316',
  needs_cleaning: '#f43f5e',
};

const STATUS_BADGE_BG: Record<TableStatus, string> = {
  free: '#22c55e',
  reserved: '#3b82f6',
  waiting: '#fbbf24',
  occupied: '#f59e0b',
  waiting_payment: '#f97316',
  needs_cleaning: '#f43f5e',
};

const STATUS_LABEL: Record<TableStatus, string> = {
  free: 'Свободен',
  reserved: 'Бронь',
  waiting: 'Ожидает',
  occupied: 'Занят',
  waiting_payment: 'Оплата',
  needs_cleaning: 'Уборка',
};

const STATUS_ICON: Record<TableStatus, string> = {
  free: '✓',
  reserved: '◷',
  waiting: '⌛',
  occupied: '●',
  waiting_payment: '💳',
  needs_cleaning: '🧹',
};

// ─── Material colours ─────────────────────────────────────────────────────────
const MATERIAL_COLORS: Record<string, { surface: [string, string]; edge: string; grain: string }> = {
  wood_light: { surface: ['#d4a06a', '#c08848'], edge: '#a06830', grain: '#b87840' },
  wood_dark:  { surface: ['#8b5e3c', '#7a4f2d'], edge: '#5c3820', grain: '#6b4828' },
  stone:      { surface: ['#d4ccc0', '#c4bcb0'], edge: '#a09888', grain: '#bcb4a8' },
  white:      { surface: ['#f0eeea', '#e4e0da'], edge: '#c8c4bc', grain: '#dcdad4' },
};

// ─── Chair component ──────────────────────────────────────────────────────────
interface ChairProps {
  cx: number; cy: number; angle: number; size?: number;
}

export function TableChair({ cx, cy, angle, size = 18 }: ChairProps) {
  const w = size, hSeat = size * 0.8, hBack = size * 0.35;
  return (
    <g transform={`translate(${cx},${cy}) rotate(${angle})`}>
      <rect x={-w / 2} y={-hSeat / 2 - hBack * 0.4} width={w} height={hBack + 1} rx={3}
        fill="#b8a898" stroke="#9a8878" strokeWidth={0.8} />
      <rect x={-w / 2} y={-hSeat / 2 + hBack * 0.5} width={w} height={hSeat} rx={3}
        fill="#d4c8b8" stroke="#b8a898" strokeWidth={0.8} />
    </g>
  );
}

// ─── Chair position helpers ───────────────────────────────────────────────────
interface ChairPos { cx: number; cy: number; angle: number }

function chairsForRound(cx: number, cy: number, r: number, seats: number): ChairPos[] {
  const radius = r + 20;
  return Array.from({ length: seats }, (_, i) => {
    const angle = (i / seats) * 2 * Math.PI - Math.PI / 2;
    return {
      cx: cx + radius * Math.cos(angle),
      cy: cy + radius * Math.sin(angle),
      angle: (angle * 180 / Math.PI) + 90,
    };
  });
}

function chairsForRect(x: number, y: number, w: number, h: number, seats: number): ChairPos[] {
  const result: ChairPos[] = [];
  const gap = 22;
  // distribute on top/bottom; for > 4 seats, add sides
  const perSide = Math.max(1, Math.ceil(seats / 2));
  const top = Math.ceil(seats / 2);
  const bottom = seats - top;

  for (let i = 0; i < top; i++) {
    result.push({
      cx: x + (w / (top + 1)) * (i + 1),
      cy: y - gap,
      angle: 180,
    });
  }
  for (let i = 0; i < bottom; i++) {
    result.push({
      cx: x + (w / (bottom + 1)) * (i + 1),
      cy: y + h + gap,
      angle: 0,
    });
  }
  if (seats > 6) {
    result.push({ cx: x - gap, cy: y + h / 2, angle: 90 });
    result.push({ cx: x + w + gap, cy: y + h / 2, angle: -90 });
  }
  return result;
}

// ─── Main TableVisual component ───────────────────────────────────────────────
interface TableVisualProps {
  table: CafeTable;
  isSelected: boolean;
  onClick: (table: CafeTable) => void;
  orderTotal?: number;
  reservationTime?: string;
  minutesOccupied?: number;
}

export function TableVisual({
  table, isSelected, onClick, orderTotal, reservationTime, minutesOccupied,
}: TableVisualProps) {
  const { position: { x, y }, width: w, height: h, shape, seats, status, number, guestCount } = table;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const isRound = shape === 'round' || shape === 'bar';
  const r = Math.min(w, h) / 2;

  const mat = MATERIAL_COLORS[table.material ?? 'wood_light'];
  const ringColor = STATUS_RING[status];
  const showRing = status !== 'free';
  const showInfo = status === 'occupied' || status === 'waiting_payment';

  const chairList = isRound
    ? chairsForRound(cx, cy, r, seats)
    : chairsForRect(x, y, w, h, seats);

  const gradId = `tbl-wood-${table.id}`;
  const clipId = `tbl-clip-${table.id}`;

  return (
    <g
      onClick={e => { e.stopPropagation(); onClick(table); }}
      style={{ cursor: 'pointer' }}
      className="table-visual-group"
    >
      {/* Defs (per-table gradient + clip) */}
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={mat.surface[0]} />
          <stop offset="50%" stopColor={mat.surface[1]} />
          <stop offset="100%" stopColor={mat.surface[0]} />
        </linearGradient>
        {isRound
          ? <clipPath id={clipId}><circle cx={cx} cy={cy} r={r - 2} /></clipPath>
          : <clipPath id={clipId}><rect x={x + 2} y={y + 2} width={w - 4} height={h - 4} rx={7} /></clipPath>
        }
      </defs>

      {/* Chairs (behind table) */}
      {chairList.map((c, i) => <TableChair key={i} {...c} />)}

      {/* Table drop shadow */}
      {isRound
        ? <circle cx={cx + 3} cy={cy + 4} r={r} fill="rgba(0,0,0,0.12)" />
        : <rect x={x + 3} y={y + 4} width={w} height={h} rx={8} fill="rgba(0,0,0,0.12)" />
      }

      {/* Status ring (behind table surface) */}
      {showRing && (isRound
        ? <circle cx={cx} cy={cy} r={r + 5} fill="none" stroke={ringColor} strokeWidth={3.5} opacity={0.7} />
        : <rect x={x - 5} y={y - 5} width={w + 10} height={h + 10} rx={12} fill="none" stroke={ringColor} strokeWidth={3.5} opacity={0.7} />
      )}

      {/* Table surface */}
      {isRound
        ? <circle cx={cx} cy={cy} r={r} fill={`url(#${gradId})`} stroke={mat.edge} strokeWidth={2} />
        : <rect x={x} y={y} width={w} height={h} rx={8} fill={`url(#${gradId})`} stroke={mat.edge} strokeWidth={2} />
      }

      {/* Wood grain lines */}
      <g clipPath={`url(#${clipId})`} opacity={0.06}>
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i}
            x1={cx - 80} y1={cy - 70 + i * 18} x2={cx + 80} y2={cy - 60 + i * 18}
            stroke={mat.grain} strokeWidth={4}
          />
        ))}
      </g>

      {/* Table surface highlight */}
      {isRound
        ? <circle cx={cx - r * 0.2} cy={cy - r * 0.2} r={r * 0.4} fill="rgba(255,255,255,0.12)" />
        : <ellipse cx={cx - w * 0.1} cy={cy - h * 0.1} rx={w * 0.3} ry={h * 0.2} fill="rgba(255,255,255,0.12)" />
      }

      {/* Selected ring */}
      {isSelected && (isRound
        ? <circle cx={cx} cy={cy} r={r + 9} fill="none" stroke="#1e40af" strokeWidth={2.5} strokeDasharray="5 3" />
        : <rect x={x - 9} y={y - 9} width={w + 18} height={h + 18} rx={14} fill="none" stroke="#1e40af" strokeWidth={2.5} strokeDasharray="5 3" />
      )}

      {/* Table number */}
      <text x={cx} y={showInfo ? cy - 12 : cy + 4}
        textAnchor="middle" dominantBaseline="middle"
        fontSize={12} fontWeight={700} fill="rgba(255,255,255,0.95)"
        style={{ pointerEvents: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
      >
        {number}
      </text>

      {/* Occupied info */}
      {showInfo && guestCount && (
        <>
          <text x={cx} y={cy + 2} textAnchor="middle" dominantBaseline="middle"
            fontSize={10} fill="rgba(255,255,255,0.9)" style={{ pointerEvents: 'none' }}
          >
            {guestCount}/{seats} чел.
          </text>
          {minutesOccupied && (
            <text x={cx} y={cy + 14} textAnchor="middle" dominantBaseline="middle"
              fontSize={9} fill="rgba(255,255,255,0.75)" style={{ pointerEvents: 'none' }}
            >
              {minutesOccupied} мин
            </text>
          )}
          {orderTotal && (
            <text x={cx} y={cy + 25} textAnchor="middle" dominantBaseline="middle"
              fontSize={9} fontWeight={700} fill="rgba(255,255,255,0.9)" style={{ pointerEvents: 'none' }}
            >
              {formatCurrency(orderTotal)}
            </text>
          )}
        </>
      )}

      {/* Status badge (top-right) */}
      {status !== 'free' && (
        <g>
          {isRound
            ? <circle cx={cx + r - 2} cy={cy - r + 2} r={10} fill={STATUS_BADGE_BG[status]} />
            : <circle cx={x + w - 6} cy={y + 6} r={10} fill={STATUS_BADGE_BG[status]} />
          }
          <text
            x={isRound ? cx + r - 2 : x + w - 6}
            y={isRound ? cy - r + 2 : y + 6}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={9} fill="white" style={{ pointerEvents: 'none' }}
          >
            {STATUS_ICON[status]}
          </text>
        </g>
      )}

      {/* Free green dot */}
      {status === 'free' && (
        <circle
          cx={isRound ? cx + r - 4 : x + w - 8}
          cy={isRound ? cy - r + 4 : y + 8}
          r={6} fill="#22c55e" stroke="white" strokeWidth={1.5}
        />
      )}

      {/* Reservation badge */}
      {status === 'reserved' && reservationTime && (
        <g>
          <rect x={cx - 22} y={cy + (isRound ? r - 6 : h / 2 - 8)} width={44} height={16} rx={8} fill="#3b82f6" />
          <text x={cx} y={cy + (isRound ? r + 2 : h / 2)} textAnchor="middle" dominantBaseline="middle"
            fontSize={9} fontWeight={700} fill="white" style={{ pointerEvents: 'none' }}
          >
            {reservationTime}
          </text>
        </g>
      )}
    </g>
  );
}

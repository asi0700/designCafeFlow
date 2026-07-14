import React from 'react';
import type { Zone } from '../../types';

// ─── SVG pattern definitions ──────────────────────────────────────────────────
export function FloorPatternDefs() {
  return (
    <defs>
      {/* Light wood planks */}
      <pattern id="pat_wood_light" width={60} height={12} patternUnits="userSpaceOnUse">
        <rect width={60} height={12} fill="#e8d5b0" />
        <rect x={1} y={1} width={57} height={10} rx={1} fill="#dfc9a0" />
        <line x1={0} y1={0} x2={0} y2={12} stroke="#c8b488" strokeWidth={1.2} />
        <line x1={0} y1={6} x2={60} y2={6} stroke="rgba(180,140,80,0.08)" strokeWidth={0.5} />
      </pattern>
      {/* Dark wood */}
      <pattern id="pat_wood_dark" width={50} height={10} patternUnits="userSpaceOnUse">
        <rect width={50} height={10} fill="#b8845a" />
        <rect x={1} y={1} width={47} height={8} rx={1} fill="#a87848" />
        <line x1={0} y1={0} x2={0} y2={10} stroke="#886030" strokeWidth={1.2} />
      </pattern>
      {/* Tile */}
      <pattern id="pat_tile" width={32} height={32} patternUnits="userSpaceOnUse">
        <rect width={32} height={32} fill="#d8d4cc" />
        <rect x={1} y={1} width={29} height={29} rx={1} fill="#e4e0d8" />
        <rect x={0} y={0} width={32} height={32} fill="none" stroke="#c8c4bc" strokeWidth={0.8} />
      </pattern>
      {/* Carpet */}
      <pattern id="pat_carpet" width={8} height={8} patternUnits="userSpaceOnUse">
        <rect width={8} height={8} fill="#c8bab0" />
        <circle cx={4} cy={4} r={1.2} fill="#b8aa9e" />
      </pattern>
      {/* Concrete / utility */}
      <pattern id="pat_concrete" width={40} height={40} patternUnits="userSpaceOnUse">
        <rect width={40} height={40} fill="#d0ccc8" />
        <line x1={0} y1={0} x2={40} y2={0} stroke="#c0bcb8" strokeWidth={0.5} />
        <line x1={0} y1={0} x2={0} y2={40} stroke="#c0bcb8" strokeWidth={0.5} />
      </pattern>
    </defs>
  );
}

const PATTERN_IDS: Record<Zone['floorPattern'], string> = {
  wood_light: 'pat_wood_light',
  wood_dark: 'pat_wood_dark',
  tile: 'pat_tile',
  carpet: 'pat_carpet',
  concrete: 'pat_concrete',
};

// ─── Room constants ───────────────────────────────────────────────────────────
// Main building outline
const ROOM_X = 20, ROOM_Y = 20, ROOM_W = 820, ROOM_H = 640;
const WALL_THICKNESS = 18;

// Pre-defined architectural elements
const WINDOWS = [
  { x: 80, y: ROOM_Y, width: 100 },
  { x: 230, y: ROOM_Y, width: 100 },
  { x: 380, y: ROOM_Y, width: 100 },
  { x: 530, y: ROOM_Y, width: 100 },
];

const ENTRANCE = { x: 120, y: ROOM_Y + ROOM_H - WALL_THICKNESS, width: 90 };

const STRUCTURAL = [
  // Kitchen area (back right)
  { label: 'Кухня', x: 630, y: ROOM_Y + WALL_THICKNESS, w: ROOM_W - 630 - WALL_THICKNESS, h: 210, fill: '#d4d0cc', stroke: '#b8b4b0' },
  // Staff/utility (bottom right)
  { label: 'Туалет', x: 630, y: 480, w: 100, h: 90, fill: '#cdd4d8', stroke: '#aeb8bc' },
  { label: 'Касса', x: 740, y: 480, w: 100, h: 90, fill: '#d8d4cc', stroke: '#b8b0a8' },
];

// ─── Component ────────────────────────────────────────────────────────────────
interface RoomBackgroundProps {
  zones: Zone[];
  activeZoneId?: string;
}

export function RoomBackground({ zones, activeZoneId }: RoomBackgroundProps) {
  const innerX = ROOM_X + WALL_THICKNESS;
  const innerY = ROOM_Y + WALL_THICKNESS;
  const innerW = ROOM_W - WALL_THICKNESS * 2;
  const innerH = ROOM_H - WALL_THICKNESS * 2;

  return (
    <g>
      {/* ── Outer wall fill (stone) ─────────────────────────────────── */}
      <rect x={ROOM_X} y={ROOM_Y} width={ROOM_W} height={ROOM_H} rx={4}
        fill="#b0a898" stroke="#8a7e70" strokeWidth={2} />

      {/* ── Interior default floor ───────────────────────────────────── */}
      <rect x={innerX} y={innerY} width={innerW} height={innerH}
        fill="url(#pat_wood_light)" />

      {/* ── Zone floors ──────────────────────────────────────────────── */}
      {zones.filter(z => z.isActive).map(zone => (
        <g key={zone.id}>
          <rect
            x={zone.x} y={zone.y} width={zone.width} height={zone.height}
            fill={`url(#${PATTERN_IDS[zone.floorPattern]})`}
            opacity={activeZoneId && activeZoneId !== zone.id ? 0.5 : 1}
          />
          {/* Zone tint overlay */}
          <rect
            x={zone.x} y={zone.y} width={zone.width} height={zone.height}
            fill={zone.color} opacity={0.06}
          />
          {/* Zone border (subtle) */}
          <rect
            x={zone.x} y={zone.y} width={zone.width} height={zone.height}
            fill="none" stroke={zone.color} strokeWidth={1.5} strokeDasharray="6 4" opacity={0.35}
          />
          {/* Zone label */}
          <text
            x={zone.x + 10} y={zone.y + 18}
            fontSize={11} fontWeight={600}
            fill={zone.color} opacity={activeZoneId && activeZoneId !== zone.id ? 0.4 : 0.8}
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            {zone.name.toUpperCase()}
          </text>
        </g>
      ))}

      {/* ── Structural elements ──────────────────────────────────────── */}
      {STRUCTURAL.map(el => (
        <g key={el.label}>
          <rect x={el.x} y={el.y} width={el.w} height={el.h}
            fill="url(#pat_concrete)" stroke={el.stroke} strokeWidth={1.5} />
          <rect x={el.x} y={el.y} width={el.w} height={el.h}
            fill={el.fill} opacity={0.4} />
          <text x={el.x + el.w / 2} y={el.y + el.h / 2}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={11} fontWeight={600} fill="#78716c" opacity={0.9}
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            {el.label}
          </text>
        </g>
      ))}

      {/* ── Outer wall stroke (on top) ───────────────────────────────── */}
      <rect x={ROOM_X} y={ROOM_Y} width={ROOM_W} height={ROOM_H} rx={4}
        fill="none" stroke="#6b5e50" strokeWidth={WALL_THICKNESS} />

      {/* ── Windows ──────────────────────────────────────────────────── */}
      {WINDOWS.map((win, i) => (
        <g key={i}>
          {/* Window opening cutout */}
          <rect x={win.x} y={ROOM_Y - 1} width={win.width} height={WALL_THICKNESS + 2}
            fill="#c8e8f4" stroke="#a0c8e0" strokeWidth={1} />
          {/* Window frame lines */}
          <line x1={win.x + win.width / 3} y1={ROOM_Y} x2={win.x + win.width / 3} y2={ROOM_Y + WALL_THICKNESS}
            stroke="#a0c8e0" strokeWidth={1} />
          <line x1={win.x + (win.width * 2) / 3} y1={ROOM_Y} x2={win.x + (win.width * 2) / 3} y2={ROOM_Y + WALL_THICKNESS}
            stroke="#a0c8e0" strokeWidth={1} />
          {/* Window label */}
          <text x={win.x + win.width / 2} y={ROOM_Y + WALL_THICKNESS / 2 + 1}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={7} fill="#5b9ab4" style={{ pointerEvents: 'none', userSelect: 'none' }}>
            окно
          </text>
        </g>
      ))}

      {/* ── Entrance door ─────────────────────────────────────────────── */}
      <rect x={ENTRANCE.x} y={ENTRANCE.y} width={ENTRANCE.width} height={WALL_THICKNESS + 4}
        fill="#f4e8d0" stroke="#c8a870" strokeWidth={1} />
      {/* Door arc indicator */}
      <path d={`M ${ENTRANCE.x + ENTRANCE.width / 2} ${ENTRANCE.y} L ${ENTRANCE.x + ENTRANCE.width} ${ENTRANCE.y} A ${ENTRANCE.width / 2} ${ENTRANCE.width / 2} 0 0 0 ${ENTRANCE.x + ENTRANCE.width / 2} ${ENTRANCE.y + ENTRANCE.width / 2}`}
        fill="rgba(200,168,112,0.2)" stroke="#c8a870" strokeWidth={1} strokeDasharray="3 2" />
      <text x={ENTRANCE.x + ENTRANCE.width / 2} y={ENTRANCE.y + WALL_THICKNESS / 2 + 1}
        textAnchor="middle" dominantBaseline="middle"
        fontSize={7} fill="#a07840" style={{ pointerEvents: 'none', userSelect: 'none' }}>
        вход
      </text>

      {/* ── Interior wall between main hall and kitchen/bar ─────────── */}
      <line x1={630} y1={innerY} x2={630} y2={innerY + innerH}
        stroke="#9a8e80" strokeWidth={8} />

      {/* ── Door opening from main hall to bar ────────────────────────── */}
      <rect x={626} y={260} width={8} height={70}
        fill="#f4e8d0" stroke="none" />

      {/* ── Passage from main hall to terrace ─────────────────────────── */}
      <rect x={innerX} y={460} width={innerW - 190} height={22}
        fill="url(#pat_wood_light)" />

      {/* ── Floor grid reference (very subtle) ───────────────────────── */}
    </g>
  );
}

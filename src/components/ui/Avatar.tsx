import React from 'react';
import { getInitials } from '../../utils/formatters';

interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const colorPalette = [
  'bg-amber-200 text-amber-800',
  'bg-teal-200 text-teal-800',
  'bg-blue-200 text-blue-800',
  'bg-rose-200 text-rose-800',
  'bg-violet-200 text-violet-800',
  'bg-green-200 text-green-800',
  'bg-orange-200 text-orange-800',
];

function getColor(name: string): string {
  const idx = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colorPalette.length;
  return colorPalette[idx];
}

export function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  return (
    <div className={`${sizeClasses[size]} ${getColor(name)} rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${className}`}>
      {getInitials(name)}
    </div>
  );
}

import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'amber' | 'teal';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-stone-100 text-stone-600',
  success: 'bg-teal-50 text-teal-700 border border-teal-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  danger: 'bg-rose-50 text-rose-600 border border-rose-200',
  info: 'bg-blue-50 text-blue-700 border border-blue-200',
  amber: 'bg-amber-100 text-amber-800',
  teal: 'bg-teal-100 text-teal-800',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-stone-400',
  success: 'bg-teal-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  info: 'bg-blue-500',
  amber: 'bg-amber-500',
  teal: 'bg-teal-500',
};

export function Badge({ children, variant = 'default', size = 'md', dot = false, className = '' }: BadgeProps) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5 rounded-full gap-1' : 'text-xs px-2.5 py-1 rounded-full gap-1.5';
  return (
    <span className={`inline-flex items-center font-medium ${variantClasses[variant]} ${sizeClass} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}

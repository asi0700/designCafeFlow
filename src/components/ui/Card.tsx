import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className = '', onClick, hover = false, padding = 'md' }: CardProps) {
  const padClass = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-6' }[padding];
  return (
    <div
      className={`bg-white rounded-2xl border border-stone-100 shadow-sm ${padClass} ${hover ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="font-semibold text-stone-900 text-base leading-tight">{title}</h3>
        {subtitle && <p className="text-stone-500 text-sm mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

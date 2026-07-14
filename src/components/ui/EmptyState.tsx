import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && <div className="mb-4 text-stone-300">{icon}</div>}
      <h3 className="font-semibold text-stone-700 text-lg">{title}</h3>
      {description && <p className="text-stone-500 text-sm mt-1.5 max-w-xs leading-relaxed">{description}</p>}
      {action && (
        <Button variant="outline" size="sm" className="mt-5" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Произошла ошибка при загрузке данных', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mb-4">
        <AlertCircle className="text-rose-500" size={24} />
      </div>
      <h3 className="font-semibold text-stone-700">Что-то пошло не так</h3>
      <p className="text-stone-500 text-sm mt-1.5 max-w-xs">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" icon={<RefreshCw size={14} />} className="mt-5" onClick={onRetry}>
          Попробовать снова
        </Button>
      )}
    </div>
  );
}

export function ConfirmDialog({
  isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Удалить', variant = 'danger',
}: {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  variant?: 'danger' | 'primary';
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-scale-in" onClick={e => e.stopPropagation()}>
        <h3 className="font-semibold text-stone-900 text-lg">{title}</h3>
        <p className="text-stone-600 text-sm mt-2 leading-relaxed">{message}</p>
        <div className="flex gap-3 mt-5 justify-end">
          <Button variant="outline" size="sm" onClick={onCancel}>Отмена</Button>
          <Button variant={variant} size="sm" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

import { createContext, useContext } from 'react';
import type { Toast } from './useToast';

interface ToastContextValue {
  addToast: (message: string, type?: Toast['type'], duration?: number) => void;
}

export const ToastContext = createContext<ToastContextValue>({ addToast: () => {} });

export function useAppToast() {
  return useContext(ToastContext);
}

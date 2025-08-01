import * as React from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  onClose?: () => void;
}

export function Toast({ title, description, variant = 'default', onClose }: ToastProps) {
  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 flex w-full max-w-sm items-center space-x-4 rounded-lg p-4 shadow-lg transition-all',
        variant === 'default' && 'bg-white text-gray-900 border border-gray-200',
        variant === 'destructive' && 'bg-red-50 text-red-900 border border-red-200',
      )}
    >
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="inline-flex h-6 w-6 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

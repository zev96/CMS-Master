import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';
export function Toast({ title, description, variant = 'default', onClose }) {
  return _jsxs('div', {
    className: cn(
      'fixed bottom-4 right-4 z-50 flex w-full max-w-sm items-center space-x-4 rounded-lg p-4 shadow-lg transition-all',
      variant === 'default' && 'bg-white text-gray-900 border border-gray-200',
      variant === 'destructive' && 'bg-red-50 text-red-900 border border-red-200',
    ),
    children: [
      _jsxs('div', {
        className: 'flex-1',
        children: [
          _jsx('h3', { className: 'font-medium', children: title }),
          description &&
            _jsx('p', { className: 'mt-1 text-sm text-gray-500', children: description }),
        ],
      }),
      onClose &&
        _jsx('button', {
          onClick: onClose,
          className:
            'inline-flex h-6 w-6 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100',
          children: _jsx(X, { className: 'h-4 w-4' }),
        }),
    ],
  });
}

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ className, children, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div ref={dropdownRef} className={cn('relative inline-block text-left', className)} {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          if (child.type === DropdownMenuTrigger) {
            return React.cloneElement(child as React.ReactElement<any>, {
              onClick: toggleOpen,
              'aria-expanded': isOpen,
            });
          }
          if (child.type === DropdownMenuContent) {
            return React.cloneElement(child as React.ReactElement<any>, {
              isOpen,
              onClose: () => setIsOpen(false),
            });
          }
        }
        return child;
      })}
    </div>
  );
};

interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  className,
  children,
  ...props
}) => (
  <button
    className={cn(
      'inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors',
      className,
    )}
    {...props}
  >
    {children}
  </button>
);

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
  isOpen?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  className,
  align = 'start',
  isOpen = false,
  onClose,
  children,
  ...props
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-gray-900 shadow-md animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2',
        align === 'end' && 'right-0',
        align === 'center' && 'left-1/2 -translate-x-1/2',
        align === 'start' && 'left-0',
        'top-full mt-1',
        className,
      )}
      {...props}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === DropdownMenuItem) {
          return React.cloneElement(child as React.ReactElement<any>, {
            onClick: (e: React.MouseEvent) => {
              if (child.props.onClick) {
                child.props.onClick(e);
              }
              onClose?.();
            },
          });
        }
        return child;
      })}
    </div>
  );
};

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  children: React.ReactNode;
}

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  className,
  disabled,
  children,
  ...props
}) => (
  <div
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100',
      disabled && 'pointer-events-none opacity-50',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

const DropdownMenuSeparator: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn('-mx-1 my-1 h-px bg-gray-200', className)} {...props} />;

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
};

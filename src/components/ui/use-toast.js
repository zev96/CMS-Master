import { useState, useCallback } from 'react';
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const toast = useCallback(options => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      id,
      title: options.title,
      description: options.description,
      variant: options.variant || 'default',
      duration: options.duration || 3000,
    };
    setToasts(prev => [...prev, newToast]);
    // 自动移除
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, newToast.duration);
    return id;
  }, []);
  return {
    toast,
    toasts,
    dismiss: id => setToasts(prev => prev.filter(t => t.id !== id)),
  };
}

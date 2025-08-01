import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Calendar, User, Plus, Settings, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';
const Topbar = ({ className }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const currentDate = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
  const handleSearchChange = e => {
    setSearchQuery(e.target.value);
  };
  const handleNewContent = () => {
    // 创建新内容的逻辑
    console.log('Creating new content...');
  };
  return _jsxs('header', {
    className: cn(
      'w-full h-16 bg-background border-b border-border flex items-center justify-between px-6',
      className,
    ),
    children: [
      _jsx('div', {
        className: 'flex items-center space-x-4 flex-1',
        children: _jsxs('div', {
          className: 'relative max-w-md w-full',
          children: [
            _jsx(Search, {
              className:
                'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground',
            }),
            _jsx(Input, {
              type: 'text',
              placeholder: '\u641C\u7D22\u4EA7\u54C1\u3001\u6A21\u677F\u6216\u7D20\u6750...',
              value: searchQuery,
              onChange: handleSearchChange,
              className: 'pl-10 w-full',
            }),
          ],
        }),
      }),
      _jsxs('div', {
        className: 'flex items-center space-x-4',
        children: [
          _jsxs('div', {
            className: 'hidden md:flex items-center space-x-2 text-sm text-muted-foreground',
            children: [
              _jsx(Calendar, { className: 'w-4 h-4' }),
              _jsx('span', { children: currentDate }),
            ],
          }),
          _jsxs(Button, {
            variant: 'ghost',
            size: 'icon',
            className: 'relative',
            children: [
              _jsx(Bell, { className: 'w-5 h-5' }),
              _jsx('span', {
                className:
                  'absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full flex items-center justify-center',
                children: _jsx('span', {
                  className: 'text-xs text-destructive-foreground',
                  children: '2',
                }),
              }),
            ],
          }),
          _jsx(motion.div, {
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            children: _jsxs(Button, {
              onClick: handleNewContent,
              className: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg',
              children: [_jsx(Plus, { className: 'w-4 h-4 mr-2' }), '\u65B0\u5EFA'],
            }),
          }),
          _jsxs('div', {
            className: 'relative',
            children: [
              _jsx(Button, {
                variant: 'ghost',
                size: 'icon',
                onClick: () => setShowUserMenu(!showUserMenu),
                className: 'rounded-full',
                children: _jsx('div', {
                  className: 'w-8 h-8 bg-primary rounded-full flex items-center justify-center',
                  children: _jsx(User, { className: 'w-4 h-4 text-primary-foreground' }),
                }),
              }),
              showUserMenu &&
                _jsxs(motion.div, {
                  initial: { opacity: 0, y: -10 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -10 },
                  transition: { duration: 0.2 },
                  className:
                    'absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-50',
                  children: [
                    _jsxs('div', {
                      className: 'p-3 border-b border-border',
                      children: [
                        _jsx('p', { className: 'font-medium', children: '\u7528\u6237' }),
                        _jsx('p', {
                          className: 'text-sm text-muted-foreground',
                          children: 'user@example.com',
                        }),
                      ],
                    }),
                    _jsxs('div', {
                      className: 'p-1',
                      children: [
                        _jsxs(Button, {
                          variant: 'ghost',
                          className: 'w-full justify-start h-9 px-3',
                          onClick: () => setShowUserMenu(false),
                          children: [_jsx(Settings, { className: 'w-4 h-4 mr-2' }), '\u8BBE\u7F6E'],
                        }),
                        _jsxs(Button, {
                          variant: 'ghost',
                          className: 'w-full justify-start h-9 px-3',
                          onClick: () => setShowUserMenu(false),
                          children: [
                            _jsx(HelpCircle, { className: 'w-4 h-4 mr-2' }),
                            '\u5E2E\u52A9',
                          ],
                        }),
                        _jsx('hr', { className: 'my-1' }),
                        _jsxs(Button, {
                          variant: 'ghost',
                          className:
                            'w-full justify-start h-9 px-3 text-destructive hover:text-destructive',
                          onClick: () => setShowUserMenu(false),
                          children: [
                            _jsx(LogOut, { className: 'w-4 h-4 mr-2' }),
                            '\u9000\u51FA\u767B\u5F55',
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
            ],
          }),
        ],
      }),
      showUserMenu &&
        _jsx('div', { className: 'fixed inset-0 z-40', onClick: () => setShowUserMenu(false) }),
    ],
  });
};
export default Topbar;

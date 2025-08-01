import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { motion } from 'framer-motion';
import {
  Database,
  FileText,
  PenTool,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Archive,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import useAppStore from '../../stores/useAppStore';
const sidebarItems = [
  {
    id: 'products',
    label: '产品资料库',
    icon: Database,
    description: '管理产品信息',
  },
  {
    id: 'templates',
    label: '文章模板库',
    icon: FileText,
    description: '文章结构规划',
  },
  {
    id: 'assets',
    label: '素材资产库',
    icon: Archive,
    description: '素材管理',
  },
  {
    id: 'comparison',
    label: '数据对比库',
    icon: BarChart3,
    description: '产品参数对比图表',
  },
  {
    id: 'editor',
    label: '内容创作',
    icon: PenTool,
    description: '文章创作',
  },
];
const Sidebar = () => {
  const { currentModule, sidebarCollapsed, actions } = useAppStore();
  const handleModuleSelect = moduleId => {
    actions.setCurrentModule(moduleId);
  };
  const toggleSidebar = () => {
    actions.toggleSidebar();
  };
  return _jsxs(motion.div, {
    initial: false,
    animate: {
      width: sidebarCollapsed ? 80 : 280,
    },
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
    className: 'relative h-full bg-card border-r border-border flex flex-col',
    children: [
      _jsx('div', {
        className: 'p-4 border-b border-border',
        children: _jsxs('div', {
          className: 'flex items-center justify-between',
          children: [
            !sidebarCollapsed &&
              _jsxs(motion.div, {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
                transition: { duration: 0.2 },
                className: 'flex items-center space-x-2',
                children: [
                  _jsx('div', {
                    className: 'w-8 h-8 bg-primary rounded-lg flex items-center justify-center',
                    children: _jsx(PenTool, { className: 'w-4 h-4 text-primary-foreground' }),
                  }),
                  _jsx('span', {
                    className: 'font-semibold text-lg',
                    children: '\u5185\u5BB9\u521B\u4F5C',
                  }),
                ],
              }),
            _jsx(Button, {
              variant: 'ghost',
              size: 'icon',
              onClick: toggleSidebar,
              className: 'ml-auto',
              children: sidebarCollapsed
                ? _jsx(ChevronRight, { className: 'w-4 h-4' })
                : _jsx(ChevronLeft, { className: 'w-4 h-4' }),
            }),
          ],
        }),
      }),
      _jsx('nav', {
        className: 'flex-1 p-4 space-y-2',
        children: sidebarItems.map(item => {
          const Icon = item.icon;
          const isActive = currentModule === item.id;
          return _jsx(
            motion.div,
            {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              children: _jsxs(Button, {
                variant: isActive ? 'secondary' : 'ghost',
                className: cn(
                  'w-full justify-start h-12 relative',
                  isActive && 'bg-primary/10 text-primary border border-primary/20',
                  sidebarCollapsed && 'justify-center px-0',
                ),
                onClick: () => handleModuleSelect(item.id),
                children: [
                  _jsx(Icon, { className: cn('w-5 h-5', !sidebarCollapsed && 'mr-3') }),
                  !sidebarCollapsed &&
                    _jsxs(motion.div, {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      exit: { opacity: 0 },
                      transition: { duration: 0.2, delay: 0.1 },
                      className: 'flex flex-col items-start flex-1',
                      children: [
                        _jsx('span', { className: 'font-medium', children: item.label }),
                        _jsx('span', {
                          className: 'text-xs text-muted-foreground',
                          children: item.description,
                        }),
                      ],
                    }),
                  isActive &&
                    _jsx(motion.div, {
                      layoutId: 'activeIndicator',
                      className: 'absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full',
                      initial: false,
                      transition: {
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      },
                    }),
                ],
              }),
            },
            item.id,
          );
        }),
      }),
      _jsx('div', {
        className: 'p-4 border-t border-border',
        children:
          !sidebarCollapsed &&
          _jsx(motion.div, {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.2 },
            className: 'text-xs text-muted-foreground text-center',
            children: 'CMS Content Creator v1.0',
          }),
      }),
    ],
  });
};
export default Sidebar;

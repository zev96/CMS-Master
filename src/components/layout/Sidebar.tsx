import React from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  FileText,
  Library,
  PenTool,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Archive,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import useAppStore from '../../stores/useAppStore';
import type { ModuleName } from '../../types';

interface SidebarItem {
  id: ModuleName;
  label: string;
  icon: React.ElementType;
  description: string;
}

const sidebarItems: SidebarItem[] = [
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

const Sidebar: React.FC = () => {
  const { currentModule, sidebarCollapsed, actions } = useAppStore();

  const handleModuleSelect = (moduleId: ModuleName) => {
    actions.setCurrentModule(moduleId);
  };

  const toggleSidebar = () => {
    actions.toggleSidebar();
  };

  return (
    <motion.div
      initial={false}
      animate={{
        width: sidebarCollapsed ? 80 : 280,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
      className="relative h-full bg-card border-r border-border flex flex-col"
    >
      {/* 侧边栏头部 */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <PenTool className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">内容创作</span>
            </motion.div>
          )}

          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map(item => {
          const Icon = item.icon;
          const isActive = currentModule === item.id;

          return (
            <motion.div key={item.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start h-12 relative',
                  isActive && 'bg-primary/10 text-primary border border-primary/20',
                  sidebarCollapsed && 'justify-center px-0',
                )}
                onClick={() => handleModuleSelect(item.id)}
              >
                <Icon className={cn('w-5 h-5', !sidebarCollapsed && 'mr-3')} />

                {!sidebarCollapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="flex flex-col items-start flex-1"
                  >
                    <span className="font-medium">{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </motion.div>
                )}

                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
              </Button>
            </motion.div>
          );
        })}
      </nav>

      {/* 侧边栏底部 */}
      <div className="p-4 border-t border-border">
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-muted-foreground text-center"
          >
            CMS Content Creator v1.0
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Calendar, User, Plus, Settings, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';

interface TopbarProps {
  className?: string;
}

const Topbar: React.FC<TopbarProps> = ({ className }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const currentDate = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleNewContent = () => {
    // 创建新内容的逻辑
    console.log('Creating new content...');
  };

  return (
    <header
      className={cn(
        'w-full h-16 bg-background border-b border-border flex items-center justify-between px-6',
        className,
      )}
    >
      {/* 左侧区域 - 搜索框 */}
      <div className="flex items-center space-x-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="搜索产品、模板或素材..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 w-full"
          />
        </div>
      </div>

      {/* 右侧区域 - 工具栏 */}
      <div className="flex items-center space-x-4">
        {/* 日期显示 */}
        <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{currentDate}</span>
        </div>

        {/* 通知铃铛 */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full flex items-center justify-center">
            <span className="text-xs text-destructive-foreground">2</span>
          </span>
        </Button>

        {/* 新建按钮 */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleNewContent}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            新建
          </Button>
        </motion.div>

        {/* 用户头像和菜单 */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="rounded-full"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
          </Button>

          {/* 用户下拉菜单 */}
          {showUserMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-50"
            >
              <div className="p-3 border-b border-border">
                <p className="font-medium">用户</p>
                <p className="text-sm text-muted-foreground">user@example.com</p>
              </div>

              <div className="p-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-9 px-3"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  设置
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start h-9 px-3"
                  onClick={() => setShowUserMenu(false)}
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  帮助
                </Button>

                <hr className="my-1" />

                <Button
                  variant="ghost"
                  className="w-full justify-start h-9 px-3 text-destructive hover:text-destructive"
                  onClick={() => setShowUserMenu(false)}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  退出登录
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* 点击外部关闭用户菜单 */}
      {showUserMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
      )}
    </header>
  );
};

export default Topbar;

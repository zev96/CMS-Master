import useAppStore from '../stores/useAppStore';
import ReactDOM from 'react-dom/client';

interface AppConfig {
  version: string;
  theme: 'light' | 'dark' | 'auto';
  language: 'zh-CN' | 'en-US';
  autoSave: boolean;
  autoSaveInterval: number; // 分钟
  maxRecentFiles: number;
  enableAnalytics: boolean;
  enableNotifications: boolean;
  dataVersion: string; // 新增：数据版本管理
}

interface AppMetrics {
  startupTime: number;
  lastCrashTime?: number;
  crashCount: number;
  sessionCount: number;
  totalUsageTime: number; // 毫秒
  lastBackupTime?: number;
  performanceIssues: string[];
  dataVersion: string; // 新增：数据版本追踪
  migrationCount: number; // 新增：迁移次数
}

// localStorage 存储键名
const STORAGE_KEYS = {
  CONFIG: 'cms_app_config',
  DATA: 'cms_app_data',
  METRICS: 'cms_app_metrics',
  BACKUP_PREFIX: 'cms_app_backup_',
  DATA_VERSION: 'cms_data_version',
};

// 当前数据版本
const CURRENT_DATA_VERSION = '2.0.0';

export class AppInitializer {
  private defaultConfig: AppConfig = {
    version: '2.0.0',
    theme: 'auto',
    language: 'zh-CN',
    autoSave: true,
    autoSaveInterval: 5,
    maxRecentFiles: 10,
    enableAnalytics: true,
    enableNotifications: true,
    dataVersion: CURRENT_DATA_VERSION,
  };

  async initialize(): Promise<void> {
    try {
      console.log('🚀 智能内容创作平台初始化开始...');
      const startTime = performance.now();

      // 1. 清除可能存在的旧数据格式
      console.log('清理旧数据格式...');
      this.clearLegacyData();

      // 2. 直接初始化数据库（使用新数据结构）
      console.log('初始化数据库...');
      await this.initializeDatabase();

      // 3. 清理可能损坏的图表数据（在数据库初始化之后）
      console.log('清理图表数据...');
      try {
        const store = useAppStore.getState();
        if (store.actions && typeof store.actions.cleanupChartData === 'function') {
          store.actions.cleanupChartData();
        }
      } catch (error) {
        console.warn('清理图表数据时出现警告:', error);
      }

      // 4. 加载配置
      const config = await this.loadConfig();

      // 5. 初始化数据
      await this.initializeData();

      // 6. 设置错误处理
      this.setupErrorHandling();

      // 7. 设置自动保存
      if (config.autoSave) {
        this.setupAutoSave(config.autoSaveInterval);
      }

      // 8. 更新启动指标
      const initTime = performance.now() - startTime;
      await this.updateMetrics({
        startupTime: initTime,
        dataVersion: CURRENT_DATA_VERSION,
        sessionCount: 1,
      });

      console.log(`✅ 应用初始化完成，耗时: ${initTime.toFixed(2)}ms`);
      console.log(`📊 当前数据版本: ${CURRENT_DATA_VERSION}`);
      console.log(`🎉 使用全新数据结构，无需迁移！`);
    } catch (error) {
      console.error('❌ 应用初始化失败:', error);
      await this.handleInitializationError(error);
    }
  }

  // 新增：清除旧数据格式的方法
  private clearLegacyData(): void {
    try {
      // 清除可能存在的旧版本数据标记
      const oldVersionKeys = [
        'cms_data_version',
        'cms_app_data',
        'cms_app_backup_',
        'cms-app-storage', // 旧的 persist 存储键
      ];

      oldVersionKeys.forEach(key => {
        // 清除直接匹配的键
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          console.log(`已清除旧数据键: ${key}`);
        }

        // 清除带前缀的键（如备份文件）
        Object.keys(localStorage).forEach(storageKey => {
          if (storageKey.startsWith(key)) {
            localStorage.removeItem(storageKey);
            console.log(`已清除旧数据键: ${storageKey}`);
          }
        });
      });

      // 设置新的数据版本标记
      localStorage.setItem(STORAGE_KEYS.DATA_VERSION, CURRENT_DATA_VERSION);

      console.log('✅ 旧数据格式清理完成');
    } catch (error) {
      console.warn('清理旧数据时出现警告:', error);
      // 不抛出错误，继续初始化流程
    }
  }

  private async initializeDatabase(): Promise<void> {
    try {
      const store = useAppStore.getState();

      // 始终生成新的示例数据，确保使用最新的数据结构
      console.log('生成全新示例数据...');
      await store.actions.loadDatabase();

      console.log('✅ 数据库初始化完成（使用新数据结构）');
    } catch (error) {
      console.error('数据库初始化失败:', error);
      throw error;
    }
  }

  private async loadConfig(): Promise<AppConfig> {
    try {
      const configString = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (configString) {
        const config = JSON.parse(configString);
        // 合并默认配置，确保新字段存在
        const mergedConfig = { ...this.defaultConfig, ...config };

        // 如果配置版本不匹配，更新配置
        if (mergedConfig.version !== this.defaultConfig.version) {
          mergedConfig.version = this.defaultConfig.version;
          mergedConfig.dataVersion = CURRENT_DATA_VERSION;
          await this.saveConfig(mergedConfig);
        }

        return mergedConfig;
      }
    } catch (error) {
      console.warn('配置文件加载失败，使用默认配置:', error);
    }

    // 创建默认配置
    await this.saveConfig(this.defaultConfig);
    return this.defaultConfig;
  }

  private async saveConfig(config: AppConfig): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config, null, 2));
    } catch (error) {
      console.error('配置文件保存失败:', error);
    }
  }

  private async initializeData(): Promise<void> {
    const store = useAppStore.getState();

    try {
      // 尝试从 localStorage 加载数据
      const dataString = localStorage.getItem(STORAGE_KEYS.DATA);
      if (dataString) {
        try {
          await store.actions.importData(dataString);
          console.log('✅ 本地数据加载成功');
        } catch (importError) {
          console.warn('本地数据格式不兼容，将重新生成:', importError);

          // 备份旧数据
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          localStorage.setItem(`${STORAGE_KEYS.BACKUP_PREFIX}legacy_${timestamp}`, dataString);

          // 重新初始化数据库
          await this.initializeDatabase();
        }
      } else {
        console.log('首次启动，已通过数据库初始化完成数据加载');
      }

      // 保存当前数据状态
      await this.saveCurrentData();
    } catch (error) {
      console.warn('数据加载失败，尝试恢复备份:', error);
      await this.attemptDataRecovery();
    }
  }

  private async saveCurrentData(): Promise<void> {
    try {
      const store = useAppStore.getState();
      const data = await store.actions.exportData();
      localStorage.setItem(STORAGE_KEYS.DATA, data);
      console.log('✅ 当前数据状态已保存');
    } catch (error) {
      console.error('数据保存失败:', error);
    }
  }

  private async attemptDataRecovery(): Promise<void> {
    try {
      // 查找最新的备份
      const backupKeys = Object.keys(localStorage)
        .filter(key => key.startsWith(STORAGE_KEYS.BACKUP_PREFIX))
        .sort()
        .reverse();

      if (backupKeys.length > 0) {
        const shouldRestore = window.confirm(
          '检测到数据加载失败。是否从备份文件恢复数据？\n\n' +
            '选择"确定"将恢复最近的备份数据\n' +
            '选择"取消"将使用默认示例数据',
        );

        if (shouldRestore) {
          const latestBackupKey = backupKeys[0];
          const backupData = localStorage.getItem(latestBackupKey);

          if (backupData) {
            const store = useAppStore.getState();
            await store.actions.importData(backupData);
            console.log('✅ 数据恢复成功');

            window.alert('数据已从备份成功恢复！');
            return;
          }
        }
      }

      // 没有备份或用户选择不恢复，重新初始化数据库
      console.log('使用默认示例数据重新初始化...');
      await this.initializeDatabase();
    } catch (error) {
      console.error('数据恢复失败:', error);

      // 最后的兜底方案：强制重新初始化
      try {
        await this.initializeDatabase();
        window.alert('数据恢复失败，应用已使用默认数据重新启动。');
      } catch (finalError) {
        console.error('最终初始化失败:', finalError);
        window.alert('应用初始化失败，请刷新页面重试。');
      }
    }
  }

  private setupErrorHandling(): void {
    // 全局错误处理
    window.addEventListener('error', async event => {
      console.error('全局错误:', event.error);
      await this.logError(event.error);
    });

    window.addEventListener('unhandledrejection', async event => {
      console.error('未处理的Promise拒绝:', event.reason);
      await this.logError(event.reason);
    });

    // 监听 React 错误边界
    window.addEventListener('react-error', async (event: any) => {
      console.error('React错误:', event.detail);
      await this.logError(event.detail);
    });
  }

  private setupAutoSave(intervalMinutes: number): void {
    console.log(`🔄 启用自动保存，间隔: ${intervalMinutes} 分钟`);

    setInterval(
      async () => {
        try {
          const store = useAppStore.getState();
          const data = await store.actions.exportData();
          localStorage.setItem(STORAGE_KEYS.DATA, data);

          // 创建备份
          await this.createBackup(data);

          console.log('🔄 自动保存完成');
        } catch (error) {
          console.error('自动保存失败:', error);
          await this.logError(error);
        }
      },
      intervalMinutes * 60 * 1000,
    );
  }

  private async createBackup(data: string): Promise<void> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupKey = `${STORAGE_KEYS.BACKUP_PREFIX}${timestamp}`;

      localStorage.setItem(backupKey, data);

      // 清理旧备份
      await this.cleanupOldBackups();

      // 更新备份时间
      await this.updateMetrics({ lastBackupTime: Date.now() });
    } catch (error) {
      console.error('备份创建失败:', error);
    }
  }

  private async cleanupOldBackups(): Promise<void> {
    try {
      const backupKeys = Object.keys(localStorage)
        .filter(key => key.startsWith(STORAGE_KEYS.BACKUP_PREFIX))
        .sort();

      // 保留最近的10个备份
      const maxBackups = 10;
      if (backupKeys.length > maxBackups) {
        const keysToDelete = backupKeys.slice(0, backupKeys.length - maxBackups);
        keysToDelete.forEach(key => {
          localStorage.removeItem(key);
        });
        console.log(`🗑️ 清理了 ${keysToDelete.length} 个旧备份`);
      }
    } catch (error) {
      console.error('备份清理失败:', error);
    }
  }

  private async updateMetrics(newMetrics: Partial<AppMetrics>): Promise<void> {
    try {
      const existingMetrics = await this.getMetrics();
      const updatedMetrics: AppMetrics = {
        startupTime: 0,
        crashCount: 0,
        sessionCount: 0,
        totalUsageTime: 0,
        performanceIssues: [],
        dataVersion: CURRENT_DATA_VERSION,
        migrationCount: 0,
        ...existingMetrics,
        ...newMetrics,
      };

      localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(updatedMetrics, null, 2));
    } catch (error) {
      console.error('指标更新失败:', error);
    }
  }

  private async logError(error: any): Promise<void> {
    try {
      const errorInfo = {
        message: error?.message || String(error),
        stack: error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      // 更新崩溃计数
      const metrics = await this.getMetrics();
      await this.updateMetrics({
        crashCount: (metrics?.crashCount || 0) + 1,
        lastCrashTime: Date.now(),
        performanceIssues: [
          ...(metrics?.performanceIssues || []).slice(-9), // 保留最近10个
          errorInfo.message,
        ],
      });

      console.error('错误已记录:', errorInfo);
    } catch (logError) {
      console.error('错误记录失败:', logError);
    }
  }

  private async handleInitializationError(error: any): Promise<void> {
    await this.logError(error);

    const userConfirmation = window.confirm(
      '应用初始化失败。是否清除所有数据并重新开始？\n\n警告：这将删除所有本地数据和设置！',
    );

    if (userConfirmation) {
      console.warn('👩‍💻 用户选择清除所有数据...');
      await this.clearAllData();
      window.location.reload();
    } else {
      console.info('用户选择不清除数据。应用可能无法正常工作。');
      // 抛出错误，由调用方(main.tsx)来处理UI显示
      throw error;
    }
  }

  // 公共方法
  async saveData(): Promise<void> {
    try {
      const store = useAppStore.getState();
      const data = await store.actions.exportData();
      localStorage.setItem(STORAGE_KEYS.DATA, data);

      // 创建备份
      await this.createBackup(data);

      console.log('✅ 数据保存完成');
    } catch (error) {
      console.error('数据保存失败:', error);
      throw error;
    }
  }

  async getMetrics(): Promise<AppMetrics | null> {
    try {
      const metricsString = localStorage.getItem(STORAGE_KEYS.METRICS);
      if (metricsString) {
        return JSON.parse(metricsString);
      }
    } catch (error) {
      console.error('指标加载失败:', error);
    }
    return null;
  }

  async clearAllData(): Promise<void> {
    try {
      // 清除所有相关的 localStorage 数据
      Object.values(STORAGE_KEYS).forEach(key => {
        if (typeof key === 'string') {
          localStorage.removeItem(key);
        }
      });

      // 清除所有备份
      Object.keys(localStorage)
        .filter(key => key.startsWith(STORAGE_KEYS.BACKUP_PREFIX))
        .forEach(key => localStorage.removeItem(key));

      // 重置应用状态 (通过重新加载页面实现)
      // const store = useAppStore.getState();
      // store.actions.reset(); // 暂时注释，因为该方法不存在

      console.log('✅ 所有数据已清除');
    } catch (error) {
      console.error('数据清除失败:', error);
      throw error;
    }
  }

  // 获取应用信息
  getAppInfo() {
    return {
      version: this.defaultConfig.version,
      dataVersion: CURRENT_DATA_VERSION,
      buildTime: 'unknown', // process.env.REACT_APP_BUILD_TIME || 'unknown',
      environment: 'development', // process.env.NODE_ENV || 'development'
    };
  }
}

// 创建单例实例
export const appInitializer = new AppInitializer();

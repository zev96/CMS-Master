import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      // 启用React Fast Refresh
      fastRefresh: true,
      // 启用开发时的错误覆盖
      jsxImportSource: '@emotion/react',
    }),
  ],

  // 路径别名配置
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/stores': path.resolve(__dirname, './src/stores'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
    },
  },

  // 根据模式配置不同的选项
  clearScreen: mode === 'web',
  
  server: {
    port: mode === 'web' ? 5173 : 5173,
    strictPort: false,
    host: host || true,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 5174,
        }
      : undefined,
    watch: {
      // 在Web模式下不忽略任何文件，在Tauri模式下忽略src-tauri
      ignored: mode === 'web' ? [] : ["**/src-tauri/**"],
    },
  },

  build: {
    // 构建优化
    target: 'esnext',
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: mode === 'development',
    minify: mode === 'production' ? 'esbuild' : false,
    
    rollupOptions: {
      onwarn(warning, warn) {
        // 只忽略特定的警告，不是所有警告
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        warn(warning);
      },
      
      // 代码分割优化
      output: {
        manualChunks: {
          // 将React相关库分离到单独的chunk
          'react-vendor': ['react', 'react-dom'],
          // 将UI组件库分离
          'ui-vendor': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-select',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
          ],
          // 将图表库分离
          'chart-vendor': ['echarts', 'echarts-for-react', 'recharts'],
          // 将编辑器分离
          'editor-vendor': ['@tinymce/tinymce-react', 'tinymce', 'quill', 'react-quill'],
          // 将工具库分离
          'utils-vendor': ['clsx', 'class-variance-authority', 'tailwind-merge'],
        },
      },
    },
    
    // 优化chunk大小警告阈值
    chunkSizeWarningLimit: 1000,
  },

  // 优化依赖预构建
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'zustand',
      'framer-motion',
      'lucide-react',
    ],
    exclude: [
      '@tauri-apps/api',
    ],
  },

  // ESBuild配置
  esbuild: {
    logLevel: mode === 'development' ? 'info' : 'warning',
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },

  // 环境变量定义
  define: {
    // 定义缺失的导出
    'Grid3X3': 'undefined',
    'Grid3x3': 'undefined',
    // 根据模式定义不同的环境变量
    __WEB_MODE__: mode === 'web',
    __TAURI_MODE__: mode !== 'web',
    __DEV__: mode === 'development',
    __PROD__: mode === 'production',
  },

  // 环境变量配置
  envPrefix: ['VITE_', 'TAURI_'],

  // CSS配置
  css: {
    devSourcemap: mode === 'development',
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
}));

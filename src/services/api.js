import io from 'socket.io-client';
// 🔥 修复：动态获取主机IP，支持局域网访问
function getApiBaseUrl() {
  // 优先使用环境变量
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // 开发环境：动态获取当前访问的主机
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = '3000'; // 后端固定端口
  const url = `${protocol}//${hostname}:${port}/api`;
  console.log('🌐 API Base URL 计算:', {
    protocol,
    hostname,
    port,
    finalUrl: url,
  });
  return url;
}
function getSocketUrl() {
  // 优先使用环境变量
  if (import.meta.env.VITE_SOCKET_URL) {
    console.log('🔌 使用环境变量 SOCKET_URL:', import.meta.env.VITE_SOCKET_URL);
    return import.meta.env.VITE_SOCKET_URL;
  }
  // 开发环境：动态获取当前访问的主机
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = '3000';
  // Socket.IO使用HTTP协议连接，它会自动升级到WebSocket
  const url = `${protocol}//${hostname}:${port}`;
  console.log('🔌 Socket URL 计算:', {
    currentLocation: window.location.href,
    protocol,
    hostname,
    port,
    finalUrl: url,
    isLocalhost: hostname === 'localhost',
    isIP: /^\d+\.\d+\.\d+\.\d+$/.test(hostname),
  });
  return url;
}
// API基础配置
const API_BASE_URL = getApiBaseUrl();
const SOCKET_URL = getSocketUrl();
console.log('🌐 最终API配置信息:');
console.log('  - API Base URL:', API_BASE_URL);
console.log('  - Socket URL:', SOCKET_URL);
console.log('  - 当前访问地址:', window.location.href);
console.log('  - 访问主机名:', window.location.hostname);
// Socket.IO连接
let socket = null;
// 初始化Socket连接
export function initializeSocket() {
  if (!socket) {
    console.log('🔌 正在初始化WebSocket连接...');
    console.log('  - 目标URL:', SOCKET_URL);
    console.log('  - 连接选项: 支持WebSocket和轮询传输');
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
      transports: ['websocket', 'polling'], // 支持多种传输方式
      forceNew: true, // 强制创建新连接
    });
    socket.on('connect', () => {
      console.log('✅ WebSocket连接成功');
      console.log('  - Socket ID:', socket.id);
      console.log('  - 连接URL:', SOCKET_URL);
      console.log('  - 传输方式:', socket.io.engine.transport.name);
    });
    socket.on('disconnect', reason => {
      console.log('❌ WebSocket连接断开:', reason);
    });
    socket.on('connect_error', error => {
      console.error('❌ WebSocket连接错误:', error);
      console.error('  - 尝试连接的URL:', SOCKET_URL);
      console.error('  - 错误详情:', error.message || error);
      console.error('  - 当前主机名:', window.location.hostname);
    });
    // 添加重连成功监听
    socket.on('reconnect', attemptNumber => {
      console.log('🔄 WebSocket重连成功，尝试次数:', attemptNumber);
    });
    socket.on('reconnect_attempt', attemptNumber => {
      console.log('🔄 正在尝试重连WebSocket，第', attemptNumber, '次');
      console.log('  - 重连URL:', SOCKET_URL);
    });
    socket.on('reconnect_error', error => {
      console.error('❌ WebSocket重连失败:', error);
    });
    socket.on('reconnect_failed', () => {
      console.error('❌ WebSocket重连彻底失败，已停止尝试');
    });
  }
  return socket;
}
// 获取Socket实例
export function getSocket() {
  return socket || initializeSocket();
}
// HTTP请求辅助函数
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`🌐 API请求: ${options.method || 'GET'} ${url}`);
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  try {
    const response = await fetch(url, mergedOptions);
    console.log(`📡 API响应: ${response.status} ${response.statusText}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ API错误:', errorData);
      throw new Error(errorData.message || `HTTP错误: ${response.status}`);
    }
    const result = await response.json();
    console.log('✅ API成功:', result.success ? '操作成功' : '操作失败');
    return result;
  } catch (error) {
    console.error('❌ API请求失败:', error);
    throw error;
  }
}
// 产品相关API
export const productApi = {
  // 获取产品列表
  async getProducts(params) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    const endpoint = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest(endpoint);
  },
  // 获取单个产品
  async getProduct(id) {
    return apiRequest(`/products/${id}`);
  },
  // 创建产品
  async createProduct(productData) {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },
  // 更新产品
  async updateProduct(id, productData) {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },
  // 删除产品
  async deleteProduct(id) {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },
  // 批量删除产品
  async batchDeleteProducts(ids) {
    return apiRequest('/products', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
  },
  // 获取分类统计
  async getCategoryStats() {
    return apiRequest('/products/stats/categories');
  },
};
// 模板相关API
export const templateApi = {
  async getTemplates() {
    return apiRequest('/templates');
  },
  async getTemplate(id) {
    return apiRequest(`/templates/${id}`);
  },
  async createTemplate(templateData) {
    return apiRequest('/templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  },
  async updateTemplate(id, templateData) {
    return apiRequest(`/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(templateData),
    });
  },
  async deleteTemplate(id) {
    return apiRequest(`/templates/${id}`, {
      method: 'DELETE',
    });
  },
};
// 素材相关API
export const assetApi = {
  // 文本素材
  async getTextAssets() {
    return apiRequest('/assets/text');
  },
  async createTextAsset(assetData) {
    return apiRequest('/assets/text', {
      method: 'POST',
      body: JSON.stringify(assetData),
    });
  },
  async updateTextAsset(id, assetData) {
    return apiRequest(`/assets/text/${id}`, {
      method: 'PUT',
      body: JSON.stringify(assetData),
    });
  },
  async deleteTextAsset(id) {
    return apiRequest(`/assets/text/${id}`, {
      method: 'DELETE',
    });
  },
  // 视觉素材
  async getVisualAssets() {
    return apiRequest('/assets/visual');
  },
  async createVisualAsset(assetData) {
    return apiRequest('/assets/visual', {
      method: 'POST',
      body: JSON.stringify(assetData),
    });
  },
  async updateVisualAsset(id, assetData) {
    return apiRequest(`/assets/visual/${id}`, {
      method: 'PUT',
      body: JSON.stringify(assetData),
    });
  },
  async deleteVisualAsset(id) {
    return apiRequest(`/assets/visual/${id}`, {
      method: 'DELETE',
    });
  },
};
// 图表相关API
export const chartApi = {
  async getCharts() {
    return apiRequest('/charts');
  },
  async getChart(id) {
    return apiRequest(`/charts/${id}`);
  },
  async createChart(chartData) {
    return apiRequest('/charts', {
      method: 'POST',
      body: JSON.stringify(chartData),
    });
  },
  async updateChart(id, chartData) {
    return apiRequest(`/charts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(chartData),
    });
  },
  async deleteChart(id) {
    return apiRequest(`/charts/${id}`, {
      method: 'DELETE',
    });
  },
};
// 文件上传API
export const uploadApi = {
  async uploadFile(file, type = 'other') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return apiRequest('/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // 移除Content-Type让浏览器自动设置
    });
  },
};
// 实时数据同步事件监听器
export function setupRealtimeListeners(callbacks) {
  const socket = getSocket();
  socket.on('data-changed', data => {
    switch (data.type) {
      case 'products':
        callbacks.onProductChange?.(data);
        break;
      case 'templates':
        callbacks.onTemplateChange?.(data);
        break;
      case 'assets':
        callbacks.onAssetChange?.(data);
        break;
      case 'charts':
        callbacks.onChartChange?.(data);
        break;
    }
  });
}
// 断开Socket连接
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

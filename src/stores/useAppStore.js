import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const useAppStore = create()(
  devtools(
    immer((set, get) => {
      // =================================================================
      // Step 1: Define ALL actions in a separate, clear object
      // =================================================================
      const actions = {
        loadDatabase: async () => {
          try {
            set({ isLoading: true, error: null });
            // 使用API服务获取数据
            const {
              productApi,
              templateApi,
              assetApi,
              chartApi,
              initializeSocket,
              setupRealtimeListeners,
            } = await import('../services/api');
            // 初始化WebSocket连接
            initializeSocket();
            // 设置实时数据监听
            setupRealtimeListeners({
              onProductChange: data => {
                console.log('收到产品变更通知:', data);
                switch (data.action) {
                  case 'create':
                    // 其他用户创建了产品，更新本地状态
                    set(state => ({
                      products: [...state.products, data.data],
                    }));
                    break;
                  case 'update':
                    // 其他用户更新了产品
                    set(state => ({
                      products: state.products.map(p => (p.id === data.data.id ? data.data : p)),
                    }));
                    break;
                  case 'delete':
                    // 其他用户删除了产品
                    set(state => ({
                      products: state.products.filter(p => p.id !== data.data.id),
                    }));
                    break;
                }
              },
              onTemplateChange: data => {
                console.log('收到模板变更通知:', data);
                switch (data.action) {
                  case 'create':
                    set(state => ({
                      templates: [...state.templates, data.data],
                    }));
                    break;
                  case 'update':
                    set(state => ({
                      templates: state.templates.map(t => (t.id === data.data.id ? data.data : t)),
                    }));
                    break;
                  case 'delete':
                    set(state => ({
                      templates: state.templates.filter(t => t.id !== data.data.id),
                    }));
                    break;
                }
              },
              onAssetChange: data => {
                console.log('收到素材变更通知:', data);
                if (data.subType === 'text') {
                  switch (data.action) {
                    case 'create':
                      set(state => ({
                        textAssets: [...state.textAssets, data.data],
                      }));
                      break;
                    case 'update':
                      set(state => ({
                        textAssets: state.textAssets.map(a =>
                          a.id === data.data.id ? data.data : a,
                        ),
                      }));
                      break;
                    case 'delete':
                      set(state => ({
                        textAssets: state.textAssets.filter(a => a.id !== data.data.id),
                      }));
                      break;
                  }
                } else if (data.subType === 'visual') {
                  switch (data.action) {
                    case 'create':
                      set(state => ({
                        visualAssets: [...state.visualAssets, data.data],
                      }));
                      break;
                    case 'update':
                      set(state => ({
                        visualAssets: state.visualAssets.map(a =>
                          a.id === data.data.id ? data.data : a,
                        ),
                      }));
                      break;
                    case 'delete':
                      set(state => ({
                        visualAssets: state.visualAssets.filter(a => a.id !== data.data.id),
                      }));
                      break;
                  }
                }
              },
              onChartChange: data => {
                console.log('收到图表变更通知:', data);
                switch (data.action) {
                  case 'create':
                    set(state => ({
                      charts: [...state.charts, data.data],
                    }));
                    break;
                  case 'update':
                    set(state => ({
                      charts: state.charts.map(c => (c.id === data.data.id ? data.data : c)),
                    }));
                    break;
                  case 'delete':
                    set(state => ({
                      charts: state.charts.filter(c => c.id !== data.data.id),
                    }));
                    break;
                }
              },
            });
            // 并行加载所有数据
            const [productsRes, templatesRes, textAssetsRes, visualAssetsRes, chartsRes] =
              await Promise.all([
                productApi.getProducts({ limit: 999999 }).catch(err => {
                  console.error('加载产品失败:', err);
                  return { data: [] };
                }),
                templateApi.getTemplates().catch(err => {
                  console.error('加载模板失败:', err);
                  return { data: [] };
                }),
                assetApi.getTextAssets().catch(err => {
                  console.error('加载文本素材失败:', err);
                  return { data: [] };
                }),
                assetApi.getVisualAssets().catch(err => {
                  console.error('加载视觉素材失败:', err);
                  return { data: [] };
                }),
                chartApi.getCharts().catch(err => {
                  console.error('加载图表失败:', err);
                  return { data: [] };
                }),
              ]);
            // 更新状态
            set({
              products: productsRes.data || [],
              templates: templatesRes.data || [],
              textAssets: textAssetsRes.data || [],
              visualAssets: visualAssetsRes.data || [],
              charts: chartsRes.data || [],
              articles: [], // 文章功能暂时为空
              version: '2.0.0',
              isLoading: false,
            });
            console.log('✅ 数据加载成功, 产品数量:', productsRes.data?.length || 0);
          } catch (error) {
            console.error('❌ 加载数据失败:', error);
            set({
              error: error instanceof Error ? error.message : '加载数据失败',
              isLoading: false,
            });
          }
        },
        saveDatabase: async () => {
          // 服务器端自动保存，这里不需要手动保存
          console.log('💾 数据已自动保存到服务器');
        },
        // 🔥 修复：产品操作通过API进行
        addProduct: async productData => {
          try {
            set({ isLoading: true, error: null });
            const { productApi } = await import('../services/api');
            console.log('📝 正在创建产品:', productData);
            const response = await productApi.createProduct(productData);
            if (response.success) {
              // API成功后更新本地状态
              set(state => ({
                products: [...state.products, response.data],
                isLoading: false,
              }));
              console.log('✅ 产品创建成功');
            }
          } catch (error) {
            console.error('❌ 创建产品失败:', error);
            set({
              error: error instanceof Error ? error.message : '创建产品失败',
              isLoading: false,
            });
            throw error;
          }
        },
        updateProduct: async (id, productData) => {
          try {
            set({ isLoading: true, error: null });
            const { productApi } = await import('../services/api');
            console.log('📝 正在更新产品:', id, productData);
            const response = await productApi.updateProduct(id, productData);
            if (response.success) {
              // API成功后更新本地状态
              set(state => ({
                products: state.products.map(p => (p.id === id ? response.data : p)),
                isLoading: false,
              }));
              console.log('✅ 产品更新成功');
            }
          } catch (error) {
            console.error('❌ 更新产品失败:', error);
            set({
              error: error instanceof Error ? error.message : '更新产品失败',
              isLoading: false,
            });
            throw error;
          }
        },
        deleteProduct: async id => {
          try {
            set({ isLoading: true, error: null });
            const { productApi } = await import('../services/api');
            console.log('🗑️ 正在删除产品:', id);
            const response = await productApi.deleteProduct(id);
            if (response.success) {
              // API成功后更新本地状态
              set(state => ({
                products: state.products.filter(p => p.id !== id),
                isLoading: false,
              }));
              console.log('✅ 产品删除成功');
            }
          } catch (error) {
            console.error('❌ 删除产品失败:', error);
            set({
              error: error instanceof Error ? error.message : '删除产品失败',
              isLoading: false,
            });
            throw error;
          }
        },
        getProductById: id => {
          return get().products.find(product => product.id === id);
        },
        showProductList: () => {
          set({
            currentView: 'list',
            selectedProductId: null,
            editingProductId: null,
          });
        },
        showProductDetail: productId => {
          set({
            currentView: 'detail',
            selectedProductId: productId,
            editingProductId: null,
          });
        },
        showProductForm: productId => {
          set({
            currentView: 'form',
            selectedProductId: productId || null,
            editingProductId: productId || null,
          });
        },
        showTemplateList: () => {
          set({
            currentTemplateView: 'list',
            selectedTemplateId: null,
            editingTemplateId: null,
          });
        },
        showTemplateDetail: templateId => {
          set({
            currentTemplateView: 'detail',
            selectedTemplateId: templateId,
            editingTemplateId: null,
          });
        },
        showTemplateForm: templateId => {
          set({
            currentTemplateView: 'form',
            selectedTemplateId: templateId || null,
            editingTemplateId: templateId || null,
          });
        },
        // 🔥 修复：模板操作通过API进行
        addTemplate: async template => {
          try {
            set({ isLoading: true, error: null });
            const { templateApi } = await import('../services/api');
            const response = await templateApi.createTemplate(template);
            if (response.success) {
              set(state => ({
                templates: [...state.templates, response.data],
                isLoading: false,
              }));
            }
          } catch (error) {
            console.error('创建模板失败:', error);
            set({
              error: error instanceof Error ? error.message : '创建模板失败',
              isLoading: false,
            });
            throw error;
          }
        },
        updateTemplate: async (id, template) => {
          try {
            set({ isLoading: true, error: null });
            const { templateApi } = await import('../services/api');
            const response = await templateApi.updateTemplate(id, template);
            if (response.success) {
              set(state => ({
                templates: state.templates.map(t => (t.id === id ? response.data : t)),
                isLoading: false,
              }));
            }
          } catch (error) {
            console.error('更新模板失败:', error);
            set({
              error: error instanceof Error ? error.message : '更新模板失败',
              isLoading: false,
            });
            throw error;
          }
        },
        deleteTemplate: async id => {
          try {
            set({ isLoading: true, error: null });
            const { templateApi } = await import('../services/api');
            const response = await templateApi.deleteTemplate(id);
            if (response.success) {
              set(state => ({
                templates: state.templates.filter(t => t.id !== id),
                isLoading: false,
              }));
            }
          } catch (error) {
            console.error('删除模板失败:', error);
            set({
              error: error instanceof Error ? error.message : '删除模板失败',
              isLoading: false,
            });
            throw error;
          }
        },
        getTemplateById: id => {
          return get().templates.find(template => template.id === id);
        },
        useTemplate: templateId => {
          try {
            const template = get().templates.find(t => t.id === templateId);
            if (template) {
              console.log('🎯 开始使用模板:', template.name);
              // 第一步：清空之前保存的编辑器内容，确保模板能正确加载
              get().actions.clearEditorContent();
              // 第二步：设置模板并切换到编辑器
              set(state => ({
                currentTemplateInEditor: template,
                templateContentModified: false, // 重置修改状态
                currentModule: 'editor', // Switch to the editor view
              }));
              console.log('✅ 模板已设置到编辑器状态');
              return true;
            }
            return false;
          } catch (error) {
            console.error('使用模板失败:', error);
            set({ error: error instanceof Error ? error.message : '使用模板失败' });
            return false;
          }
        },
        // 🔥 修复：素材操作通过API进行
        addTextAsset: async asset => {
          try {
            set({ isLoading: true, error: null });
            const { assetApi } = await import('../services/api');
            const response = await assetApi.createTextAsset(asset);
            if (response.success) {
              set(state => ({
                textAssets: [...state.textAssets, response.data],
                isLoading: false,
              }));
            }
          } catch (error) {
            console.error('创建文本素材失败:', error);
            set({
              error: error instanceof Error ? error.message : '创建文本素材失败',
              isLoading: false,
            });
            throw error;
          }
        },
        updateTextAsset: async (id, asset) => {
          try {
            set({ isLoading: true, error: null });
            const { assetApi } = await import('../services/api');
            const response = await assetApi.updateTextAsset(id, asset);
            if (response.success) {
              set(state => ({
                textAssets: state.textAssets.map(a => (a.id === id ? response.data : a)),
                isLoading: false,
              }));
            }
          } catch (error) {
            console.error('更新文本素材失败:', error);
            set({
              error: error instanceof Error ? error.message : '更新文本素材失败',
              isLoading: false,
            });
            throw error;
          }
        },
        deleteTextAsset: async id => {
          try {
            set({ isLoading: true, error: null });
            const { assetApi } = await import('../services/api');
            const response = await assetApi.deleteTextAsset(id);
            if (response.success) {
              set(state => ({
                textAssets: state.textAssets.filter(a => a.id !== id),
                isLoading: false,
              }));
            }
          } catch (error) {
            console.error('删除文本素材失败:', error);
            set({
              error: error instanceof Error ? error.message : '删除文本素材失败',
              isLoading: false,
            });
            throw error;
          }
        },
        addVisualAsset: async asset => {
          try {
            set({ isLoading: true, error: null });
            const { assetApi } = await import('../services/api');
            const response = await assetApi.createVisualAsset(asset);
            if (response.success) {
              set(state => ({
                visualAssets: [...state.visualAssets, response.data],
                isLoading: false,
              }));
            }
          } catch (error) {
            console.error('创建视觉素材失败:', error);
            set({
              error: error instanceof Error ? error.message : '创建视觉素材失败',
              isLoading: false,
            });
            throw error;
          }
        },
        updateVisualAsset: async (id, asset) => {
          try {
            set({ isLoading: true, error: null });
            const { assetApi } = await import('../services/api');
            const response = await assetApi.updateVisualAsset(id, asset);
            if (response.success) {
              set(state => ({
                visualAssets: state.visualAssets.map(a => (a.id === id ? response.data : a)),
                isLoading: false,
              }));
            }
          } catch (error) {
            console.error('更新视觉素材失败:', error);
            set({
              error: error instanceof Error ? error.message : '更新视觉素材失败',
              isLoading: false,
            });
            throw error;
          }
        },
        deleteVisualAsset: async id => {
          try {
            set({ isLoading: true, error: null });
            const { assetApi } = await import('../services/api');
            const response = await assetApi.deleteVisualAsset(id);
            if (response.success) {
              set(state => ({
                visualAssets: state.visualAssets.filter(a => a.id !== id),
                isLoading: false,
              }));
            }
          } catch (error) {
            console.error('删除视觉素材失败:', error);
            set({
              error: error instanceof Error ? error.message : '删除视觉素材失败',
              isLoading: false,
            });
            throw error;
          }
        },
        // 文章操作（暂时保持本地，后续可以扩展API）
        addArticle: article =>
          set(state => {
            const newArticle = {
              id: generateId(),
              ...article,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            state.articles.push(newArticle);
          }),
        updateArticle: (id, article) =>
          set(state => {
            const articleIndex = state.articles.findIndex(a => a.id === id);
            if (articleIndex !== -1) {
              state.articles[articleIndex] = {
                ...state.articles[articleIndex],
                ...article,
                updated_at: new Date().toISOString(),
              };
            }
          }),
        deleteArticle: id =>
          set(state => {
            state.articles = state.articles.filter(a => a.id !== id);
          }),
        getCurrentArticle: () => {
          const state = get();
          return state.articles.find(article => article.id === state.selectedProductId);
        },
        insertAssetToEditor: asset => {
          const insertEvent = new CustomEvent('insertAsset', {
            detail: { asset },
          });
          window.dispatchEvent(insertEvent);
        },
        // 🔥 修复：图表操作通过API进行
        addChart: async chart => {
          try {
            set({ isLoading: true, error: null });
            const { chartApi } = await import('../services/api');
            const response = await chartApi.createChart(chart);
            if (response.success) {
              set(state => ({
                charts: [...state.charts, response.data],
                isLoading: false,
              }));
            }
          } catch (error) {
            console.error('创建图表失败:', error);
            set({
              error: error instanceof Error ? error.message : '创建图表失败',
              isLoading: false,
            });
            throw error;
          }
        },
        updateChart: async (id, chart) => {
          try {
            set({ isLoading: true, error: null });
            const { chartApi } = await import('../services/api');
            const response = await chartApi.updateChart(id, chart);
            if (response.success) {
              set(state => ({
                charts: state.charts.map(c => (c.id === id ? response.data : c)),
                isLoading: false,
              }));
            }
          } catch (error) {
            console.error('更新图表失败:', error);
            set({
              error: error instanceof Error ? error.message : '更新图表失败',
              isLoading: false,
            });
            throw error;
          }
        },
        deleteChart: async id => {
          try {
            set({ isLoading: true, error: null });
            const { chartApi } = await import('../services/api');
            const response = await chartApi.deleteChart(id);
            if (response.success) {
              set(state => ({
                charts: state.charts.filter(c => c.id !== id),
                isLoading: false,
              }));
            }
          } catch (error) {
            console.error('删除图表失败:', error);
            set({
              error: error instanceof Error ? error.message : '删除图表失败',
              isLoading: false,
            });
            throw error;
          }
        },
        getChartById: id => {
          return get().charts.find(chart => chart.id === id);
        },
        saveEditorContent: content => {
          set({
            currentEditorContent: content,
            templateContentModified: true, // 标记内容已被修改
          });
          try {
            localStorage.setItem('cms_editor_content', content);
          } catch (error) {
            console.error('❌ 保存编辑器内容失败:', error);
          }
        },
        getEditorContent: () => {
          try {
            const savedContent = localStorage.getItem('cms_editor_content');
            if (savedContent) {
              if (get().currentEditorContent !== savedContent) {
                set({ currentEditorContent: savedContent });
              }
              return savedContent;
            }
          } catch (error) {
            console.error('❌ 读取编辑器内容失败:', error);
          }
          return get().currentEditorContent;
        },
        clearEditorContent: () => {
          set({
            currentEditorContent: '',
            templateContentModified: false, // 重置修改状态
          });
          // 🔥 修复：同时清除localStorage中的内容
          try {
            localStorage.removeItem('cms_editor_content');
            console.log('🧹 编辑器内容已清空');
          } catch (error) {
            console.error('❌ 清空编辑器内容失败:', error);
          }
        },
        setCurrentModule: module => {
          set({ currentModule: module });
        },
        toggleSidebar: () => {
          set(state => ({ sidebarCollapsed: !state.sidebarCollapsed }));
        },
        setSelectedProducts: productIds => {
          set({ selectedProductIds: productIds });
        },
        setSelectedParameters: parameters => {
          set({ selectedParameters: parameters });
        },
        setLoading: loading => {
          set({ isLoading: loading });
        },
        setError: error => {
          set({ error });
        },
        clearCache: () => {
          const newCache = {
            productCache: new Map(),
            templateCache: new Map(),
            assetCache: new Map(),
            chartCache: new Map(),
          };
          set({ cache: newCache });
        },
        refreshCache: () => {
          const newCache = {
            productCache: new Map(),
            templateCache: new Map(),
            assetCache: new Map(),
            chartCache: new Map(),
          };
          set({ cache: newCache });
        },
        getPerformanceMetrics: () => {
          return get().performance;
        },
        batchUpdateProducts: async updates => {
          try {
            set({ isLoading: true, error: null });
            // 批量调用更新API
            await Promise.all(
              updates.map(async ({ id, data }) => {
                const { productApi } = await import('../services/api');
                return productApi.updateProduct(id, data);
              }),
            );
            // 重新加载数据以确保同步
            const { actions } = get();
            await actions.loadDatabase();
          } catch (error) {
            console.error('批量更新产品失败:', error);
            set({
              error: error instanceof Error ? error.message : '批量更新产品失败',
              isLoading: false,
            });
            throw error;
          }
        },
        batchDeleteProducts: async ids => {
          try {
            set({ isLoading: true, error: null });
            const { productApi } = await import('../services/api');
            const response = await productApi.batchDeleteProducts(ids);
            if (response.success) {
              set(state => ({
                products: state.products.filter(product => !ids.includes(product.id)),
                isLoading: false,
              }));
            }
          } catch (error) {
            console.error('批量删除产品失败:', error);
            set({
              error: error instanceof Error ? error.message : '批量删除产品失败',
              isLoading: false,
            });
            throw error;
          }
        },
        searchProducts: query => {
          const products = get().products;
          const lowerQuery = query.toLowerCase();
          return products.filter(product => {
            if (!product || !product.basicInfo) return false;
            return (
              (product.basicInfo.brand || '').toLowerCase().includes(lowerQuery) ||
              (product.basicInfo.modelName || '').toLowerCase().includes(lowerQuery) ||
              (product.basicInfo.description || '').toLowerCase().includes(lowerQuery) ||
              (product.features || []).some(feature =>
                feature.toLowerCase().includes(lowerQuery),
              ) ||
              Object.keys(product.parameters || {}).some(key =>
                key.toLowerCase().includes(lowerQuery),
              ) ||
              Object.values(product.parameters || {}).some(value =>
                String(value).toLowerCase().includes(lowerQuery),
              )
            );
          });
        },
        filterProducts: filters => {
          const products = get().products;
          return products.filter(product => {
            if (!product || !product.basicInfo) return false;
            return Object.entries(filters).every(([key, value]) => {
              if (key === 'category') {
                return product.basicInfo.category === value;
              }
              if (key === 'brand') {
                return product.basicInfo.brand === value;
              }
              if (key === 'priceRange') {
                const [min, max] = value;
                return product.basicInfo.price >= min && product.basicInfo.price <= max;
              }
              return true;
            });
          });
        },
        exportData: async () => {
          const state = get();
          const exportData = {
            products: state.products,
            textAssets: state.textAssets,
            visualAssets: state.visualAssets,
            templates: state.templates,
            articles: state.articles,
            charts: state.charts,
            version: state.version,
            exportDate: new Date().toISOString(),
          };
          return JSON.stringify(exportData, null, 2);
        },
        importData: async data => {
          try {
            const parsedData = JSON.parse(data);
            // 使用更安全的方式更新状态
            set(state => {
              console.log('正在导入数据...');
              // 逐个验证和分配数据，增加健壮性
              if (Array.isArray(parsedData.products)) {
                state.products = parsedData.products.filter(p => p && p.id && p.basicInfo);
              }
              if (Array.isArray(parsedData.templates)) {
                state.templates = parsedData.templates.filter(t => t && t.id && t.name);
              }
              if (parsedData.textAssets && typeof parsedData.textAssets === 'object') {
                state.textAssets = parsedData.textAssets;
              }
              if (Array.isArray(parsedData.visualAssets)) {
                state.visualAssets = parsedData.visualAssets.filter(v => v && v.id && v.url);
              }
              if (Array.isArray(parsedData.articles)) {
                state.articles = parsedData.articles.filter(a => a && a.id && a.title);
              }
              if (Array.isArray(parsedData.charts)) {
                state.charts = parsedData.charts.filter(c => c && c.id && c.title);
              }
              console.log('数据导入成功。');
            });
          } catch (error) {
            console.error('数据导入失败:', error);
            // 抛出错误，让调用者(appInitializer)知道导入失败
            throw new Error('无法解析数据文件。文件可能已损坏。');
          }
        },
        cleanupChartData: () => {
          set(state => ({
            charts: state.charts.filter(
              chart =>
                chart.config && chart.config.products && chart.config.parameters && chart.title,
            ),
          }));
        },
        // 图表插入到编辑器
        insertChartToEditor: chart => {
          // 触发自定义事件，让编辑器处理图表插入
          const insertEvent = new CustomEvent('insertChart', {
            detail: { chart },
          });
          window.dispatchEvent(insertEvent);
        },
        // 添加编辑器历史记录相关方法
        saveEditorHistory: content => {
          const timestamp = new Date().toISOString();
          const history = get().editorHistory || [];
          set(state => ({
            editorHistory: [...history, { content, timestamp }].slice(-10), // 只保留最近10条记录
          }));
        },
        getEditorHistory: () => {
          return get().editorHistory || [];
        },
        // 模板修改状态管理
        markTemplateAsModified: () => {
          set({ templateContentModified: true });
        },
        resetTemplateModifiedStatus: () => {
          set({ templateContentModified: false });
        },
        isTemplateModified: () => {
          return get().templateContentModified;
        },
        clearTemplateInEditor: () => {
          set({ currentTemplateInEditor: null });
        },
      };
      // =================================================================
      // Step 2: Return the initial state, assigning the actions object
      // =================================================================
      return {
        products: [],
        textAssets: [],
        visualAssets: [],
        templates: [],
        articles: [],
        charts: [],
        version: '2.0.0',
        performance: {
          lastUpdateTime: Date.now(),
          operationCount: 0,
          cacheHitRate: 0,
          memoryUsage: 0,
        },
        cache: {
          productCache: new Map(),
          templateCache: new Map(),
          assetCache: new Map(),
          chartCache: new Map(),
        },
        currentModule: 'products',
        sidebarCollapsed: false,
        selectedProductIds: [],
        selectedParameters: [],
        isLoading: false,
        error: null,
        currentView: 'list',
        selectedProductId: null,
        editingProductId: null,
        currentTemplateView: 'list',
        selectedTemplateId: null,
        editingTemplateId: null,
        currentTemplateInEditor: null,
        templateContentModified: false,
        currentEditorContent: '',
        editorHistory: [],
        actions: actions,
      };
    }),
    {
      name: 'cms-app-store',
    },
  ),
);
export default useAppStore;

import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../../stores/useAppStore';
import { cn } from '../../lib/utils';
import ProductList from '../modules/products/ProductList';
// 模块组件占位符 - 稍后实现
const ProductsModule = () => {
  const { currentView, selectedProductId, editingProductId, actions } = useAppStore();
  // 动态加载组件以避免循环依赖
  const [ProductDetail, setProductDetail] = React.useState(null);
  const [ProductForm, setProductForm] = React.useState(null);
  React.useEffect(() => {
    const loadComponents = async () => {
      if (currentView === 'detail' && !ProductDetail) {
        const { default: DetailComponent } = await import('../modules/products/ProductDetail');
        setProductDetail(() => DetailComponent);
      }
      if (currentView === 'form' && !ProductForm) {
        const { default: FormComponent } = await import('../modules/products/ProductForm');
        setProductForm(() => FormComponent);
      }
    };
    loadComponents();
  }, [currentView, ProductDetail, ProductForm]);
  if (currentView === 'detail' && selectedProductId) {
    const product = actions.getProductById(selectedProductId);
    if (!product) {
      actions.showProductList();
      return null;
    }
    if (!ProductDetail) {
      return _jsx('div', { className: 'p-6 w-full', children: '\u52A0\u8F7D\u4E2D...' });
    }
    return _jsx('div', {
      className: 'p-6 w-full',
      children: _jsx(ProductDetail, {
        product: product,
        onBack: () => actions.showProductList(),
        onEdit: () => actions.showProductForm(selectedProductId),
        onDelete: () => {
          if (confirm(`确定要删除产品 ${product.basicInfo.modelName} 吗？`)) {
            actions.deleteProduct(selectedProductId);
            actions.showProductList();
          }
        },
      }),
    });
  }
  if (currentView === 'form') {
    const product = editingProductId ? actions.getProductById(editingProductId) : undefined;
    if (!ProductForm) {
      return _jsx('div', { className: 'p-6 w-full', children: '\u52A0\u8F7D\u4E2D...' });
    }
    return _jsx('div', {
      className: 'p-6 w-full',
      children: _jsx(ProductForm, {
        product: product,
        onSave: formData => {
          if (editingProductId) {
            actions.updateProduct(editingProductId, formData);
          } else {
            actions.addProduct(formData);
          }
          actions.showProductList();
        },
        onCancel: () => actions.showProductList(),
      }),
    });
  }
  // 默认显示产品列表
  return _jsx('div', { className: 'p-6 w-full', children: _jsx(ProductList, {}) });
};
const TemplatesModule = () => {
  const { currentTemplateView, selectedTemplateId, editingTemplateId, templates, actions } =
    useAppStore();
  const [TemplateList, setTemplateList] = React.useState(null);
  const [TemplateDetail, setTemplateDetail] = React.useState(null);
  const [TemplateForm, setTemplateForm] = React.useState(null);
  React.useEffect(() => {
    const loadComponents = async () => {
      const [{ default: ListComponent }, { default: DetailComponent }, { default: FormComponent }] =
        await Promise.all([
          import('../modules/templates/TemplateList'),
          import('../modules/templates/TemplateDetail'),
          import('../modules/templates/TemplateForm'),
        ]);
      setTemplateList(() => ListComponent);
      setTemplateDetail(() => DetailComponent);
      setTemplateForm(() => FormComponent);
    };
    loadComponents();
  }, []);
  if (!TemplateList || !TemplateDetail || !TemplateForm) {
    return _jsx('div', { className: 'p-6 w-full', children: '\u52A0\u8F7D\u4E2D...' });
  }
  // 模板详情视图
  if (currentTemplateView === 'detail' && selectedTemplateId) {
    const template = templates.find(t => t.id === selectedTemplateId);
    if (template) {
      return _jsx('div', {
        className: 'p-6 w-full',
        children: _jsx(TemplateDetail, {
          template: template,
          onBack: () => actions.showTemplateList(),
          onEdit: () => actions.showTemplateForm(template.id),
          onDelete: () => {
            if (confirm(`确定要删除模板 "${template.name}" 吗？`)) {
              actions.deleteTemplate(template.id);
              actions.showTemplateList();
            }
          },
          onUse: () => {
            actions.useTemplate(template.id);
          },
          onSave: updatedTemplate => {
            actions.updateTemplate(template.id, updatedTemplate);
          },
        }),
      });
    }
  }
  // 模板编辑/创建视图
  if (currentTemplateView === 'form') {
    const template = editingTemplateId
      ? templates.find(t => t.id === editingTemplateId)
      : undefined;
    return _jsx('div', {
      className: 'p-6 w-full',
      children: _jsx(TemplateForm, {
        template: template,
        onSave: data => {
          if (template) {
            actions.updateTemplate(template.id, data);
          } else {
            actions.addTemplate(data);
          }
          actions.showTemplateList();
        },
        onCancel: () => actions.showTemplateList(),
      }),
    });
  }
  // 默认列表视图
  return _jsx('div', { className: 'p-6 w-full', children: _jsx(TemplateList, {}) });
};
const AssetsModule = () => {
  const [AssetLibrary, setAssetLibrary] = React.useState(null);
  React.useEffect(() => {
    const loadComponent = async () => {
      const { default: LibraryComponent } = await import('../modules/assets/AssetLibrary');
      setAssetLibrary(() => LibraryComponent);
    };
    loadComponent();
  }, []);
  if (!AssetLibrary) {
    return _jsx('div', { className: 'p-6 w-full', children: '\u52A0\u8F7D\u4E2D...' });
  }
  return _jsx('div', { className: 'p-6 w-full', children: _jsx(AssetLibrary, {}) });
};
const ComparisonModule = () => {
  const [ComparisonGenerator, setComparisonGenerator] = React.useState(null);
  React.useEffect(() => {
    const loadComponent = async () => {
      const { default: Component } = await import('../modules/comparison/ComparisonGenerator');
      setComparisonGenerator(() => Component);
    };
    loadComponent();
  }, []);
  if (!ComparisonGenerator) {
    return _jsx('div', { className: 'p-6 w-full', children: '\u52A0\u8F7D\u4E2D...' });
  }
  return _jsx('div', { className: 'p-6 w-full h-full', children: _jsx(ComparisonGenerator, {}) });
};
const EditorModule = () => {
  // 动态加载新的编辑器模块
  const [EditorModuleComponent, setEditorModuleComponent] = React.useState(null);
  React.useEffect(() => {
    const loadComponent = async () => {
      const { default: Component } = await import('../modules/editor/EditorModule');
      setEditorModuleComponent(() => Component);
    };
    loadComponent();
  }, []);
  if (!EditorModuleComponent) {
    return _jsx('div', { className: 'p-6 w-full', children: '\u52A0\u8F7D\u4E2D...' });
  }
  return _jsx(EditorModuleComponent, { className: 'h-full' });
};
const MainContent = ({ className }) => {
  const { currentModule, isLoading, error } = useAppStore();
  const renderModule = () => {
    switch (currentModule) {
      case 'products':
        return _jsx(ProductsModule, {});
      case 'templates':
        return _jsx(TemplatesModule, {});
      case 'assets':
        return _jsx(AssetsModule, {});
      case 'comparison':
        return _jsx(ComparisonModule, {});
      case 'editor':
        return _jsx(EditorModule, {});
      default:
        return _jsx(ProductsModule, {});
    }
  };
  if (isLoading) {
    return _jsx('div', {
      className: cn('flex-1 w-full flex items-center justify-center', className),
      children: _jsxs('div', {
        className: 'text-center',
        children: [
          _jsx('div', {
            className:
              'w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4',
          }),
          _jsx('p', { className: 'text-muted-foreground', children: '\u52A0\u8F7D\u4E2D...' }),
        ],
      }),
    });
  }
  if (error) {
    return _jsx('div', {
      className: cn('flex-1 w-full flex items-center justify-center', className),
      children: _jsxs('div', {
        className: 'text-center',
        children: [
          _jsx('div', {
            className:
              'w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4',
            children: _jsx('span', { className: 'text-destructive text-xl', children: '!' }),
          }),
          _jsx('h3', {
            className: 'text-lg font-medium mb-2',
            children: '\u51FA\u73B0\u9519\u8BEF',
          }),
          _jsx('p', { className: 'text-muted-foreground mb-4', children: error }),
          _jsx('button', {
            onClick: () => window.location.reload(),
            className:
              'px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90',
            children: '\u91CD\u8BD5',
          }),
        ],
      }),
    });
  }
  return _jsx('main', {
    className: cn('flex-1 w-full min-w-0 overflow-hidden', className),
    children: _jsx(AnimatePresence, {
      mode: 'wait',
      initial: false,
      children: _jsx(
        motion.div,
        {
          initial: {
            opacity: 0,
            x: 20,
          },
          animate: {
            opacity: 1,
            x: 0,
          },
          exit: {
            opacity: 0,
            x: -20,
          },
          transition: {
            duration: 0.3,
            ease: 'easeInOut',
          },
          className: 'h-full w-full overflow-auto',
          children: renderModule(),
        },
        currentModule,
      ),
    }),
  });
};
export default MainContent;

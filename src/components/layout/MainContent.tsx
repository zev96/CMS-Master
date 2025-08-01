import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../../stores/useAppStore';
import { cn } from '../../lib/utils';
import ProductList from '../modules/products/ProductList';
import type { ProductFormData, TemplateSection } from '../../types';

// 模板表单数据类型
interface TemplateFormData {
  name: string;
  main_title: string;
  structure: TemplateSection[];
}

// 模块组件占位符 - 稍后实现
const ProductsModule = () => {
  const { currentView, selectedProductId, editingProductId, actions } = useAppStore();

  // 动态加载组件以避免循环依赖
  const [ProductDetail, setProductDetail] = React.useState<any>(null);
  const [ProductForm, setProductForm] = React.useState<any>(null);

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
      return <div className="p-6 w-full">加载中...</div>;
    }

    return (
      <div className="p-6 w-full">
        <ProductDetail
          product={product}
          onBack={() => actions.showProductList()}
          onEdit={() => actions.showProductForm(selectedProductId)}
          onDelete={() => {
            if (confirm(`确定要删除产品 ${product.basicInfo.modelName} 吗？`)) {
              actions.deleteProduct(selectedProductId);
              actions.showProductList();
            }
          }}
        />
      </div>
    );
  }

  if (currentView === 'form') {
    const product = editingProductId ? actions.getProductById(editingProductId) : undefined;

    if (!ProductForm) {
      return <div className="p-6 w-full">加载中...</div>;
    }

    return (
      <div className="p-6 w-full">
        <ProductForm
          product={product}
          onSave={(formData: ProductFormData) => {
            if (editingProductId) {
              actions.updateProduct(editingProductId, formData);
            } else {
              actions.addProduct(formData);
            }
            actions.showProductList();
          }}
          onCancel={() => actions.showProductList()}
        />
      </div>
    );
  }

  // 默认显示产品列表
  return (
    <div className="p-6 w-full">
      <ProductList />
    </div>
  );
};

const TemplatesModule = () => {
  const { currentTemplateView, selectedTemplateId, editingTemplateId, templates, actions } =
    useAppStore();
  const [TemplateList, setTemplateList] = React.useState<any>(null);
  const [TemplateDetail, setTemplateDetail] = React.useState<any>(null);
  const [TemplateForm, setTemplateForm] = React.useState<any>(null);

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
    return <div className="p-6 w-full">加载中...</div>;
  }

  // 模板详情视图
  if (currentTemplateView === 'detail' && selectedTemplateId) {
    const template = templates.find(t => t.id === selectedTemplateId);
    if (template) {
      return (
        <div className="p-6 w-full">
          <TemplateDetail
            template={template}
            onBack={() => actions.showTemplateList()}
            onEdit={() => actions.showTemplateForm(template.id)}
            onDelete={() => {
              if (confirm(`确定要删除模板 "${template.name}" 吗？`)) {
                actions.deleteTemplate(template.id);
                actions.showTemplateList();
              }
            }}
            onUse={() => {
              actions.useTemplate(template.id);
            }}
            onSave={updatedTemplate => {
              actions.updateTemplate(template.id, updatedTemplate);
            }}
          />
        </div>
      );
    }
  }

  // 模板编辑/创建视图
  if (currentTemplateView === 'form') {
    const template = editingTemplateId
      ? templates.find(t => t.id === editingTemplateId)
      : undefined;
    return (
      <div className="p-6 w-full">
        <TemplateForm
          template={template}
          onSave={(data: TemplateFormData) => {
            if (template) {
              actions.updateTemplate(template.id, data);
            } else {
              actions.addTemplate(data);
            }
            actions.showTemplateList();
          }}
          onCancel={() => actions.showTemplateList()}
        />
      </div>
    );
  }

  // 默认列表视图
  return (
    <div className="p-6 w-full">
      <TemplateList />
    </div>
  );
};

const AssetsModule = () => {
  const [AssetLibrary, setAssetLibrary] = React.useState<any>(null);

  React.useEffect(() => {
    const loadComponent = async () => {
      const { default: LibraryComponent } = await import('../modules/assets/AssetLibrary');
      setAssetLibrary(() => LibraryComponent);
    };
    loadComponent();
  }, []);

  if (!AssetLibrary) {
    return <div className="p-6 w-full">加载中...</div>;
  }

  return (
    <div className="p-6 w-full">
      <AssetLibrary />
    </div>
  );
};

const ComparisonModule = () => {
  const [ComparisonGenerator, setComparisonGenerator] = React.useState<any>(null);

  React.useEffect(() => {
    const loadComponent = async () => {
      const { default: Component } = await import('../modules/comparison/ComparisonGenerator');
      setComparisonGenerator(() => Component);
    };
    loadComponent();
  }, []);

  if (!ComparisonGenerator) {
    return <div className="p-6 w-full">加载中...</div>;
  }

  return (
    <div className="p-6 w-full h-full">
      <ComparisonGenerator />
    </div>
  );
};

const EditorModule = () => {
  // 动态加载新的编辑器模块
  const [EditorModuleComponent, setEditorModuleComponent] = React.useState<any>(null);

  React.useEffect(() => {
    const loadComponent = async () => {
      const { default: Component } = await import('../modules/editor/EditorModule');
      setEditorModuleComponent(() => Component);
    };
    loadComponent();
  }, []);

  if (!EditorModuleComponent) {
    return <div className="p-6 w-full">加载中...</div>;
  }

  return <EditorModuleComponent className="h-full" />;
};

interface MainContentProps {
  className?: string;
}

const MainContent: React.FC<MainContentProps> = ({ className }) => {
  const { currentModule, isLoading, error } = useAppStore();

  const renderModule = () => {
    switch (currentModule) {
      case 'products':
        return <ProductsModule />;
      case 'templates':
        return <TemplatesModule />;
      case 'assets':
        return <AssetsModule />;
      case 'comparison':
        return <ComparisonModule />;
      case 'editor':
        return <EditorModule />;
      default:
        return <ProductsModule />;
    }
  };

  if (isLoading) {
    return (
      <div className={cn('flex-1 w-full flex items-center justify-center', className)}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('flex-1 w-full flex items-center justify-center', className)}>
        <div className="text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-destructive text-xl">!</span>
          </div>
          <h3 className="text-lg font-medium mb-2">出现错误</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className={cn('flex-1 w-full min-w-0 overflow-hidden', className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentModule}
          initial={{
            opacity: 0,
            x: 20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          exit={{
            opacity: 0,
            x: -20,
          }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
          className="h-full w-full overflow-auto"
        >
          {renderModule()}
        </motion.div>
      </AnimatePresence>
    </main>
  );
};

export default MainContent;

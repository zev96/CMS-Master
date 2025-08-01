// 产品品类联合类型
export type ProductCategory =
  | '吸尘器'
  | '宠物空气净化器'
  | '猫砂盆'
  | '猫粮'
  | '空气净化器'
  | '冻干'
  | '猫罐头';

// 基本参数接口
export interface BasicInfo {
  brand: string;
  modelName: string;
  price: number;
  category: ProductCategory;
  description: string;
}

// 产品参数接口（完全自定义的键值对）
export interface ProductParameters {
  [key: string]: string | number;
}

// 重构后的产品接口
export interface Product {
  id: string;
  // 1. 基本参数
  basicInfo: BasicInfo;
  // 2. 产品参数（可自定义添加任何参数）
  parameters: ProductParameters;
  // 3. 产品特性（字符串数组）
  features: string[];
  // 元数据
  createdAt: string;
  updatedAt: string;
}

// 产品相关类型
export interface MotorSpecs {
  motor_type: string;
  suction_power: number;
  speed_levels: number;
  noise_level: number;
}

export interface BatterySpecs {
  battery_type: string;
  voltage: number;
  capacity: number;
  runtime: number;
  charge_time: number;
}

// 产品规格参数
export interface ProductSpecifications {
  [key: string]: string | number;
}

// 产品性能数据
export interface ProductPerformance {
  [key: string]: string | number;
}

export interface ProductImage {
  id: string;
  url: string;
  type: 'product' | 'test';
  caption: string;
  alt?: string;
}

// 素材相关类型
export interface TextAsset {
  id: string;
  title: string;
  content: string;
  asset_category: string; // 素材分类（如：行业分析、产品介绍等）
  productCategory?: ProductCategory; // 产品品类（对应产品库的品类）
  sub_category?: string;
  brand?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface TextAssetLibrary {
  general: Record<string, TextAsset[]>;
  brand: Record<string, Record<string, TextAsset[]>>;
}

export interface VisualAsset {
  id: string;
  title: string;
  url: string;
  type: 'main' | 'scene' | 'icon';
  brand?: string;
  asset_category: string; // 素材分类（如：产品图片、场景图片等）
  productCategory?: ProductCategory; // 产品品类（对应产品库的品类）
  sub_category?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface BaseItem {
  id: string;
  created_at: string;
  updated_at: string;
}

// 模板相关类型
export interface TemplateSection {
  id: string;
  title: string;
  order: number;
}

export interface Template extends BaseItem {
  name: string;
  main_title: string;
  structure: Array<{
    id: string;
    title: string;
    order: number;
    content?: string;
  }>;
}

// 文章相关类型
export interface ArticleContent {
  id: string;
  title: string;
  content: string;
  template_id?: string;
  subtitle?: string;
  sections?: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  status?: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

// 图表相关类型
export interface ChartConfig {
  title: string;
  type: 'bar' | 'line' | 'table' | 'pie' | 'radar';
  products: Product[];
  parameters: string[];
  theme: 'professional' | 'modern' | 'simple';
}

export interface SavedChart {
  id: string;
  title: string;
  config: ChartConfig;
  url: string; // 图片URL或表格HTML
  thumbnail: string;
  tableHTML?: string; // 新增：表格类型图表的原始HTML内容
  createdAt: Date;
}

// 数据库结构
export interface Database {
  products: Product[];
  textAssets: TextAsset[];
  visualAssets: VisualAsset[];
  templates: Template[];
  articles: ArticleContent[];
  charts: SavedChart[];
  version: string;
}

// UI状态类型
export type ModuleName = 'products' | 'templates' | 'assets' | 'comparison' | 'editor';

export interface UIState {
  currentModule: ModuleName;
  sidebarCollapsed: boolean;
  selectedProductIds: string[];
  selectedParameters: string[];
  isLoading: boolean;
  error: string | null;
}

// 表单类型
export interface ProductFormData {
  basicInfo: BasicInfo;
  parameters: ProductParameters;
  features: string[];
}

export interface AssetFormData {
  title: string;
  content: string;
  category: string;
  brand?: string;
  tags: string[];
}

// === 向后兼容的类型定义（用于数据迁移） ===
// 这些类型用于处理旧数据格式，逐步迁移到新格式

export interface LegacyBasicInfo {
  brand: string;
  model_name: string;
  product_category: ProductCategory;
  sub_category?: string;
  price: number;
  description?: string;
  status?: 'active' | 'inactive' | 'discontinued';
  category?: 'own' | 'competitor';
}

export interface LegacyMotorSpecs {
  motor_type: string;
  suction_power: number;
  speed_levels: number;
  noise_level: number;
}

export interface LegacyBatterySpecs {
  battery_type: string;
  voltage: number;
  capacity: number;
  runtime: number;
  charge_time: number;
}

export interface LegacyProduct {
  id: string;
  basic_info: LegacyBasicInfo;
  motor_specs: LegacyMotorSpecs;
  battery_specs: LegacyBatterySpecs;
  specifications?: Record<string, string | number>;
  features?: string[];
  performance?: Record<string, string | number>;
  images: Array<{
    id: string;
    url: string;
    type: 'product' | 'test';
    caption: string;
    alt?: string;
  }>;
  created_at: string;
  updated_at: string;
}

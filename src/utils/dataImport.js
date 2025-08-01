import * as XLSX from 'xlsx';
const defaultColumnMapping = {
  brand: '品牌',
  modelName: '型号',
  price: '价格',
  category: '品类',
  description: '描述',
};
// 工具函数：安全解析数字
const parseNumber = value => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};
// 工具函数：安全解析字符串
const parseString = value => {
  if (value === null || value === undefined) return '';
  return String(value).trim();
};
// 工具函数：解析产品品类
const parseCategory = value => {
  const str = parseString(value).toLowerCase();
  const categoryMap = {
    吸尘器: '吸尘器',
    宠物空气净化器: '宠物空气净化器',
    猫砂盆: '猫砂盆',
    猫粮: '猫粮',
    空气净化器: '空气净化器',
    冻干: '冻干',
    猫罐头: '猫罐头',
  };
  for (const [key, category] of Object.entries(categoryMap)) {
    if (str.includes(key.toLowerCase())) {
      return category;
    }
  }
  return '吸尘器'; // 默认值
};
// 主导入函数
export const importProductsFromExcel = async file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        // 获取第一个工作表
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // 转换为JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (jsonData.length < 2) {
          throw new Error('Excel文件数据不足，需要至少包含标题行和一行数据');
        }
        // 第一行作为标题行
        const headers = jsonData[0];
        const dataRows = jsonData.slice(1);
        // 创建列索引映射
        const columnIndexes = {};
        const parameterColumns = {};
        headers.forEach((header, index) => {
          const headerStr = parseString(header);
          // 检查基础字段
          Object.entries(defaultColumnMapping).forEach(([key, expectedHeader]) => {
            if (headerStr.includes(expectedHeader) || headerStr === expectedHeader) {
              columnIndexes[key] = index;
            }
          });
          // 其他列作为产品参数
          if (
            !Object.values(defaultColumnMapping).some(
              expected => headerStr.includes(expected) || headerStr === expected,
            )
          ) {
            parameterColumns[headerStr] = index;
          }
        });
        // 转换数据
        const products = dataRows
          .filter(row => row.length > 0 && parseString(row[columnIndexes.brand || 0]))
          .map((row, index) => {
            const now = new Date().toISOString();
            // 基础信息
            const basicInfo = {
              brand: parseString(row[columnIndexes.brand] || ''),
              modelName: parseString(row[columnIndexes.modelName] || ''),
              price: parseNumber(row[columnIndexes.price] || 0),
              category: parseCategory(row[columnIndexes.category] || '吸尘器'),
              description: parseString(row[columnIndexes.description] || ''),
            };
            // 产品参数
            const parameters = {};
            Object.entries(parameterColumns).forEach(([paramName, colIndex]) => {
              const value = row[colIndex];
              if (value !== null && value !== undefined && value !== '') {
                // 尝试解析为数字，如果失败则保存为字符串
                const numValue = parseNumber(value);
                parameters[paramName] = numValue !== 0 ? numValue : parseString(value);
              }
            });
            // 产品特性（从描述中提取或留空）
            const features = [];
            return {
              id: `imported-${Date.now()}-${index}`,
              basicInfo,
              parameters,
              features,
              createdAt: now,
              updatedAt: now,
            };
          });
        // 验证必需字段
        const validProducts = products.filter(
          product => product.basicInfo.brand && product.basicInfo.modelName,
        );
        if (validProducts.length === 0) {
          throw new Error('没有找到有效的产品数据，请检查Excel文件格式');
        }
        console.log(`成功导入 ${validProducts.length} 个产品`);
        resolve(validProducts);
      } catch (error) {
        reject(error instanceof Error ? error : new Error('解析Excel文件失败'));
      }
    };
    reader.onerror = () => {
      reject(new Error('读取文件失败'));
    };
    reader.readAsBinaryString(file);
  });
};
// 生成示例产品数据
export const generateSampleProducts = () => {
  const productData = [
    // 吸尘器类别
    {
      brand: '希喂',
      modelName: 'HiWeed V1 Pro',
      category: '吸尘器',
      price: 1299,
      description: '专为宠物家庭设计的智能无线吸尘器，配备HEPA滤网和宠物毛发专用吸头',
      parameters: {
        吸力功率: 120,
        档位数: 3,
        噪音级别: 65,
        电压: 22.2,
        电池容量: 2500,
        续航时间: 45,
        充电时间: 240,
        重量: '1.8kg',
        集尘容量: '0.6L',
        过滤系统: 'HEPA H13',
        充电接口: 'Type-C',
      },
      features: ['宠物毛发专用', '无线设计', 'HEPA过滤', '低噪音', '快速充电'],
    },
    {
      brand: '戴森',
      modelName: 'V15 Detect',
      category: '吸尘器',
      price: 4990,
      description: '配备激光探测技术的旗舰级无线吸尘器，能够显示微尘颗粒',
      parameters: {
        吸力功率: 230,
        档位数: 3,
        噪音级别: 75,
        电压: 25.2,
        电池容量: 3500,
        续航时间: 60,
        充电时间: 270,
        重量: '2.1kg',
        集尘容量: '0.77L',
        过滤系统: 'HEPA H13',
        充电接口: '专用接口',
      },
      features: ['激光探测', '数字显示', '高吸力', '多吸头配置', '智能模式'],
    },
    {
      brand: '小米',
      modelName: 'G10 Pro',
      category: '吸尘器',
      price: 1599,
      description: '性价比出色的无线吸尘器，支持APP智能控制',
      parameters: {
        吸力功率: 150,
        档位数: 4,
        噪音级别: 70,
        电压: 21.6,
        电池容量: 3000,
        续航时间: 65,
        充电时间: 210,
        重量: '1.6kg',
        集尘容量: '0.5L',
        过滤系统: 'HEPA H12',
        充电接口: 'Type-C',
      },
      features: ['APP控制', '轻量化', '大容量电池', '快充技术', '多场景适用'],
    },
    // 宠物空气净化器类别
    {
      brand: '希喂',
      modelName: 'PetAir Pro',
      category: '宠物空气净化器',
      price: 2199,
      description: '专为宠物家庭打造的智能空气净化器，有效去除宠物异味和毛发',
      parameters: {
        CADR值: 400,
        适用面积: 48,
        噪音水平: 35,
        功率: 45,
        滤网层数: 4,
        除菌率: 99.9,
        除味率: 95,
        控制方式: 'APP+触控',
        尺寸: '380×380×650mm',
      },
      features: ['宠物异味去除', '毛发收集', '智能检测', '静音运行', 'UV杀菌'],
    },
    {
      brand: '小米',
      modelName: 'Air Purifier 4 Lite',
      category: '空气净化器',
      price: 899,
      description: '入门级智能空气净化器，支持米家生态链',
      parameters: {
        CADR值: 360,
        适用面积: 42,
        噪音水平: 32,
        功率: 38,
        滤网层数: 3,
        除菌率: 99.97,
        除味率: 90,
        控制方式: 'APP+按键',
        尺寸: '240×240×520mm',
      },
      features: ['米家生态', '智能联动', '静音模式', '定时功能', '滤网提醒'],
    },
    // 猫粮类别
    {
      brand: '皇家',
      modelName: 'Indoor Adult',
      category: '猫粮',
      price: 168,
      description: '专为室内成猫设计的营养配方猫粮',
      parameters: {
        蛋白质含量: 27,
        脂肪含量: 13,
        纤维含量: 5,
        水分含量: 8,
        包装规格: '2kg',
        适用年龄: '1-7岁',
        颗粒大小: '中等',
        保质期: 18,
      },
      features: ['室内猫专用', '毛球控制', '体重管理', '营养均衡', '适口性好'],
    },
    {
      brand: '渴望',
      modelName: 'Six Fish',
      category: '猫粮',
      price: 385,
      description: '六种鱼配方的高蛋白天然猫粮',
      parameters: {
        蛋白质含量: 40,
        脂肪含量: 20,
        纤维含量: 3,
        水分含量: 10,
        包装规格: '1.8kg',
        适用年龄: '全年龄',
        颗粒大小: '小颗粒',
        保质期: 15,
      },
      features: ['高蛋白配方', '无谷物', '天然原料', '六种鱼类', '全年龄适用'],
    },
  ];
  return productData.map((data, index) => {
    const now = new Date().toISOString();
    return {
      id: `sample-${index + 1}`,
      basicInfo: {
        brand: data.brand,
        modelName: data.modelName,
        price: data.price,
        category: data.category,
        description: data.description,
      },
      parameters: data.parameters,
      features: data.features,
      createdAt: now,
      updatedAt: now,
    };
  });
};
// 生成示例模板数据
export const generateSampleTemplates = () => {
  const templates = [
    {
      title: '产品评测模板',
      description: '专业的产品评测文章模板，包含外观、性能、使用体验等维度',
      category: '评测',
      sections: [
        {
          id: 'intro',
          title: '产品介绍',
          content:
            '本次我们将对{产品名称}进行全面评测，从外观设计、功能特性、使用体验等多个维度为大家详细解析这款产品的优缺点。',
          order: 1,
        },
        {
          id: 'appearance',
          title: '外观设计',
          content:
            '{产品名称}在外观设计上采用了{设计风格}，整体{外观描述}。产品尺寸为{尺寸}，重量{重量}，在同类产品中属于{尺寸定位}。',
          order: 2,
        },
        {
          id: 'features',
          title: '功能特性',
          content:
            '在功能方面，{产品名称}配备了{主要功能}，{功能描述}。特别值得一提的是{亮点功能}，这一设计{功能优势}。',
          order: 3,
        },
        {
          id: 'performance',
          title: '性能测试',
          content:
            '通过实际测试，{产品名称}在{测试项目}方面表现{性能评价}。具体数据为：{测试数据}。',
          order: 4,
        },
        {
          id: 'conclusion',
          title: '总结评价',
          content:
            '综合来看，{产品名称}是一款{总体评价}的产品。优点包括{优点总结}，不足之处在于{缺点总结}。推荐给{目标用户}使用。',
          order: 5,
        },
      ],
    },
    {
      title: '产品对比模板',
      description: '用于对比分析多款同类产品的文章模板',
      category: '对比',
      sections: [
        {
          id: 'intro',
          title: '对比介绍',
          content:
            '本文将对{产品A}、{产品B}和{产品C}进行全面对比，帮助消费者了解各产品的特点和适用场景。',
          order: 1,
        },
        {
          id: 'basic-comparison',
          title: '基础参数对比',
          content:
            '在基础参数方面，三款产品各有特色：\n{产品A}：{参数A}\n{产品B}：{参数B}\n{产品C}：{参数C}',
          order: 2,
        },
        {
          id: 'feature-comparison',
          title: '功能特性对比',
          content: '功能特性是选择产品的重要考量因素：\n{详细功能对比分析}',
          order: 3,
        },
        {
          id: 'price-comparison',
          title: '价格性价比分析',
          content:
            '从价格角度来看：{产品A}售价{价格A}，{产品B}售价{价格B}，{产品C}售价{价格C}。性价比分析：{性价比分析}',
          order: 4,
        },
        {
          id: 'recommendation',
          title: '购买建议',
          content:
            '根据不同需求，我们的推荐如下：\n预算有限：推荐{经济型产品}\n追求性能：推荐{高性能产品}\n均衡选择：推荐{均衡型产品}',
          order: 5,
        },
      ],
    },
    {
      title: '使用指南模板',
      description: '产品使用指南和教程类文章模板',
      category: '教程',
      sections: [
        {
          id: 'overview',
          title: '使用概述',
          content:
            '{产品名称}是一款{产品类型}，主要用于{主要用途}。本指南将详细介绍如何正确使用该产品。',
          order: 1,
        },
        {
          id: 'preparation',
          title: '使用前准备',
          content: '在开始使用前，请确保：\n1. {准备事项1}\n2. {准备事项2}\n3. {准备事项3}',
          order: 2,
        },
        {
          id: 'step-by-step',
          title: '详细操作步骤',
          content: '具体操作步骤如下：\n步骤1：{操作步骤1}\n步骤2：{操作步骤2}\n步骤3：{操作步骤3}',
          order: 3,
        },
        {
          id: 'tips',
          title: '使用技巧',
          content:
            '为了更好地使用{产品名称}，这里分享一些实用技巧：\n技巧1：{使用技巧1}\n技巧2：{使用技巧2}',
          order: 4,
        },
        {
          id: 'troubleshooting',
          title: '常见问题解决',
          content:
            '使用过程中可能遇到的问题及解决方法：\n问题1：{常见问题1} - 解决方法：{解决方法1}\n问题2：{常见问题2} - 解决方法：{解决方法2}',
          order: 5,
        },
      ],
    },
  ];
  return templates.map((template, index) => ({
    id: `template-${index + 1}`,
    name: template.title,
    main_title: template.title,
    structure: template.sections.map(section => ({
      id: `${template.title.toLowerCase()}-${section.id}`,
      title: section.title,
      order: section.order,
    })),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
};
// 生成示例素材数据
export const generateSampleAssets = () => {
  const textAssets = {
    general: {
      introduction: [
        {
          id: 'intro-1',
          title: '产品介绍开头',
          content:
            '在当今快节奏的生活中，{产品类型}已经成为现代家庭不可或缺的重要工具。今天我们要介绍的{产品名称}，凭借其{核心特点}，在市场上获得了广泛关注。',
          asset_category: '产品介绍',
          sub_category: '开场白',
          tags: ['产品介绍', '开头', '通用'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'intro-2',
          title: '技术亮点介绍',
          content:
            '从技术角度来看，{产品名称}采用了{核心技术}，这项技术的应用使得产品在{技术优势}方面表现出色，为用户带来了{用户价值}的使用体验。',
          asset_category: '技术解析',
          sub_category: '技术介绍',
          tags: ['技术', '亮点', '专业'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      conclusion: [
        {
          id: 'conclusion-1',
          title: '总结推荐',
          content:
            '综合来看，{产品名称}是一款{总体评价}的产品。无论是{优势1}还是{优势2}，都体现了厂商在产品设计上的用心。对于{目标用户}来说，这款产品值得考虑。',
          asset_category: '购买建议',
          sub_category: '推荐总结',
          tags: ['总结', '推荐', '结尾'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      comparison: [
        {
          id: 'comparison-1',
          title: '对比分析',
          content:
            '与同类产品相比，{产品名称}在{对比维度}方面具有明显优势。特别是{具体优势}，这一点在实际使用中会带来{实际效果}。',
          asset_category: '对比评测',
          sub_category: '优势对比',
          tags: ['对比', '优势', '分析'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    },
    brand: {
      希喂: {
        introduction: [
          {
            id: 'hiweed-intro-1',
            title: '希喂品牌介绍',
            content:
              '希喂(HiWeed)作为宠物家居领域的创新品牌，始终致力于为宠物家庭提供智能化、人性化的产品解决方案。品牌秉承"科技让宠物生活更美好"的理念，不断推出满足现代宠物家庭需求的优质产品。',
            asset_category: '产品介绍',
            sub_category: '品牌介绍',
            brand: '希喂',
            tags: ['希喂', '品牌', '宠物', '科技'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        features: [
          {
            id: 'hiweed-feature-1',
            title: '宠物专用设计',
            content:
              '希喂产品最大的特色就是专为宠物家庭设计。从产品的功能设置到外观设计，都充分考虑了宠物的生活习性和主人的使用需求，真正做到了人宠共享的设计理念。',
            asset_category: '产品介绍',
            sub_category: '设计特色',
            brand: '希喂',
            tags: ['希喂', '宠物专用', '设计', '人宠共享'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      },
    },
  };
  const visualAssets = [
    {
      id: 'visual-1',
      title: '产品展示图',
      url: 'https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Product+Display',
      type: 'main',
      asset_category: '产品图片',
      sub_category: '产品图',
      tags: ['产品', '展示', '高清'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'visual-2',
      title: '使用场景图',
      url: 'https://via.placeholder.com/800x600/10B981/FFFFFF?text=Usage+Scene',
      type: 'scene',
      asset_category: '场景图片',
      sub_category: '场景图',
      tags: ['场景', '使用', '生活'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
  return {
    textAssets,
    visualAssets,
  };
};

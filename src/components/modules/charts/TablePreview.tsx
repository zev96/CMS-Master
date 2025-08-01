import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import type { Product } from '../../../types';

interface TablePreviewProps {
  products: Product[];
  parameters: string[];
  title: string;
  theme: string;
  tableStyle?: {
    striped?: boolean;
    bordered?: boolean;
    compact?: boolean;
    headerStyle?: 'default' | 'primary' | 'dark';
  };
  tableTextStyle?: {
    headerFontSize?: number;
    headerColor?: string;
    contentFontSize?: number;
    contentColor?: string;
  };
}

const TablePreview: React.FC<TablePreviewProps> = ({
  products,
  parameters,
  title,
  theme,
  tableStyle = {
    striped: true,
    bordered: true,
    compact: false,
    headerStyle: 'primary',
  },
  tableTextStyle = {
    headerFontSize: 14,
    headerColor: '#111827',
    contentFontSize: 12,
    contentColor: '#666666',
  },
}) => {
  // 获取参数值
  const getParameterValue = (product: Product, parameter: string): string => {
    if (parameter === '价格') return `¥${product.basicInfo.price}`;
    if (parameter === '品牌') return product.basicInfo.brand;
    if (parameter === '型号') return product.basicInfo.modelName;
    if (parameter === '类别') return product.basicInfo.category;

    // 从 parameters 对象中获取值
    if (product.parameters && product.parameters[parameter]) {
      const value = product.parameters[parameter];
      return String(value);
    }

    // 从 features 数组中查找
    if (product.features && product.features.includes(parameter)) {
      return '✓';
    }

    return '-';
  };

  // 获取主题样式
  const getThemeStyles = () => {
    const themes = {
      default: {
        headerBg: 'bg-gray-100',
        headerText: 'text-gray-900',
        border: 'border-gray-200',
      },
      business: {
        headerBg: 'bg-blue-100',
        headerText: 'text-blue-900',
        border: 'border-blue-200',
      },
      modern: {
        headerBg: 'bg-purple-100',
        headerText: 'text-purple-900',
        border: 'border-purple-200',
      },
      dark: {
        headerBg: 'bg-gray-800',
        headerText: 'text-white',
        border: 'border-gray-600',
      },
    };

    return themes[theme as keyof typeof themes] || themes.default;
  };

  const themeStyles = getThemeStyles();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">{title}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">表格对比</Badge>
            <Badge variant="outline">{products.length}个产品</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table
            className={`
            w-full text-sm
            ${tableStyle.bordered ? `border ${themeStyles.border}` : ''}
            ${tableStyle.compact ? 'table-compact' : ''}
          `}
          >
            {/* 表头 */}
            <thead>
              <tr
                className={`
                ${themeStyles.headerBg} ${themeStyles.headerText}
                ${tableStyle.bordered ? `border-b ${themeStyles.border}` : ''}
              `}
              >
                <th
                  className={`
                  px-4 py-3 text-left font-semibold
                  ${tableStyle.bordered ? `border-r ${themeStyles.border}` : ''}
                `}
                  style={{
                    fontSize: `${tableTextStyle.headerFontSize}px`,
                    color: tableTextStyle.headerColor,
                  }}
                >
                  参数/产品
                </th>
                {products.map((product, index) => (
                  <th
                    key={product.id}
                    className={`
                      px-4 py-3 text-center font-semibold min-w-[120px]
                      ${tableStyle.bordered && index < products.length - 1 ? `border-r ${themeStyles.border}` : ''}
                    `}
                    style={{
                      fontSize: `${tableTextStyle.headerFontSize}px`,
                      color: tableTextStyle.headerColor,
                    }}
                  >
                    <div className="space-y-1">
                      <div className="font-bold">{product.basicInfo.brand}</div>
                      <div className="text-xs opacity-80">{product.basicInfo.modelName}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* 表体 */}
            <tbody>
              {parameters.map((parameter, paramIndex) => (
                <tr
                  key={parameter}
                  className={`
                    ${tableStyle.striped && paramIndex % 2 === 1 ? 'bg-gray-50' : 'bg-white'}
                    hover:bg-gray-100 transition-colors
                    ${tableStyle.bordered ? `border-b ${themeStyles.border}` : ''}
                  `}
                >
                  <td
                    className={`
                    px-4 py-3 font-medium text-gray-900
                    ${tableStyle.bordered ? `border-r ${themeStyles.border}` : ''}
                  `}
                    style={{
                      fontSize: `${tableTextStyle.contentFontSize}px`,
                      color: tableTextStyle.contentColor,
                    }}
                  >
                    {parameter}
                  </td>
                  {products.map((product, productIndex) => (
                    <td
                      key={`${product.id}-${parameter}`}
                      className={`
                        px-4 py-3 text-center
                        ${tableStyle.bordered && productIndex < products.length - 1 ? `border-r ${themeStyles.border}` : ''}
                      `}
                      style={{
                        fontSize: `${tableTextStyle.contentFontSize}px`,
                        color: tableTextStyle.contentColor,
                      }}
                    >
                      <span className="font-medium">{getParameterValue(product, parameter)}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 统计信息 */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>对比产品: {products.length}个</span>
            <span>对比参数: {parameters.length}个</span>
            <span>主题: {theme}</span>
            <span>
              样式: {tableStyle.striped ? '条纹' : ''}
              {tableStyle.bordered ? ' 边框' : ''}
              {tableStyle.compact ? ' 紧凑' : ''}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TablePreview;

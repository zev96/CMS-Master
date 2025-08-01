import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
const TablePreview = ({
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
  const getParameterValue = (product, parameter) => {
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
    return themes[theme] || themes.default;
  };
  const themeStyles = getThemeStyles();
  return _jsxs(Card, {
    className: 'w-full',
    children: [
      _jsx(CardHeader, {
        children: _jsxs('div', {
          className: 'flex items-center justify-between',
          children: [
            _jsx(CardTitle, { className: 'text-lg font-bold', children: title }),
            _jsxs('div', {
              className: 'flex items-center space-x-2',
              children: [
                _jsx(Badge, { variant: 'secondary', children: '\u8868\u683C\u5BF9\u6BD4' }),
                _jsxs(Badge, {
                  variant: 'outline',
                  children: [products.length, '\u4E2A\u4EA7\u54C1'],
                }),
              ],
            }),
          ],
        }),
      }),
      _jsxs(CardContent, {
        children: [
          _jsx('div', {
            className: 'overflow-x-auto',
            children: _jsxs('table', {
              className: `
            w-full text-sm
            ${tableStyle.bordered ? `border ${themeStyles.border}` : ''}
            ${tableStyle.compact ? 'table-compact' : ''}
          `,
              children: [
                _jsx('thead', {
                  children: _jsxs('tr', {
                    className: `
                ${themeStyles.headerBg} ${themeStyles.headerText}
                ${tableStyle.bordered ? `border-b ${themeStyles.border}` : ''}
              `,
                    children: [
                      _jsx('th', {
                        className: `
                  px-4 py-3 text-left font-semibold
                  ${tableStyle.bordered ? `border-r ${themeStyles.border}` : ''}
                `,
                        style: {
                          fontSize: `${tableTextStyle.headerFontSize}px`,
                          color: tableTextStyle.headerColor,
                        },
                        children: '\u53C2\u6570/\u4EA7\u54C1',
                      }),
                      products.map((product, index) =>
                        _jsx(
                          'th',
                          {
                            className: `
                      px-4 py-3 text-center font-semibold min-w-[120px]
                      ${tableStyle.bordered && index < products.length - 1 ? `border-r ${themeStyles.border}` : ''}
                    `,
                            style: {
                              fontSize: `${tableTextStyle.headerFontSize}px`,
                              color: tableTextStyle.headerColor,
                            },
                            children: _jsxs('div', {
                              className: 'space-y-1',
                              children: [
                                _jsx('div', {
                                  className: 'font-bold',
                                  children: product.basicInfo.brand,
                                }),
                                _jsx('div', {
                                  className: 'text-xs opacity-80',
                                  children: product.basicInfo.modelName,
                                }),
                              ],
                            }),
                          },
                          product.id,
                        ),
                      ),
                    ],
                  }),
                }),
                _jsx('tbody', {
                  children: parameters.map((parameter, paramIndex) =>
                    _jsxs(
                      'tr',
                      {
                        className: `
                    ${tableStyle.striped && paramIndex % 2 === 1 ? 'bg-gray-50' : 'bg-white'}
                    hover:bg-gray-100 transition-colors
                    ${tableStyle.bordered ? `border-b ${themeStyles.border}` : ''}
                  `,
                        children: [
                          _jsx('td', {
                            className: `
                    px-4 py-3 font-medium text-gray-900
                    ${tableStyle.bordered ? `border-r ${themeStyles.border}` : ''}
                  `,
                            style: {
                              fontSize: `${tableTextStyle.contentFontSize}px`,
                              color: tableTextStyle.contentColor,
                            },
                            children: parameter,
                          }),
                          products.map((product, productIndex) =>
                            _jsx(
                              'td',
                              {
                                className: `
                        px-4 py-3 text-center
                        ${tableStyle.bordered && productIndex < products.length - 1 ? `border-r ${themeStyles.border}` : ''}
                      `,
                                style: {
                                  fontSize: `${tableTextStyle.contentFontSize}px`,
                                  color: tableTextStyle.contentColor,
                                },
                                children: _jsx('span', {
                                  className: 'font-medium',
                                  children: getParameterValue(product, parameter),
                                }),
                              },
                              `${product.id}-${parameter}`,
                            ),
                          ),
                        ],
                      },
                      parameter,
                    ),
                  ),
                }),
              ],
            }),
          }),
          _jsx('div', {
            className: 'mt-4 pt-4 border-t',
            children: _jsxs('div', {
              className: 'flex flex-wrap gap-4 text-sm text-muted-foreground',
              children: [
                _jsxs('span', {
                  children: ['\u5BF9\u6BD4\u4EA7\u54C1: ', products.length, '\u4E2A'],
                }),
                _jsxs('span', {
                  children: ['\u5BF9\u6BD4\u53C2\u6570: ', parameters.length, '\u4E2A'],
                }),
                _jsxs('span', { children: ['\u4E3B\u9898: ', theme] }),
                _jsxs('span', {
                  children: [
                    '\u6837\u5F0F: ',
                    tableStyle.striped ? '条纹' : '',
                    tableStyle.bordered ? ' 边框' : '',
                    tableStyle.compact ? ' 紧凑' : '',
                  ],
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  });
};
export default TablePreview;

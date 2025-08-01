import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    Object.defineProperty(this, 'handleRetry', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        this.setState({
          hasError: false,
          error: null,
          errorInfo: null,
          errorId: '',
        });
      },
    });
    Object.defineProperty(this, 'handleReload', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        window.location.reload();
      },
    });
    Object.defineProperty(this, 'handleGoHome', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        window.location.href = '/';
      },
    });
    Object.defineProperty(this, 'copyErrorDetails', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        const { error, errorInfo, errorId } = this.state;
        const errorDetails = {
          errorId,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          error: {
            message: error?.message,
            stack: error?.stack,
          },
          componentStack: errorInfo?.componentStack,
        };
        navigator.clipboard
          .writeText(JSON.stringify(errorDetails, null, 2))
          .then(() => {
            alert('错误详情已复制到剪贴板');
          })
          .catch(() => {
            alert('复制失败，请手动复制错误信息');
          });
      },
    });
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
      errorId: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    // 调用外部错误处理函数
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    // 记录错误到控制台
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // 记录错误到应用日志（如果可用）
    if (window.appInitializer) {
      window.appInitializer.logError({
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId,
      });
    }
  }
  render() {
    if (this.state.hasError) {
      // 如果提供了自定义fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }
      const { error, errorInfo, errorId } = this.state;
      return _jsx('div', {
        className: 'min-h-screen bg-gray-50 flex items-center justify-center p-4',
        children: _jsxs(Card, {
          className: 'w-full max-w-2xl',
          children: [
            _jsxs(CardHeader, {
              className: 'text-center',
              children: [
                _jsx('div', {
                  className:
                    'mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4',
                  children: _jsx(AlertTriangle, { className: 'w-8 h-8 text-red-600' }),
                }),
                _jsx(CardTitle, {
                  className: 'text-2xl text-gray-900',
                  children: '\u62B1\u6B49\uFF0C\u51FA\u73B0\u4E86\u4E00\u4E2A\u9519\u8BEF',
                }),
                _jsx('p', {
                  className: 'text-gray-600 mt-2',
                  children:
                    '\u5E94\u7528\u7A0B\u5E8F\u9047\u5230\u4E86\u610F\u5916\u9519\u8BEF\u3002\u60A8\u53EF\u4EE5\u5C1D\u8BD5\u4EE5\u4E0B\u64CD\u4F5C\u6765\u6062\u590D\uFF1A',
                }),
              ],
            }),
            _jsxs(CardContent, {
              className: 'space-y-6',
              children: [
                _jsx('div', {
                  className: 'bg-red-50 border border-red-200 rounded-lg p-4',
                  children: _jsxs('div', {
                    className: 'flex items-start space-x-3',
                    children: [
                      _jsx(Bug, { className: 'w-5 h-5 text-red-600 mt-0.5 flex-shrink-0' }),
                      _jsxs('div', {
                        className: 'flex-1',
                        children: [
                          _jsx('h4', {
                            className: 'font-medium text-red-800 mb-1',
                            children: '\u9519\u8BEF\u8BE6\u60C5',
                          }),
                          _jsx('p', {
                            className: 'text-red-700 text-sm',
                            children: error?.message || '未知错误',
                          }),
                          _jsxs('p', {
                            className: 'text-red-600 text-xs mt-1',
                            children: ['\u9519\u8BEFID: ', errorId],
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
                _jsxs('div', {
                  className: 'flex flex-col sm:flex-row gap-3',
                  children: [
                    _jsxs(Button, {
                      onClick: this.handleRetry,
                      className: 'flex-1 bg-blue-600 hover:bg-blue-700',
                      children: [_jsx(RefreshCw, { className: 'w-4 h-4 mr-2' }), '\u91CD\u8BD5'],
                    }),
                    _jsxs(Button, {
                      onClick: this.handleReload,
                      variant: 'outline',
                      className: 'flex-1',
                      children: [
                        _jsx(RefreshCw, { className: 'w-4 h-4 mr-2' }),
                        '\u5237\u65B0\u9875\u9762',
                      ],
                    }),
                    _jsxs(Button, {
                      onClick: this.handleGoHome,
                      variant: 'outline',
                      className: 'flex-1',
                      children: [
                        _jsx(Home, { className: 'w-4 h-4 mr-2' }),
                        '\u8FD4\u56DE\u9996\u9875',
                      ],
                    }),
                  ],
                }),
                this.props.showDetails &&
                  _jsxs('details', {
                    className: 'bg-gray-50 border border-gray-200 rounded-lg',
                    children: [
                      _jsx('summary', {
                        className:
                          'px-4 py-3 cursor-pointer hover:bg-gray-100 font-medium text-gray-700',
                        children: '\u67E5\u770B\u6280\u672F\u8BE6\u60C5',
                      }),
                      _jsx('div', {
                        className: 'px-4 pb-4 pt-2 border-t border-gray-200',
                        children: _jsxs('div', {
                          className: 'space-y-4',
                          children: [
                            _jsxs('div', {
                              children: [
                                _jsx('h5', {
                                  className: 'font-medium text-gray-700 mb-2',
                                  children: '\u9519\u8BEF\u5806\u6808',
                                }),
                                _jsx('pre', {
                                  className:
                                    'text-xs text-gray-600 bg-white p-3 rounded border overflow-x-auto',
                                  children: error?.stack,
                                }),
                              ],
                            }),
                            errorInfo?.componentStack &&
                              _jsxs('div', {
                                children: [
                                  _jsx('h5', {
                                    className: 'font-medium text-gray-700 mb-2',
                                    children: '\u7EC4\u4EF6\u5806\u6808',
                                  }),
                                  _jsx('pre', {
                                    className:
                                      'text-xs text-gray-600 bg-white p-3 rounded border overflow-x-auto',
                                    children: errorInfo.componentStack,
                                  }),
                                ],
                              }),
                            _jsx(Button, {
                              onClick: this.copyErrorDetails,
                              variant: 'outline',
                              size: 'sm',
                              className: 'w-full',
                              children: '\u590D\u5236\u9519\u8BEF\u4FE1\u606F',
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
                _jsxs('div', {
                  className: 'bg-blue-50 border border-blue-200 rounded-lg p-4',
                  children: [
                    _jsx('h4', {
                      className: 'font-medium text-blue-800 mb-2',
                      children: '\u9700\u8981\u5E2E\u52A9\uFF1F',
                    }),
                    _jsx('p', {
                      className: 'text-blue-700 text-sm mb-3',
                      children:
                        '\u5982\u679C\u95EE\u9898\u6301\u7EED\u5B58\u5728\uFF0C\u8BF7\u5C1D\u8BD5\u4EE5\u4E0B\u64CD\u4F5C\uFF1A',
                    }),
                    _jsxs('ul', {
                      className: 'text-blue-700 text-sm space-y-1 list-disc list-inside',
                      children: [
                        _jsx('li', {
                          children: '\u68C0\u67E5\u7F51\u7EDC\u8FDE\u63A5\u662F\u5426\u6B63\u5E38',
                        }),
                        _jsx('li', { children: '\u6E05\u9664\u6D4F\u89C8\u5668\u7F13\u5B58' }),
                        _jsx('li', { children: '\u91CD\u542F\u5E94\u7528\u7A0B\u5E8F' }),
                        _jsx('li', {
                          children:
                            '\u8054\u7CFB\u6280\u672F\u652F\u6301\u5E76\u63D0\u4F9B\u9519\u8BEFID',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      });
    }
    return this.props.children;
  }
}
// 函数式组件包装器，用于更简单的使用
export const withErrorBoundary = (Component, errorBoundaryConfig) => {
  const WrappedComponent = props =>
    _jsx(ErrorBoundary, { ...errorBoundaryConfig, children: _jsx(Component, { ...props }) });
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};
// 轻量级错误边界，用于局部组件
export const SimpleErrorBoundary = ({ children }) =>
  _jsx(ErrorBoundary, {
    fallback: _jsxs('div', {
      className: 'p-4 bg-red-50 border border-red-200 rounded-lg',
      children: [
        _jsxs('div', {
          className: 'flex items-center space-x-2',
          children: [
            _jsx(AlertTriangle, { className: 'w-5 h-5 text-red-600' }),
            _jsx('p', {
              className: 'text-red-800 font-medium',
              children: '\u7EC4\u4EF6\u52A0\u8F7D\u5931\u8D25',
            }),
          ],
        }),
        _jsx('p', {
          className: 'text-red-700 text-sm mt-1',
          children:
            '\u8BE5\u7EC4\u4EF6\u9047\u5230\u4E86\u9519\u8BEF\uFF0C\u8BF7\u5237\u65B0\u9875\u9762\u91CD\u8BD5\u3002',
        }),
      ],
    }),
    children: children,
  });
export default ErrorBoundary;

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  showDetails?: boolean;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
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
    if ((window as any).appInitializer) {
      (window as any).appInitializer.logError({
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId,
      });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  copyErrorDetails = () => {
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
  };

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo, errorId } = this.state;

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">抱歉，出现了一个错误</CardTitle>
              <p className="text-gray-600 mt-2">
                应用程序遇到了意外错误。您可以尝试以下操作来恢复：
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* 错误信息摘要 */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Bug className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-red-800 mb-1">错误详情</h4>
                    <p className="text-red-700 text-sm">{error?.message || '未知错误'}</p>
                    <p className="text-red-600 text-xs mt-1">错误ID: {errorId}</p>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={this.handleRetry} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  重试
                </Button>

                <Button onClick={this.handleReload} variant="outline" className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  刷新页面
                </Button>

                <Button onClick={this.handleGoHome} variant="outline" className="flex-1">
                  <Home className="w-4 h-4 mr-2" />
                  返回首页
                </Button>
              </div>

              {/* 错误详情（可选显示） */}
              {this.props.showDetails && (
                <details className="bg-gray-50 border border-gray-200 rounded-lg">
                  <summary className="px-4 py-3 cursor-pointer hover:bg-gray-100 font-medium text-gray-700">
                    查看技术详情
                  </summary>
                  <div className="px-4 pb-4 pt-2 border-t border-gray-200">
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">错误堆栈</h5>
                        <pre className="text-xs text-gray-600 bg-white p-3 rounded border overflow-x-auto">
                          {error?.stack}
                        </pre>
                      </div>

                      {errorInfo?.componentStack && (
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">组件堆栈</h5>
                          <pre className="text-xs text-gray-600 bg-white p-3 rounded border overflow-x-auto">
                            {errorInfo.componentStack}
                          </pre>
                        </div>
                      )}

                      <Button
                        onClick={this.copyErrorDetails}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        复制错误信息
                      </Button>
                    </div>
                  </div>
                </details>
              )}

              {/* 帮助信息 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">需要帮助？</h4>
                <p className="text-blue-700 text-sm mb-3">如果问题持续存在，请尝试以下操作：</p>
                <ul className="text-blue-700 text-sm space-y-1 list-disc list-inside">
                  <li>检查网络连接是否正常</li>
                  <li>清除浏览器缓存</li>
                  <li>重启应用程序</li>
                  <li>联系技术支持并提供错误ID</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// 函数式组件包装器，用于更简单的使用
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryConfig?: Omit<ErrorBoundaryProps, 'children'>,
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryConfig}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

// 轻量级错误边界，用于局部组件
export const SimpleErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    fallback={
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <p className="text-red-800 font-medium">组件加载失败</p>
        </div>
        <p className="text-red-700 text-sm mt-1">该组件遇到了错误，请刷新页面重试。</p>
      </div>
    }
  >
    {children}
  </ErrorBoundary>
);

export default ErrorBoundary;

import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import React, { useState } from 'react';
import useAppStore from '../../../stores/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Edit3, Image, BarChart3 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import ContentEditor from './ContentEditor';
import AssetPicker from '../assets/AssetPicker';
const EditorModule = ({ className }) => {
  const [activeLibraryTab, setActiveLibraryTab] = useState('assets');
  const [ChartLibrary, setChartLibrary] = useState(null);
  const { charts, actions } = useAppStore();
  React.useEffect(() => {
    const loadChartLibrary = async () => {
      try {
        const { default: Component } = await import('../charts/ChartLibrary');
        setChartLibrary(() => Component);
      } catch (error) {
        console.error('加载图表库失败:', error);
      }
    };
    loadChartLibrary();
  }, []);
  return _jsx('div', {
    className: cn('flex flex-col h-full bg-muted/30', className),
    children: _jsxs('div', {
      className: 'flex-1 flex gap-4 p-4 min-h-0',
      children: [
        _jsxs('div', {
          className: 'w-[480px] min-h-0 flex flex-col',
          children: [
            _jsxs('div', {
              className: 'flex bg-white rounded-lg p-1 mb-4 shadow-sm',
              children: [
                _jsxs(Button, {
                  variant: activeLibraryTab === 'assets' ? 'default' : 'ghost',
                  size: 'sm',
                  onClick: () => setActiveLibraryTab('assets'),
                  className: 'flex-1 flex items-center justify-center space-x-2',
                  children: [
                    _jsx(Image, { className: 'w-4 h-4' }),
                    _jsx('span', { children: '\u7D20\u6750\u5E93' }),
                  ],
                }),
                _jsxs(Button, {
                  variant: activeLibraryTab === 'charts' ? 'default' : 'ghost',
                  size: 'sm',
                  onClick: () => setActiveLibraryTab('charts'),
                  className: 'flex-1 flex items-center justify-center space-x-2',
                  children: [
                    _jsx(BarChart3, { className: 'w-4 h-4' }),
                    _jsx('span', { children: '\u56FE\u8868\u5E93' }),
                  ],
                }),
              ],
            }),
            _jsx('div', {
              className: 'flex-1 min-h-0',
              children:
                activeLibraryTab === 'assets'
                  ? _jsx(AssetPicker, {})
                  : ChartLibrary
                    ? _jsx(ChartLibrary, {
                        charts: charts,
                        onChartSelect: chart => {
                          console.log('选择图表:', chart);
                          // 这里可以添加图表预览功能
                        },
                        onChartDelete: chartId => {
                          actions.deleteChart(chartId);
                        },
                      })
                    : _jsx(Card, {
                        className: 'h-full',
                        children: _jsx(CardContent, {
                          className: 'p-6 flex items-center justify-center',
                          children: _jsxs('div', {
                            className: 'text-center text-muted-foreground',
                            children: [
                              _jsx(BarChart3, { className: 'w-12 h-12 mx-auto mb-3 opacity-50' }),
                              _jsx('p', {
                                children: '\u6B63\u5728\u52A0\u8F7D\u56FE\u8868\u5E93...',
                              }),
                            ],
                          }),
                        }),
                      }),
            }),
          ],
        }),
        _jsx('div', {
          className: 'flex-1 min-h-0',
          children: _jsxs(Card, {
            className: 'h-full flex flex-col',
            children: [
              _jsx(CardHeader, {
                className: 'pb-2 shrink-0',
                children: _jsxs(CardTitle, {
                  className: 'text-sm flex items-center space-x-2',
                  children: [
                    _jsx(Edit3, { className: 'w-4 h-4' }),
                    _jsx('span', { children: '\u5185\u5BB9\u521B\u4F5C\u533A' }),
                  ],
                }),
              }),
              _jsx(CardContent, {
                className: 'flex-1 p-0 min-h-0',
                children: _jsx(ContentEditor, { className: 'h-full' }),
              }),
            ],
          }),
        }),
      ],
    }),
  });
};
export default EditorModule;

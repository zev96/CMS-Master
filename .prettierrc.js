module.exports = {
  // 基础格式化选项
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  
  // 文件范围
  rangeStart: 0,
  rangeEnd: Infinity,
  
  // 解析器选项
  requirePragma: false,
  insertPragma: false,
  proseWrap: 'preserve',
  
  // HTML相关
  htmlWhitespaceSensitivity: 'css',
  
  // Vue相关（如果需要）
  vueIndentScriptAndStyle: false,
  
  // 换行符
  endOfLine: 'lf',
  
  // 嵌入语言格式化
  embeddedLanguageFormatting: 'auto',
  
  // 单属性HTML元素
  singleAttributePerLine: false,
  
  // 文件特定覆盖
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 200,
      },
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'always',
        printWidth: 80,
      },
    },
    {
      files: '*.{css,scss,less}',
      options: {
        singleQuote: false,
      },
    },
  ],
};
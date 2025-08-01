const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// 数据库文件路径
const DB_PATH = path.join(__dirname, '../data/cms_content.db');

// 确保数据目录存在
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// --- 核心修复：在模块级别创建并导出一个持久的数据库连接 ---
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ 数据库连接失败:', err.message);
    throw err;
  }
  console.log('✅ SQLite数据库连接成功 (持久化)');
});

// 启用外键约束
db.run('PRAGMA foreign_keys = ON');

function getDatabase() {
  return db; // 直接返回已创建的连接
}
// -----------------------------------------------------------------

// 初始化数据库表结构
async function initDatabase() {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 产品表
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          brand TEXT,
          model TEXT,
          category TEXT,
          subcategory TEXT,
          price REAL,
          original_price REAL,
          description TEXT,
          features TEXT, -- JSON字符串
          specifications TEXT, -- JSON字符串
          images TEXT, -- JSON字符串存储图片数组
          tags TEXT, -- JSON字符串存储标签数组
          stock_quantity INTEGER DEFAULT 0,
          status TEXT DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // 模板表
      db.run(`
        CREATE TABLE IF NOT EXISTS templates (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          content TEXT NOT NULL,
          category TEXT,
          tags TEXT, -- JSON字符串
          thumbnail TEXT,
          is_public BOOLEAN DEFAULT true,
          usage_count INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // 文本素材表
      db.run(`
        CREATE TABLE IF NOT EXISTS text_assets (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          category TEXT,
          product_category TEXT,
          sub_category TEXT,
          brand TEXT,
          tags TEXT, -- JSON字符串
          type TEXT DEFAULT 'text',
          language TEXT DEFAULT 'zh-CN',
          usage_count INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // 为现有表添加新字段（如果不存在）
      db.run(`ALTER TABLE text_assets ADD COLUMN product_category TEXT`, () => {});
      db.run(`ALTER TABLE text_assets ADD COLUMN sub_category TEXT`, () => {});
      db.run(`ALTER TABLE text_assets ADD COLUMN brand TEXT`, () => {});
      
      // 视觉素材表
      db.run(`
        CREATE TABLE IF NOT EXISTS visual_assets (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          file_path TEXT NOT NULL,
          file_size INTEGER,
          file_type TEXT,
          dimensions TEXT, -- JSON字符串存储宽高
          category TEXT,
          tags TEXT, -- JSON字符串
          usage_count INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // 文章内容表
      db.run(`
        CREATE TABLE IF NOT EXISTS articles (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          summary TEXT,
          category TEXT,
          tags TEXT, -- JSON字符串
          status TEXT DEFAULT 'draft',
          author TEXT,
          publish_date DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // 图表数据表
      db.run(`
        CREATE TABLE IF NOT EXISTS charts (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          chart_type TEXT NOT NULL,
          chart_config TEXT NOT NULL, -- JSON字符串存储图表配置
          chart_data TEXT NOT NULL, -- JSON字符串存储图表数据
          category TEXT,
          tags TEXT, -- JSON字符串
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // 用户表（简单的用户管理）
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE,
          password_hash TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          last_login DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // 操作日志表
      db.run(`
        CREATE TABLE IF NOT EXISTS operation_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT,
          operation TEXT NOT NULL,
          target_type TEXT NOT NULL,
          target_id TEXT NOT NULL,
          details TEXT, -- JSON字符串
          ip_address TEXT,
          user_agent TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `, (err) => {
        if (err) {
          console.error('数据库表创建失败:', err);
          reject(err);
        } else {
          console.log('✅ 数据库表结构初始化完成');
          resolve();
        }
      });
    });
  });
}

// 数据库操作辅助函数
function runQuery(sql, params = []) {
  const db = getDatabase();
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
}

function getQuery(sql, params = []) {
  const db = getDatabase();
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function allQuery(sql, params = []) {
  const db = getDatabase();
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// 关闭数据库连接
function closeDatabase() {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('数据库关闭失败:', err.message);
      } else {
        console.log('✅ 数据库连接已关闭');
      }
    });
  }
}

// JSON字段辅助函数
function parseJsonField(value, defaultValue = null) {
  if (!value) return defaultValue;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error('JSON解析失败:', error);
    return defaultValue;
  }
}

function stringifyJsonField(value) {
  if (value === null || value === undefined) return null;
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.error('JSON字符串化失败:', error);
    return null;
  }
}

module.exports = {
  initDatabase,
  getDatabase,
  runQuery,
  getQuery,
  allQuery,
  closeDatabase,
  parseJsonField,
  stringifyJsonField
}; 
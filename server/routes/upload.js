const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// 确保上传目录存在
const uploadDirs = {
  images: path.join(__dirname, '../../uploads/images'),
  documents: path.join(__dirname, '../../uploads/documents'),
  other: path.join(__dirname, '../../uploads/other')
};

Object.values(uploadDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 配置multer存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileType = req.body.type || 'other';
    let uploadDir = uploadDirs.other;
    
    if (fileType === 'image' || file.mimetype.startsWith('image/')) {
      uploadDir = uploadDirs.images;
    } else if (fileType === 'document' || 
               file.mimetype.includes('pdf') ||
               file.mimetype.includes('word') ||
               file.mimetype.includes('excel') ||
               file.mimetype.includes('powerpoint')) {
      uploadDir = uploadDirs.documents;
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 允许的文件类型
  const allowedTypes = {
    images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    documents: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv'
    ],
    other: ['application/json', 'application/xml', 'text/html']
  };
  
  const allAllowedTypes = [
    ...allowedTypes.images,
    ...allowedTypes.documents,
    ...allowedTypes.other
  ];
  
  if (allAllowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`不支持的文件类型: ${file.mimetype}`), false);
  }
};

// 配置multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 10 // 最多10个文件
  }
});

// 单文件上传
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '未选择文件'
      });
    }
    
    // 确定文件类型目录
    let typeDir = 'other';
    if (req.file.destination.includes('images')) {
      typeDir = 'images';
    } else if (req.file.destination.includes('documents')) {
      typeDir = 'documents';
    }
    
    // 生成访问URL
    const fileUrl = `/uploads/${typeDir}/${req.file.filename}`;
    
    res.json({
      success: true,
      message: '文件上传成功',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: fileUrl,
        path: req.file.path,
        type: typeDir
      }
    });
  } catch (error) {
    console.error('文件上传失败:', error);
    res.status(500).json({
      success: false,
      message: '文件上传失败',
      error: error.message
    });
  }
});

// 多文件上传
router.post('/multiple', upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: '未选择文件'
      });
    }
    
    const uploadedFiles = req.files.map(file => {
      // 确定文件类型目录
      let typeDir = 'other';
      if (file.destination.includes('images')) {
        typeDir = 'images';
      } else if (file.destination.includes('documents')) {
        typeDir = 'documents';
      }
      
      return {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        url: `/uploads/${typeDir}/${file.filename}`,
        path: file.path,
        type: typeDir
      };
    });
    
    res.json({
      success: true,
      message: `成功上传 ${uploadedFiles.length} 个文件`,
      data: uploadedFiles
    });
  } catch (error) {
    console.error('多文件上传失败:', error);
    res.status(500).json({
      success: false,
      message: '多文件上传失败',
      error: error.message
    });
  }
});

// 删除文件
router.delete('/:type/:filename', (req, res) => {
  try {
    const { type, filename } = req.params;
    
    if (!uploadDirs[type]) {
      return res.status(400).json({
        success: false,
        message: '无效的文件类型'
      });
    }
    
    const filePath = path.join(uploadDirs[type], filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: '文件不存在'
      });
    }
    
    fs.unlinkSync(filePath);
    
    res.json({
      success: true,
      message: '文件删除成功'
    });
  } catch (error) {
    console.error('删除文件失败:', error);
    res.status(500).json({
      success: false,
      message: '删除文件失败',
      error: error.message
    });
  }
});

// 获取文件列表
router.get('/list/:type', (req, res) => {
  try {
    const { type } = req.params;
    
    if (!uploadDirs[type]) {
      return res.status(400).json({
        success: false,
        message: '无效的文件类型'
      });
    }
    
    const uploadDir = uploadDirs[type];
    
    if (!fs.existsSync(uploadDir)) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    const files = fs.readdirSync(uploadDir).map(filename => {
      const filePath = path.join(uploadDir, filename);
      const stats = fs.statSync(filePath);
      
      return {
        filename,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        url: `/uploads/${type}/${filename}`,
        type
      };
    });
    
    res.json({
      success: true,
      data: files
    });
  } catch (error) {
    console.error('获取文件列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取文件列表失败',
      error: error.message
    });
  }
});

// 获取存储统计
router.get('/stats', (req, res) => {
  try {
    const stats = {};
    let totalSize = 0;
    let totalFiles = 0;
    
    Object.entries(uploadDirs).forEach(([type, dir]) => {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        let typeSize = 0;
        
        files.forEach(filename => {
          const filePath = path.join(dir, filename);
          const fileStats = fs.statSync(filePath);
          typeSize += fileStats.size;
        });
        
        stats[type] = {
          files: files.length,
          size: typeSize,
          sizeFormatted: formatFileSize(typeSize)
        };
        
        totalFiles += files.length;
        totalSize += typeSize;
      } else {
        stats[type] = {
          files: 0,
          size: 0,
          sizeFormatted: '0 B'
        };
      }
    });
    
    stats.total = {
      files: totalFiles,
      size: totalSize,
      sizeFormatted: formatFileSize(totalSize)
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('获取存储统计失败:', error);
    res.status(500).json({
      success: false,
      message: '获取存储统计失败',
      error: error.message
    });
  }
});

// 格式化文件大小
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 错误处理中间件
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: '文件大小超过限制（最大50MB）'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: '文件数量超过限制（最多10个）'
      });
    }
  }
  
  res.status(500).json({
    success: false,
    message: error.message || '上传过程中发生错误'
  });
});

module.exports = router; 
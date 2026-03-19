const fs = require('fs');
const path = require('path');

function compareNames(a, b) {
  return a.localeCompare(b, 'zh-Hans-CN-u-kn-true');
}

function sortByName(items) {
  return [...items].sort((a, b) => compareNames(a.name, b.name));
}

function sortByPath(items) {
  return [...items].sort((a, b) => compareNames(a.path, b.path));
}

/**
 * 生成README文档的函数
 * 根据当前目录结构和文件内容自动生成README.md文档
 */
function generateREADME() {
  const rootDir = process.cwd();
  const readmePath = path.join(rootDir, 'README.md');
  
  console.log('开始生成README文档...');
  console.log('根目录:', rootDir);
  
  // 获取项目信息
  const projectInfo = getProjectInfo(rootDir);
  
  // 获取目录结构
  const directoryStructure = getDirectoryStructure(rootDir);
  
  // 获取文件内容分析
  const fileAnalysis = analyzeFiles(rootDir);
  
  // 生成README内容
  const readmeContent = buildReadmeContent(projectInfo, directoryStructure, fileAnalysis);
  
  // 写入README文件
  try {
    fs.writeFileSync(readmePath, readmeContent, 'utf8');
    console.log('✅ README.md 生成成功!');
    console.log('文件路径:', readmePath);
    return true;
  } catch (error) {
    console.error('❌ 生成README失败:', error.message);
    return false;
  }
}

/**
 * 获取项目基本信息
 */
function getProjectInfo(rootDir) {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const info = {
    name: path.basename(rootDir),
    description: '',
    version: '1.0.0',
    author: '',
    scripts: {},
    dependencies: {},
    devDependencies: {}
  };
  
  // 尝试读取package.json
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      info.name = packageJson.name || info.name;
      info.description = packageJson.description || '';
      info.version = packageJson.version || '1.0.0';
      info.author = packageJson.author || '';
      info.scripts = packageJson.scripts || {};
      info.dependencies = packageJson.dependencies || {};
      info.devDependencies = packageJson.devDependencies || {};
    } catch (error) {
      console.warn('⚠️  读取package.json失败:', error.message);
    }
  }
  
  return info;
}

/**
 * 获取目录结构
 */
function getDirectoryStructure(dir, depth = 0, maxDepth = 3) {
  if (depth > maxDepth) return null;
  
  const items = [];
  const files = fs.readdirSync(dir).sort(compareNames);
  
  // 过滤掉隐藏文件和node_modules
  const filteredFiles = files.filter(file => {
    return !file.startsWith('.') && file !== 'node_modules' && file !== 'README.md';
  });
  
  for (const file of filteredFiles) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      const subDir = getDirectoryStructure(filePath, depth + 1, maxDepth);
      if (subDir) {
        items.push({
          name: file + '/',
          type: 'directory',
          children: subDir
        });
      }
    } else {
      items.push({
        name: file,
        type: 'file',
        size: stat.size,
        extension: path.extname(file)
      });
    }
  }
  
  return items.length > 0 ? items : null;
}

/**
 * 分析文件内容
 */
function analyzeFiles(dir) {
  const analysis = {
    totalFiles: 0,
    fileTypes: {},
    codeFiles: [],
    mainFiles: []
  };
  
  function analyzeDirectory(currentDir) {
    const files = fs.readdirSync(currentDir).sort(compareNames);
    
    for (const file of files) {
      if (file.startsWith('.') || file === 'node_modules' || file === 'README.md') {
        continue;
      }
      
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        analyzeDirectory(filePath);
      } else {
        analysis.totalFiles++;
        
        const ext = path.extname(file).toLowerCase();
        analysis.fileTypes[ext] = (analysis.fileTypes[ext] || 0) + 1;
        
        // 识别代码文件
        const codeExtensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.go', '.rs'];
        if (codeExtensions.includes(ext)) {
          analysis.codeFiles.push({
            name: file,
            path: path.relative(dir, filePath),
            size: stat.size
          });
        }
        
        // 识别主要文件
        const mainFileNames = ['index', 'main', 'app', 'server', 'client'];
        if (mainFileNames.some(name => file.toLowerCase().includes(name))) {
          analysis.mainFiles.push({
            name: file,
            path: path.relative(dir, filePath),
            size: stat.size
          });
        }
      }
    }
  }
  
  analyzeDirectory(dir);
  analysis.codeFiles = sortByPath(analysis.codeFiles);
  analysis.mainFiles = sortByPath(analysis.mainFiles);
  return analysis;
}

/**
 * 构建README内容
 */
function buildReadmeContent(projectInfo, directoryStructure, fileAnalysis) {
  let content = `# ${projectInfo.name}\n\n`;
  
  if (projectInfo.description) {
    content += `> ${projectInfo.description}\n\n`;
  }
  
  content += `**版本:** ${projectInfo.version}  
`;
  if (projectInfo.author) {
    content += `**作者:** ${projectInfo.author}  
`;
  }
  content += `\n---\n\n`;
  
  // 项目概述
  content += `## 📋 项目概述\n\n`;
  content += `本项目包含 ${fileAnalysis.totalFiles} 个文件，涵盖多种文件类型。\n\n`;
  
  // 文件类型统计
  content += `### 📊 文件类型统计\n\n`;
  content += `| 文件类型 | 数量 |\n`;
  content += `|---------|------|\n`;
  const sortedFileTypes = Object.entries(fileAnalysis.fileTypes).sort(([left], [right]) =>
    compareNames(left, right)
  );
  for (const [ext, count] of sortedFileTypes) {
    const extName = ext || '(无扩展名)';
    content += `| ${extName} | ${count} |\n`;
  }
  content += `\n`;
  
  // 主要文件
  if (fileAnalysis.mainFiles.length > 0) {
    content += `### 🎯 主要文件\n\n`;
    fileAnalysis.mainFiles.forEach(file => {
      content += `- **${file.name}** - ${file.path}\n`;
    });
    content += `\n`;
  }
  
  // 代码文件
  if (fileAnalysis.codeFiles.length > 0) {
    content += `### 💻 代码文件\n\n`;
    fileAnalysis.codeFiles.forEach(file => {
      content += `- **${file.name}**\n`;
    });
    content += `\n`;
  }
  
  // 目录结构
  content += `## 📁 目录结构\n\n`;
  content += `\`\`\`\n`;
  content += formatDirectoryStructure(directoryStructure);
  content += `\`\`\`\n\n`;
  
  // 依赖信息
  if (Object.keys(projectInfo.dependencies).length > 0 || Object.keys(projectInfo.devDependencies).length > 0) {
    content += `## 📦 依赖信息\n\n`;
    
    if (Object.keys(projectInfo.dependencies).length > 0) {
      content += `### 生产依赖\n\n`;
      for (const [name, version] of Object.entries(projectInfo.dependencies)) {
        content += `- **${name}**: \`${version}\`\n`;
      }
      content += `\n`;
    }
    
    if (Object.keys(projectInfo.devDependencies).length > 0) {
      content += `### 开发依赖\n\n`;
      for (const [name, version] of Object.entries(projectInfo.devDependencies)) {
        content += `- **${name}**: \`${version}\`\n`;
      }
      content += `\n`;
    }
  }
  
  // 脚本命令
  if (Object.keys(projectInfo.scripts).length > 0) {
    content += `## 🚀 可用脚本\n\n`;
    for (const [name, command] of Object.entries(projectInfo.scripts)) {
      content += `- \`npm run ${name}\`: ${command}\n`;
    }
    content += `\n`;
  }
  
  // 使用说明
  content += `## 📖 使用说明\n\n`;
  content += `1. 本README文档由脚本自动生成\n`;
  content += `2. 如需修改，请编辑源文件或重新运行生成脚本\n`;
  content += `3. 提交前会自动刷新 README 内容\n\n`;
  
  content += `---\n\n`;
  content += `*此文档由自动生成脚本维护。*\n`;
  
  return content;
}

/**
 * 格式化目录结构
 */
function formatDirectoryStructure(structure, prefix = '') {
  if (!structure) return '';
  
  let result = '';
  for (let i = 0; i < structure.length; i++) {
    const item = structure[i];
    const isLast = i === structure.length - 1;
    const currentPrefix = isLast ? '└── ' : '├── ';
    const childPrefix = isLast ? '    ' : '│   ';
    
    result += prefix + currentPrefix + item.name + '\n';
    
    if (item.type === 'directory' && item.children) {
      result += formatDirectoryStructure(item.children, prefix + childPrefix);
    }
  }
  return result;
}

/**
 * 格式化文件大小
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 导出函数
 */
module.exports = {
  generateREADME,
  getProjectInfo,
  getDirectoryStructure,
  analyzeFiles,
  buildReadmeContent
};

// 如果直接运行此文件，则执行生成README
if (require.main === module) {
  process.exitCode = generateREADME() ? 0 : 1;
}

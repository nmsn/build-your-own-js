const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '..');
const gitDir = path.join(repoRoot, '.git');
const hooksPath = '.githooks';

if (!fs.existsSync(gitDir)) {
  console.warn('跳过 Git hooks 安装: 当前目录不是 Git 仓库。');
  process.exit(0);
}

try {
  execFileSync('git', ['config', 'core.hooksPath', hooksPath], {
    cwd: repoRoot,
    stdio: 'inherit',
  });
  console.log(`已配置 Git hooks 路径: ${hooksPath}`);
} catch (error) {
  console.error('配置 Git hooks 失败:', error.message);
  process.exit(1);
}

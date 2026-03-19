const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  generateREADME,
  buildReadmeContent,
  getProjectInfo,
  getDirectoryStructure,
  analyzeFiles,
} = require('../generate-readme');

function withTempProject(files, run) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'readme-gen-'));

  for (const [relativePath, contents] of Object.entries(files)) {
    const targetPath = path.join(tempDir, relativePath);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, contents, 'utf8');
  }

  return run(tempDir);
}

test('buildReadmeContent is deterministic for identical inputs', () => {
  const fixture = {
    name: 'demo-project',
    description: 'fixture project',
    version: '1.0.0',
    author: 'tester',
    scripts: { test: 'node --test' },
    dependencies: {},
    devDependencies: {},
  };

  const structure = [
    { name: 'b.js', type: 'file', size: 10, extension: '.js' },
    { name: 'a.js', type: 'file', size: 10, extension: '.js' },
  ];

  const analysis = {
    totalFiles: 2,
    fileTypes: { '.js': 2 },
    codeFiles: [
      { name: 'b.js', path: 'b.js', size: 10 },
      { name: 'a.js', path: 'a.js', size: 10 },
    ],
    mainFiles: [],
  };

  const first = buildReadmeContent(fixture, structure, analysis);
  const second = buildReadmeContent(fixture, structure, analysis);

  assert.equal(first, second);
});

test('generated README content does not include volatile generation dates', () => {
  const fixture = {
    name: 'demo-project',
    description: 'fixture project',
    version: '1.0.0',
    author: 'tester',
    scripts: {},
    dependencies: {},
    devDependencies: {},
  };

  const content = buildReadmeContent(fixture, [], {
    totalFiles: 0,
    fileTypes: {},
    codeFiles: [],
    mainFiles: [],
  });

  assert.equal(content.includes('生成日期'), false);
  assert.equal(content.includes('生成时间'), false);
  assert.equal(content.includes('创建于'), false);
});

test('generateREADME writes README.md for the current working directory', () => {
  withTempProject(
    {
      'package.json': JSON.stringify(
        {
          name: 'temp-project',
          version: '1.0.0',
          author: 'tester',
          scripts: { ur: 'node generate-readme.js' },
        },
        null,
        2
      ),
      'src/index.js': 'console.log("hello");\n',
    },
    (tempDir) => {
      const previousCwd = process.cwd();

      try {
        process.chdir(tempDir);
        generateREADME();

        const readmePath = path.join(tempDir, 'README.md');
        const content = fs.readFileSync(readmePath, 'utf8');

        assert.match(content, /# temp-project/);
        assert.equal(content.includes('生成日期'), false);
      } finally {
        process.chdir(previousCwd);
      }
    }
  );
});

test('project analysis is stable for a fixture directory', () => {
  withTempProject(
    {
      'package.json': JSON.stringify({ name: 'temp-project', version: '1.0.0' }, null, 2),
      'src/b.js': 'module.exports = 2;\n',
      'src/a.js': 'module.exports = 1;\n',
      'index.js': 'require("./src/a");\n',
    },
    (tempDir) => {
      const info = getProjectInfo(tempDir);
      const structure = getDirectoryStructure(tempDir);
      const analysis = analyzeFiles(tempDir);
      const content = buildReadmeContent(info, structure, analysis);

      assert.match(content, /# temp-project/);
      assert.match(content, /src\//);
      assert.match(content, /a\.js/);
      assert.match(content, /b\.js/);
    }
  );
});

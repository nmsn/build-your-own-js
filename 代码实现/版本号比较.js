// 版本号比较
// 返回值:
// 1  -> version1 > version2
// -1 -> version1 < version2
// 0  -> version1 === version2
function compareVersion(version1, version2) {
  const parts1 = String(version1).split('.');
  const parts2 = String(version2).split('.');
  const maxLength = Math.max(parts1.length, parts2.length);

  for (let i = 0; i < maxLength; i++) {
    const num1 = Number(parts1[i] || 0);
    const num2 = Number(parts2[i] || 0);

    if (num1 > num2) {
      return 1;
    }

    if (num1 < num2) {
      return -1;
    }
  }

  return 0;
}

function testCompareVersion() {
  const testCases = [
    ['1.0', '1', 0],
    ['1.01', '1.001', 0],
    ['1.0.1', '1', 1],
    ['1.0.0', '1.0.1', -1],
    ['2.1', '2.0.9', 1],
    ['3.0.0', '3.0.0', 0],
  ];

  testCases.forEach(([version1, version2, expected]) => {
    const result = compareVersion(version1, version2);
    console.log(
      `${version1} vs ${version2} => ${result} ${result === expected ? '✓' : '✗'}`
    );
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = compareVersion;
} else {
  testCompareVersion();
}

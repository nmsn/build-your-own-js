// 数组处理千分位分割函数
// 更好理解的版本（增强版：增加类型判断和正负号处理）
function thousandsSeparator(n) {
  // 输入类型判断
  if (typeof n !== 'number' && typeof n !== 'string') {
    throw new TypeError('Input must be a number or string');
  }
  
  // 转换为字符串
  const [integerPart, decimalPart] = n.toString().split(".");
  
  // 处理负数
  const isNegative = integerPart.startsWith('-');
  const integerStr = isNegative ? integerPart.slice(1) : integerPart;
  
  const integer = integerStr.split("");
  integer.reverse();
  const decimal = decimalPart;
  const newInteger = [];
  
  for (let i = 0; i < integer.length; i++) {
    if (i % 3 === 0 && i !== 0) {
      newInteger.push(",");
    }
    newInteger.push(integer[i]);
  }
  
  newInteger.reverse();
  let s = newInteger.join("");
  
  // 添加负号
  if (isNegative) {
    s = '-' + s;
  }
  
  if (decimal) {
    s += `.${decimal}`;
  }
  
  return s;
}

// 优化版本的千分位分割函数
// 优化点：
// 1. 使用正则表达式，代码更简洁
// 2. 性能更好，减少数组操作
// 3. 支持更多输入类型
// 4. 处理边界情况更完善
function thousandsSeparatorOptimized(n) {
  // 输入验证
  if (typeof n !== 'number' && typeof n !== 'string') {
    throw new TypeError('Input must be a number or string');
  }
  
  // 转换为字符串并处理科学计数法
  const numStr = Number(n).toString();
  const [integerPart, decimalPart] = numStr.split('.');
  
  // 处理负数
  const isNegative = integerPart.startsWith('-');
  const digits = isNegative ? integerPart.slice(1) : integerPart;
  
  // 使用正则表达式添加千分位分隔符
  const formattedInteger = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // 添加负号
  let result = isNegative ? '-' + formattedInteger : formattedInteger;
  
  // 添加小数部分
  if (decimalPart !== undefined) {
    result += '.' + decimalPart;
  }
  
  return result;
}

// 使用 Intl.NumberFormat 的千分位分割函数
function thousandsSeparatorIntl(n) {
  
  try {
  const formatter = new Intl.NumberFormat('en-US');
  return formatter.format(Number(n));
  } catch (error) {
    throw new Error(`Failed to format percentage: ${error.message}`);
  }
}

// 测试用例
function testThousandsSeparator() {
  const testCases = [
    { input: 1234567, expected: '1,234,567' },
    { input: -1234567.89, expected: '-1,234,567.89' },
    { input: '1234567.1234', expected: '1,234,567.1234' },
    { input: 123, expected: '123' },
    { input: 1234, expected: '1,234' },
    { input: 0, expected: '0' },
    { input: -123.456, expected: '-123.456' },
  ];
  
  console.log('=== 测试原始版本 ===');
  testCases.forEach(({ input, expected }) => {
    const result = thousandsSeparator(input);
    console.log(`${input} -> ${result} ${result === expected ? '✓' : '✗'}`);
  });
  
  console.log('\n=== 测试优化版本 ===');
  testCases.forEach(({ input, expected }) => {
    const result = thousandsSeparatorOptimized(input);
    console.log(`${input} -> ${result} ${result === expected ? '✓' : '✗'}`);
  });
  
  console.log('\n=== 测试 Intl 版本 ===');
  testCases.forEach(({ input, expected }) => {
    const result = thousandsSeparatorIntl(input);
    console.log(`${input} -> ${result} ${result === expected ? '✓' : '✗'}`);
  });
}
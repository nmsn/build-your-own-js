/**
 * 手写实现 Function.prototype.call
 * 使用最新 ES 语法特性
 */

// 方法一：使用 Symbol 避免属性名冲突 + 剩余参数
Function.prototype.myCall = function(context, ...args) {
  // 处理 context 为 null 或 undefined 的情况
  context = context ?? globalThis;
  
  // 如果 context 不是对象，转换为对象
  if (typeof context !== 'object') {
    context = Object(context);
  }
  
  // 使用 Symbol 创建唯一属性名，避免冲突
  const fnSymbol = Symbol('fn');
  
  // 将当前函数作为 context 的方法
  context[fnSymbol] = this;
  
  // 调用函数并获取结果
  const result = context[fnSymbol](...args);
  
  // 删除临时属性
  delete context[fnSymbol];
  
  return result;
};

// 方法二：使用 Reflect.apply（更现代的方式）
Function.prototype.myCall2 = function(context, ...args) {
  // 处理 context
  context = context ?? globalThis;
  
  if (typeof context !== 'object') {
    context = Object(context);
  }
  
  // 使用 Reflect.apply 调用函数
  return Reflect.apply(this, context, args);
};

// 方法三：使用 WeakMap 存储临时函数（避免污染对象）
const tempFnMap = new WeakMap();

Function.prototype.myCall3 = function(context, ...args) {
  context = context ?? globalThis;
  
  if (typeof context !== 'object') {
    context = Object(context);
  }
  
  // 使用 WeakMap 存储函数，避免污染 context
  tempFnMap.set(context, this);
  const fn = tempFnMap.get(context);
  
  // 创建临时属性执行函数
  const fnSymbol = Symbol('fn');
  context[fnSymbol] = fn;
  
  const result = context[fnSymbol](...args);
  
  delete context[fnSymbol];
  tempFnMap.delete(context);
  
  return result;
};

// 测试用例
console.log('=== Function.prototype.call 实现测试 ===\n');

// 测试对象
const person = {
  name: 'Alice',
  age: 25
};

const person2 = {
  name: 'Bob',
  age: 30
};

// 测试函数
function introduce(greeting, punctuation = '!') {
  return `${greeting}, I'm ${this.name}, ${this.age} years old${punctuation}`;
}

const arrowIntroduce = (greeting, punctuation = '!') => {
  // 注意：箭头函数没有自己的 this，这里仅用于演示
  return `${greeting}, I'm someone${punctuation}`;
};

// 测试普通函数
console.log('1. 普通函数测试：');
console.log('原生 call:', introduce.call(person, 'Hello', '.'));
console.log('myCall:', introduce.myCall(person, 'Hello', '.'));
console.log('myCall2:', introduce.myCall2(person, 'Hello', '.'));
console.log('myCall3:', introduce.myCall3(person, 'Hello', '.'));

console.log('\n2. 不同 context 测试：');
console.log('原生 call:', introduce.call(person2, 'Hi'));
console.log('myCall:', introduce.myCall(person2, 'Hi'));

console.log('\n3. null/undefined context 测试：');
function showThis() {
  return this;
}
console.log('null context - 原生:', typeof showThis.call(null));
console.log('null context - myCall:', typeof showThis.myCall(null));

console.log('\n4. 基本类型 context 测试：');
function getType() {
  return typeof this;
}
console.log('数字 context - 原生:', getType.call(123));
console.log('数字 context - myCall:', getType.myCall(123));
console.log('字符串 context - 原生:', getType.call('hello'));
console.log('字符串 context - myCall:', getType.myCall('hello'));

console.log('\n5. 无参数测试：');
function simple() {
  return `Hello from ${this.name || 'unknown'}`;
}
console.log('原生 call:', simple.call(person));
console.log('myCall:', simple.myCall(person));

console.log('\n6. 返回值测试：');
function calculate(a, b) {
  return a + b + (this.bonus || 0);
}
const calculator = { bonus: 10 };
console.log('原生 call:', calculate.call(calculator, 5, 3));
console.log('myCall:', calculate.myCall(calculator, 5, 3));

// 性能测试
console.log('\n=== 性能测试 ===');
const iterations = 100000;

console.time('原生 call');
for (let i = 0; i < iterations; i++) {
  introduce.call(person, 'Hello', '!');
}
console.timeEnd('原生 call');

console.time('myCall (Symbol)');
for (let i = 0; i < iterations; i++) {
  introduce.myCall(person, 'Hello', '!');
}
console.timeEnd('myCall (Symbol)');

console.time('myCall2 (Reflect)');
for (let i = 0; i < iterations; i++) {
  introduce.myCall2(person, 'Hello', '!');
}
console.timeEnd('myCall2 (Reflect)');

// 面试要点总结
console.log('\n=== 面试要点总结 ===');
console.log(`
1. call 方法的核心原理：
   - 将函数作为目标对象的方法调用
   - 改变函数执行时的 this 指向

2. 现代 ES 语法特性使用：
   - 剩余参数 (...args) 替代 arguments
   - 空值合并运算符 (??) 处理 null/undefined
   - Symbol 创建唯一属性名避免冲突
   - Reflect.apply 提供更现代的函数调用方式
   - WeakMap 避免内存泄漏

3. 边界情况处理：
   - context 为 null/undefined 时指向 globalThis
   - context 为基本类型时需要装箱转换
   - 避免属性名冲突
   - 正确处理返回值

4. 性能考虑：
   - Reflect.apply 性能最佳
   - Symbol 方式兼容性好
   - WeakMap 方式内存友好
`);
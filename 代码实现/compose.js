/**
 * compose 函数实现
 * 将多个函数组合成一个函数，从右到左执行
 * compose(f, g, h) 等价于 (...args) => f(g(h(...args)))
 */

// 基础实现
function compose(...fns) {
  if (fns.length === 0) {
    return (arg) => arg;
  }

  if (fns.length === 1) {
    return fns[0];
  }

  // 注意这里：每次的执行结果都是返回一个函数，因此 a 是累计的函数（不是执行结果）
  return fns.reduce(
    (a, b) =>
      // 下面这个才是返回的执行函数
      (...args) =>
        a(b(...args))
  );
}

// 更清晰的实现方式
function compose2(...fns) {
  return function (value) {
    return fns.reduceRight((acc, fn) => fn(acc), value);
  };
}

// 使用循环实现的方案
function composeWithLoop(...fns) {
  if (fns.length === 0) {
    return (arg) => arg;
  }

  if (fns.length === 1) {
    return fns[0];
  }

  return function (...args) {
    let result = fns[fns.length - 1](...args); // 从最后一个函数开始执行

    // 从倒数第二个函数开始，向前遍历
    for (let i = fns.length - 2; i >= 0; i--) {
      result = fns[i](result);
    }

    return result;
  };
}

// 使用示例
const add = (x) => x + 1;
const multiply = (x) => x * 2;
const square = (x) => x * x;

// 基础用法
const composedFn = compose(square, multiply, add);
console.log(composedFn(3)); // square(multiply(add(3))) = square(multiply(4)) = square(8) = 64

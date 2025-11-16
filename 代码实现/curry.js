// 版本1: 基础版本 - 当前实现
function curry(fn, ...args) {
  return fn.length <= args.length ? fn(...args) : curry.bind(null, fn, ...args);
}

// 不用 bind 的实现（更冗长，但更好理解）
function curry(fn, ...args) {
  if (fn.length <= args.length) {
    return fn(...args);
  }
  
  return function(...newArgs) {
    return curry(fn, ...args, ...newArgs);
  };
}
const shallowClone = (target) => {
  // 基本数据类型，直接返回
  if (typeof target !== "object" || target === null) return target;

  // 处理特殊对象类型
  if (target instanceof Date) return new Date(target.getTime());
  if (target instanceof RegExp) return new RegExp(target);
  if (target instanceof Map) return new Map(target);
  if (target instanceof Set) return new Set(target);
  if (typeof target === 'function') return target; // 函数通常不需要克隆

  // 创建新的对象或数组
  const cloneTarget = Array.isArray(target) ? [] : {};

  // 复制所有可枚举属性
  for (let prop in target) {
    if (target.hasOwnProperty(prop)) {
      cloneTarget[prop] = target[prop];
    }
  }

  // 处理 Symbol 类型的键
  const symbolProps = Object.getOwnPropertySymbols(target);
  if (symbolProps.length > 0) {
    symbolProps.forEach(symbol => {
      cloneTarget[symbol] = target[symbol];
    });
  }

  return cloneTarget;
};
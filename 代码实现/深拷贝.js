const completeDeepClone = (target, map = new WeakMap()) => {
  // 基本数据类型，直接返回
  if (typeof target !== "object" || target === null) return target;

  // 处理特殊对象类型
  if (target instanceof Date) return new Date(target.getTime());
  if (target instanceof RegExp) return new RegExp(target.source, target.flags);
  if (target instanceof Function) return target; // 函数通常不需要深拷贝

  // 处理Map和Set
  if (target instanceof Map) {
    const newMap = new Map();
    map.set(target, newMap); // 先存储引用关系，防止循环引用
    target.forEach((value, key) => {
      newMap.set(completeDeepClone(key, map), completeDeepClone(value, map));
    });
    return newMap;
  }

  if (target instanceof Set) {
    const newSet = new Set();
    map.set(target, newSet); // 先存储引用关系，防止循环引用
    target.forEach((value) => {
      newSet.add(completeDeepClone(value, map));
    });
    return newSet;
  }

  // 检查循环引用
  if (map.has(target)) {
    return map.get(target);
  }

  // 创建新的对象或数组
  const cloneTarget = Array.isArray(target) ? [] : {};

  // 存储引用关系
  map.set(target, cloneTarget);

  // 复制所有可枚举属性
  for (let prop in target) {
    if (target.hasOwnProperty(prop)) {
      cloneTarget[prop] = completeDeepClone(target[prop], map);
    }
  }

  // 处理Symbol类型的键
  const symbolProps = Object.getOwnPropertySymbols(target);
  if (symbolProps.length > 0) {
    symbolProps.forEach((symbol) => {
      cloneTarget[symbol] = completeDeepClone(target[symbol], map);
    });
  }

  return cloneTarget;
};

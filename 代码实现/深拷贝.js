/**
 * 深拷贝有两个需要注意的点
 * 1. 循环引用问题（通过 weakmap 解决）
 * 2. 递归爆栈问题（通常不会遇到，如果遇到，通过递归该循环来进行优化）
 */

// 辅助函数
function isObject(x) {
    return Object.prototype.toString.call(x) === '[object Object]';
}

// 简易版深拷贝
function cloneDeep(source, hash = new WeakMap()) {
  if (!isObject(source)) return source
  if (hash.has(source)) return hash.get(source)

  var target = Array.isArray(source) ? [] : {}
  hash.set(source, target)

  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (isObject(source[key])) {
        target[key] = cloneDeep(source[key], hash)
      } else {
        target[key] = source[key]
      }
    }
  }
  return target
}

// 处理爆栈版（了解即可）
function cloneDeep(x) {
  const root = {}

  const loopList = [
    {
      parent: root,
      key: undefined,
      data: x,
    },
  ]

  while (loopList.length) {
    const node = loopList.pop()
    const parent = node.parent
    const key = node.key
    const data = node.data

    let res = parent
    if (typeof key !== 'undefined') {
      res = parent[key] = {}
    }

    for (let k in data) {
      if (data.hasOwnProperty(k)) {
        if (typeof data[k] === 'object') {
          loopList.push({
            parent: res,
            key: k,
            data: data[k],
          })
        } else {
          res[k] = data[k]
        }
      }
    }
  }

  return root
}

// 完全版深拷贝
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
      // 此处就是递归调用时，可能出现爆栈
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

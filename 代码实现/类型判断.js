function getType(value) {
  // 处理 null（typeof null === 'object' 的特殊情况）
  if (value === null) {
    return 'null';
  }
  
  // 处理基本类型
  const primitiveType = typeof value;
  if (primitiveType !== 'object') {
    return primitiveType;
  }
  
  // 处理对象类型，使用 Object.prototype.toString 获取精确类型
  const objectType = Object.prototype.toString.call(value);
  // 从 "[object Array]" 中提取 "Array"
  return objectType.slice(8, -1).toLowerCase();
}

// 更完善的类型判断函数
function getDetailedType(value) {
  // null 特殊处理
  if (value === null) return 'null';
  
  // undefined 处理
  if (value === undefined) return 'undefined';
  
  // 基本类型
  const primitiveType = typeof value;
  if (primitiveType !== 'object') {
    return primitiveType;
  }
  
  // 获取具体的对象类型
  const tag = Object.prototype.toString.call(value);
  const type = tag.slice(8, -1).toLowerCase();
  
  // 特殊类型的进一步判断
  if (type === 'object') {
    // 判断是否为纯对象
    if (value.constructor === Object) {
      return 'plainobject';
    }
    // 判断是否为自定义类实例
    return 'object';
  }
  
  return type;
}

// 具体类型判断工具函数
const typeUtils = {
  isArray: (value) => Array.isArray(value),
  isObject: (value) => value !== null && typeof value === 'object' && !Array.isArray(value),
  isPlainObject: (value) => {
    if (typeof value !== 'object' || value === null) return false;
    if (Object.getPrototypeOf(value) === null) return true;
    let proto = value;
    while (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(value) === proto;
  },
  isFunction: (value) => typeof value === 'function',
  isString: (value) => typeof value === 'string',
  isNumber: (value) => typeof value === 'number' && !isNaN(value),
  isBoolean: (value) => typeof value === 'boolean',
  isNull: (value) => value === null,
  isUndefined: (value) => value === undefined,
  isSymbol: (value) => typeof value === 'symbol',
  isBigInt: (value) => typeof value === 'bigint',
  isDate: (value) => value instanceof Date && !isNaN(value),
  isRegExp: (value) => value instanceof RegExp,
  isError: (value) => value instanceof Error,
  isPromise: (value) => value && typeof value.then === 'function',
  isArrayLike: (value) => {
    return value != null && 
           typeof value !== 'function' && 
           typeof value.length === 'number' && 
           value.length >= 0 && 
           value.length <= Number.MAX_SAFE_INTEGER;
  },
  isEmpty: (value) => {
    if (value == null) return true;
    if (Array.isArray(value) || typeof value === 'string') return value.length === 0;
    if (value instanceof Map || value instanceof Set) return value.size === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }
};

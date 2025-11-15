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

// 或者更简单的版本
function getType(data) {
  // 获取到 "[object Type]"，其中 Type 是 Null、Undefined、Array、Function、Error、Boolean、Number、String、Date、RegExp 等。
  const originType = Object.prototype.toString.call(data)
  // 可以直接截取第8位和倒数第一位，这样就获得了 Null、Undefined、Array、Function、Error、Boolean、Number、String、Date、RegExp 等
  const type = originType.slice(8, -1)
  // 再转小写，得到 null、undefined、array、function 等
  return type.toLowerCase()
}

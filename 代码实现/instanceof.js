function instanceOf(instance, constructor) {
  // 处理原始类型和 null
  if (instance === null || typeof instance !== 'object' && typeof instance !== 'function') {
    return false;
  }
  
  const classProto = constructor.prototype;
  let proto = Object.getPrototypeOf(instance);
  
  // 循环上上次查找
  while (proto !== null) {
    if (proto === classProto) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
  
  return false;
}
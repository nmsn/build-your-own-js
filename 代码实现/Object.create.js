function create(obj) {
	function F() {}
  F.prototype = obj
  return new F();
}

// Object.create(proto, {
//   prop1: { value: 42, writable: true },
//   prop2: { value: 'hello' }
// })

// 增加参数输入版本
function create(obj, propertiesObject) {
  function F() {}
  F.prototype = obj;
  const newObj = new F();
  
  if (propertiesObject !== undefined) {
    Object.defineProperties(newObj, propertiesObject);
  }
  
  return newObj;
}
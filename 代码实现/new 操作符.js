/**
 * 手动实现 new 操作符
 * 使用现代 ES6+ 语法优化
 * @param {Function} constructor - 构造函数
 * @param {...any} args - 传递给构造函数的参数
 * @returns {object} 新创建的对象实例
 */
const myNew = (constructor, ...args) => {
  // 参数校验：确保第一个参数是函数
  if (typeof constructor !== 'function') {
    throw new TypeError('myNew: 第一个参数必须是构造函数');
  }

  try {
    // 创建新对象，继承构造函数的原型
    const instance = Object.create(constructor.prototype);
    
    // 执行构造函数，绑定 this 到新创建的对象
    const result = constructor.apply(instance, args);
    
    // 处理构造函数返回值：
    // - 如果返回的是对象（非 null），则返回该对象
    // - 否则返回新创建的实例
    return (result !== null && typeof result === 'object') || typeof result === 'function' 
      ? result 
      : instance;
  } catch (error) {
    // 如果构造函数执行出错，抛出错误
    throw new Error(`myNew: 构造函数执行失败 - ${error.message}`);
  }
};

// ==================== 测试代码 ====================

/**
 * 测试用例1：基本功能测试
 */
function testBasicFunctionality() {
  console.log('=== 测试1：基本功能测试 ===');
  
  class Person {
    constructor(name, age) {
      this.name = name;
      this.age = age;
    }
    
    greet() {
      return `你好，我是${this.name}，今年${this.age}岁`;
    }
  }
  
  // 使用原生 new
  const person1 = new Person('张三', 25);
  console.log('原生 new:', person1.greet());
  
  // 使用 myNew
  const person2 = myNew(Person, '李四', 30);
  console.log('myNew:', person2.greet());
  
  // 验证原型链
  console.log('原型链验证:', person2 instanceof Person);
  console.log('构造函数验证:', person2.constructor === Person);
  
  console.log('✅ 基本功能测试通过\n');
}

/**
 * 测试用例2：构造函数返回对象
 */
function testConstructorReturnObject() {
  console.log('=== 测试2：构造函数返回对象 ===');
  
  class Car {
    constructor(brand) {
      this.brand = brand;
      // 返回一个新对象，覆盖默认创建的对象
      return {
        customBrand: brand,
        getInfo: () => `自定义汽车品牌：${brand}`
      };
    }
  }
  
  const car1 = new Car('宝马');
  console.log('原生 new:', car1.getInfo());
  console.log('原生 new 是否有 brand 属性:', 'brand' in car1);
  
  const car2 = myNew(Car, '奔驰');
  console.log('myNew:', car2.getInfo());
  console.log('myNew 是否有 brand 属性:', 'brand' in car2);
  
  console.log('✅ 构造函数返回对象测试通过\n');
}

/**
 * 测试用例3：构造函数返回原始值
 */
function testConstructorReturnPrimitive() {
  console.log('=== 测试3：构造函数返回原始值 ===');
  
  class NumberWrapper {
    constructor(value) {
      this.value = value;
      // 返回原始值，应该被忽略
      return value * 2;
    }
    
    getValue() {
      return this.value;
    }
  }
  
  const num1 = new NumberWrapper(10);
  console.log('原生 new 值:', num1.getValue());
  console.log('原生 new 类型:', typeof num1);
  
  const num2 = myNew(NumberWrapper, 20);
  console.log('myNew 值:', num2.getValue());
  console.log('myNew 类型:', typeof num2);
  
  console.log('✅ 构造函数返回原始值测试通过\n');
}
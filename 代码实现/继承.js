/**
 * 类式继承（原型链继承）
 * 缺点：
 * 1.父类中的共有属性如果为引用类型，会在子类中被所有实例公用。如果子类实例改变共有属性会影响父类。
 * 2.子类实现的继承是靠其原型prototype对父类的实例化实现的，因此在创建父类的时候，是无法向父类传递参数的。 // TODO 没理解为何不能传递参数
 */

 
function SuperClass() {
  this.superValue = true;
}

SuperClass.prototype.getSuperValue = function () {
  return this.superValue;
}

function SubClass() {
  this.subValue = false;
}

SubClass.prototype = new SuperClass();
SubClass.prototype.getSuperValue = function () {
  return this.subValue;
}

/**
 * 构造函数继承
 * 缺点：
 * 1.父类的原型方法不会被子类继承
 */

function SuperClass(id) {
  this.books = ['JavaScript', 'html', 'css'];
  this.id = id;
}

SuperClass.prototype.showBooks = function() {
  console.log(this.books);
}

function SubClass(id) {
  // 将子类中的变量在父类中执行一遍
  SuperClass.call(this, id);
}

/**
 * 组合继承
 * 缺点：
 * 1.父类构造函数调用两边
 */

function SuperClass(name) {
  this.name = name;
  this.books = ['JavaScript', 'html', 'css'];
}

SuperClass.prototype.getName = function() {
  console.log(this.name);
}

function SubClass(name, time) {
  SuperClass.call(this, name); // 1
  this.time = time;
}

SubClass.prototype = new SuperClass(); // 2
SubClass.prototype.getTime = function() {
  console.log(this.time);
}

/**
 * 原型式继承
 * 缺点：
 * 1.同样有共有属性引用类型问题
 */

function inheritObject(o) {
  function F() {} // 声明一个过度函数对象
  F.prototype = o; // 过渡对象的原型继承父对象
  return new F(); // 返回过渡对象的一个实例，该实例的原型继承了父对象
}

/**
 * 寄生式继承
 * 对原型继承二次封装，添加新属性和方法
 */

const book = {
  name: 'js book',
  alikeBook: ['css book', 'html book'],
};

function createBook() {
  var o = new inheritObject(book);
  
  o.getName = function() {
    console.log(name);
  };
  
  return o;
}

/**
 * 寄生组合式继承
 */

function inheritPrototype(subClass, superClass) {
  // 使用父类的原型而非构造函数（复制一份父类的原型副本保存在变量中）
  var p = inheritObject(superClass.prototype); 
  
  // 对父类原型对象复制得到的复制对象p中的contructor指向的不是subClass子类对象（修正因为重写子类原型导致的constructor属性被修改）
  p.constructor = subClass;
  
  subClass.prototype = p; // 设置子类的原型
}
// softBind:
// 只有在 this 落到默认绑定（undefined / null / 全局对象）时，
// 才使用默认对象；显式绑定、隐式绑定、new 绑定都应覆盖默认值。

Function.prototype.softBind = function(defaultCtx, ...outerArgs) {
  if (typeof this !== 'function') {
    throw new TypeError('Function.prototype.softBind can only be called on functions');
  }

  const fn = this;
  const globalObject = typeof globalThis !== 'undefined' ? globalThis : window;

  function bound(...innerArgs) {
    const ctx = !this || this === globalObject ? defaultCtx : this;
    return fn.apply(ctx, outerArgs.concat(innerArgs));
  }

  // 面向面试的写法通常要兼容 new：
  // new bound() 时，this 指向新实例，不应再回退到 defaultCtx。
  if (fn.prototype) {
    bound.prototype = Object.create(fn.prototype);
    bound.prototype.constructor = bound;
  }

  return bound;
};

function testSoftBind() {
  function show(prefix, suffix) {
    return `${prefix}${this.name}${suffix}`;
  }

  const defaultUser = { name: 'default' };
  const objUser = { name: 'obj', show: null };
  const explicitUser = { name: 'explicit' };

  const softShow = show.softBind(defaultUser, 'hi ');
  objUser.show = softShow;

  console.log('默认绑定:', softShow('!') === 'hi default!' ? '✓' : '✗');
  console.log('隐式绑定:', objUser.show('!') === 'hi obj!' ? '✓' : '✗');
  console.log('显式绑定:', softShow.call(explicitUser, '!') === 'hi explicit!' ? '✓' : '✗');
  console.log('传 null 使用默认值:', softShow.call(null, '!') === 'hi default!' ? '✓' : '✗');

  function Person(name) {
    this.name = name;
  }

  Person.prototype.getName = function() {
    return this.name;
  };

  const SoftPerson = Person.softBind(defaultUser);
  const p = new SoftPerson('constructed');

  console.log('new 绑定优先:', p.getName() === 'constructed' ? '✓' : '✗');
  console.log('原型链保留:', p instanceof Person ? '✓' : '✗');
}

testSoftBind();

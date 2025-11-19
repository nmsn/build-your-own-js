const User = {
  count: 1,
  getCount: function () {
    return this.count
  },
}
console.log('a ', User.getCount()) // what?
const func = User.getCount
console.log('b', func()) // what?


// a 1
// b undefined

const obj = {
  f1() {
    const fn = () => {
      console.log('this1', this)
    }
    fn()
    fn.call(window)
  },
  f2: () => {
    function fn() {
      console.log('this2', this)
    }
    fn()
    fn.call(this)
  },
}
obj.f1()
obj.f2()


// this1 obj this1 obj
// this2 window this2 window
// 普通函数在作为对象方法调用时，this 指向调用者
// 箭头函数不受调用方式影响，this 取决于定义时的外层作用域

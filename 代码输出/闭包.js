const n = 10
function print() {
  console.log(n)
}

function f1(fn) {
  const n = 20
  fn()
}
f1(print)

// 10
// JS 采用词法作用域，也就是静态作用域。换句话说，函数的作用域在函数定义时就确定

function fn() {
  let num = 10
  return {
    set: (n) => (num = n),
    get: () => num,
  }
}

let num = 20
const { get, set } = fn()
console.log('result1: ', get())
set(100)
console.log('result2: ', num)

// 10 20
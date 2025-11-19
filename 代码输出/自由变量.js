let i
for (i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i)
  }, 0)
}

// 4 4 4

let n = 10
function f1() {
  n++
  function f2() {
    function f3() {
      n++
    }
    let n = 20
    f3()
    n++
  }
  f2()
  n++
}
f1()
console.log('n', n)

// 12
// f2 中的新声明的 n 不会影响 f1 中的 n


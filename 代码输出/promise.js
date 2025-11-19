const promise = new Promise((resolve, reject) => {
  console.log(1)
  console.log(2)
})
promise.then(() => {
  console.log(3)
})
console.log(4)


// 1 2 4
// 没有 resolve 输出不了 3


const promise2 = new Promise((resolve, reject) => {
  console.log(1)
  setTimeout(() => {
    console.log('timerStart')
    resolve('success')
    console.log('timerEnd')
  }, 0)
  console.log(2)
})
promise2.then((res) => {
  console.log(res)
})
console.log(4)

//1 2 4 timerStart timerEnd success
// timerEnd 在同步任务中执行

console.log('start')
setTimeout(() => {
  console.log('a')

  Promise.resolve().then(() => {
    console.log('c')
  })
})
Promise.resolve().then(() => {
  console.log('b')

  setTimeout(() => {
    console.log('d')
  })
})
console.log('end')

// start end b a c d

Promise.resolve()
  .then(() => {
    console.log(0)
    return Promise.resolve(4)
  })
  .then((res) => {
    console.log(res)
  })

Promise.resolve()
  .then(() => {
    console.log(1)
  })
  .then(() => {
    console.log(2)
  })
  .then(() => {
    console.log(3)
  })
  .then(() => {
    console.log(5)
  })
  .then(() => {
    console.log(6)
  })
  
// 0 1 2 3 4 5 6
// 这个题的重点在 Promise.resolve(4) 的执行时机

// 这是因为等待 Promise.resolve(4) 的解析需要一个微任务（这期间打印了 2），resolve 过程中发现是 Promise（准确的说是 thenable），V8 会进行一个不同处理，将其入列一个新任务，这期间打印了 3，然后在第四轮微任务中，第一个 Promise 打印 4，第 2 个 Promise 打印 5。


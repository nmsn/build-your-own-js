const PENDING  = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED  = 'rejected'

class MyPromise {
  #state = PENDING
  #value = undefined
  #handlers = []  // { onFulfilled, onRejected, resolve, reject }

  constructor(executor) {
    try {
      executor(this.#resolve.bind(this), this.#reject.bind(this))
    } catch (e) {
      this.#reject(e)
    }
  }

  #resolve(value) {
    if (this.#state !== PENDING) return
    // 如果 resolve 的值仍然是一个 thenable，继续展开
    if (value && typeof value.then === 'function') {
      value.then(this.#resolve.bind(this), this.#reject.bind(this))
      return
    }
    this.#state = FULFILLED
    this.#value = value
    this.#run()
  }

  #reject(reason) {
    if (this.#state !== PENDING) return
    this.#state = REJECTED
    this.#value = reason
    this.#run()
  }

  // 处理所有挂起的 handler
  #run() {
    this.#handlers.forEach(handler => this.#runOne(handler))
    this.#handlers = []
  }

  #runOne({ onFulfilled, onRejected, resolve, reject }) {
    // 用微任务模拟异步（原生 Promise 使用 microtask）
    queueMicrotask(() => {
      const isFulfilled = this.#state === FULFILLED
      const callback = isFulfilled ? onFulfilled : onRejected

      // 没有传对应的回调，直接透传给下一个 promise
      if (typeof callback !== 'function') {
        isFulfilled ? resolve(this.#value) : reject(this.#value)
        return
      }

      try {
        resolve(callback(this.#value))
      } catch (e) {
        reject(e)
      }
    })
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this.#handlers.push({ onFulfilled, onRejected, resolve, reject })
      // 如果调用 then 时状态已经确定，直接执行
      if (this.#state !== PENDING) this.#run()
    })
  }

  catch(onRejected) {
    return this.then(undefined, onRejected)
  }

  finally(onFinally) {
    return this.then(
      value  => MyPromise.resolve(onFinally()).then(() => value),
      reason => MyPromise.resolve(onFinally()).then(() => { throw reason })
    )
  }

  // ---------- 静态方法 ----------

  static resolve(value) {
    if (value instanceof MyPromise) return value
    return new MyPromise(resolve => resolve(value))
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason))
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const results = []
      let count = 0
      if (promises.length === 0) return resolve(results)
      promises.forEach((p, i) => {
        MyPromise.resolve(p).then(value => {
          results[i] = value
          if (++count === promises.length) resolve(results)
        }, reject)
      })
    })
  }

  static allSettled(promises) {
    return MyPromise.all(
      promises.map(p =>
        MyPromise.resolve(p).then(
          value  => ({ status: FULFILLED, value }),
          reason => ({ status: REJECTED,  reason })
        )
      )
    )
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach(p => MyPromise.resolve(p).then(resolve, reject))
    })
  }

  static any(promises) {
    return new MyPromise((resolve, reject) => {
      const errors = []
      let count = 0
      if (promises.length === 0) return reject(new AggregateError([], 'All promises were rejected'))
      promises.forEach((p, i) => {
        MyPromise.resolve(p).then(resolve, reason => {
          errors[i] = reason
          if (++count === promises.length) reject(new AggregateError(errors, 'All promises were rejected'))
        })
      })
    })
  }
}

// https://github.com/mortal-cultivation-biography/daydayup/issues/107

// 使用示例和测试
console.log("=== MyPromise 测试 ===");

// 基本使用
const promise1 = new MyPromise((resolve, reject) => {
  setTimeout(() => resolve("成功!"), 1000);
});

promise1.then((value) => {
  console.log("Promise1 结果:", value);
});

// 链式调用
new MyPromise((resolve) => resolve(1))
  .then((value) => value * 2)
  .then((value) => value + 1)
  .then((value) => console.log("链式调用结果:", value)); // 3

// 错误处理
new MyPromise((resolve, reject) => {
  reject("出错了!");
}).catch((error) => console.log("捕获错误:", error));

// Promise.all 测试
const p1 = MyPromise.resolve(1);
const p2 = new MyPromise((resolve) => setTimeout(() => resolve(2), 100));
const p3 = MyPromise.resolve(3);

MyPromise.all([p1, p2, p3]).then((values) => {
  console.log("Promise.all 结果:", values); // [1, 2, 3]
});

// Promise.race 测试
const fast = new MyPromise((resolve) => setTimeout(() => resolve("快"), 50));
const slow = new MyPromise((resolve) => setTimeout(() => resolve("慢"), 100));

MyPromise.race([fast, slow]).then((value) => {
  console.log("Promise.race 结果:", value); // '快'
});

export default MyPromise;
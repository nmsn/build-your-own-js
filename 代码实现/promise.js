class MyPromise {
  // Promise状态常量
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";

  constructor(executor) {
    this.state = MyPromise.PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === MyPromise.PENDING) {
        this.state = MyPromise.FULFILLED;
        this.value = value;
        this.onFulfilledCallbacks.forEach((callback) => callback());
      }
    };

    const reject = (reason) => {
      if (this.state === MyPromise.PENDING) {
        this.state = MyPromise.REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach((callback) => callback());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    // 参数可选，提供默认值
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    const promise2 = new MyPromise((resolve, reject) => {
      if (this.state === MyPromise.FULFILLED) {
        // 使用微任务
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      } else if (this.state === MyPromise.REJECTED) {
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      } else if (this.state === MyPromise.PENDING) {
        this.onFulfilledCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const x = onFulfilled(this.value);
              this.resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });

        this.onRejectedCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const x = onRejected(this.reason);
              this.resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    });

    return promise2;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(onFinally) {
    return this.then(
      (value) => MyPromise.resolve(onFinally()).then(() => value),
      (reason) =>
        MyPromise.resolve(onFinally()).then(() => {
          throw reason;
        })
    );
  }

  // Promise解析过程
  resolvePromise(promise2, x, resolve, reject) {
    // 避免循环引用
    if (promise2 === x) {
      return reject(new TypeError("Chaining cycle detected for promise"));
    }

    if (x instanceof MyPromise) {
      x.then(resolve, reject);
    } else if (
      x !== null &&
      (typeof x === "object" || typeof x === "function")
    ) {
      let called = false;
      try {
        const then = x.then;
        if (typeof then === "function") {
          then.call(
            x,
            (y) => {
              if (called) return;
              called = true;
              this.resolvePromise(promise2, y, resolve, reject);
            },
            (r) => {
              if (called) return;
              called = true;
              reject(r);
            }
          );
        } else {
          resolve(x);
        }
      } catch (error) {
        if (called) return;
        called = true;
        reject(error);
      }
    } else {
      resolve(x);
    }
  }

  // 静态方法
  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }
    return new MyPromise((resolve) => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => reject(reason));
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError("Argument must be an array"));
      }

      if (promises.length === 0) {
        return resolve([]);
      }

      const results = [];
      let completedCount = 0;

      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then((value) => {
          results[index] = value;
          completedCount++;
          if (completedCount === promises.length) {
            resolve(results);
          }
        }, reject);
      });
    });
  }

  static allSettled(promises) {
    return new MyPromise((resolve) => {
      if (!Array.isArray(promises)) {
        return resolve([]);
      }

      if (promises.length === 0) {
        return resolve([]);
      }

      const results = [];
      let completedCount = 0;

      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(
          (value) => {
            results[index] = { status: "fulfilled", value };
            completedCount++;
            if (completedCount === promises.length) {
              resolve(results);
            }
          },
          (reason) => {
            results[index] = { status: "rejected", reason };
            completedCount++;
            if (completedCount === promises.length) {
              resolve(results);
            }
          }
        );
      });
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError("Argument must be an array"));
      }

      promises.forEach((promise) => {
        MyPromise.resolve(promise).then(resolve, reject);
      });
    });
  }

  static any(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError("Argument must be an array"));
      }

      if (promises.length === 0) {
        return reject(new AggregateError([], "All promises were rejected"));
      }

      const errors = [];
      let rejectedCount = 0;

      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(resolve, (error) => {
          errors[index] = error;
          rejectedCount++;
          if (rejectedCount === promises.length) {
            reject(new AggregateError(errors, "All promises were rejected"));
          }
        });
      });
    });
  }
}

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

// 最简单版本
class MyPromise {
  // 构造方法
  constructor(executor) {
    // 初始化值
    this.initValue()
    // 初始化this指向
    this.initBind()
    // 执行传进来的函数
    executor(this.resolve, this.reject)
  }

  initBind() {
    // 初始化this
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
  }

  initValue() {
    // 初始化值
    this.PromiseResult = null // 终值
    this.PromiseState = 'pending' // 状态
  }

  resolve(value) {
    // 如果执行resolve，状态变为fulfilled
    this.PromiseState = 'fulfilled'
    // 终值为传进来的值
    this.PromiseResult = value
  }

  reject(reason) {
    // 如果执行reject，状态变为rejected
    this.PromiseState = 'rejected'
    // 终值为传进来的reason
    this.PromiseResult = reason
  }
}
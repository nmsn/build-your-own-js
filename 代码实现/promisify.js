// 把一个“基于回调（callback）的异步函数”，转换成一个“返回 Promise 的函数”
function promisify(fn) {
  return function (...args) {
    // 返回一个新函数
    return new Promise((resolve, reject) => {
      // 在原有参数后面追加一个 callback
      fn(...args, (err, result) => {
        if (err) {
          reject(err); // 失败时 reject
        } else {
          resolve(result); // 成功时 resolve
        }
      });
    });
  };
}


// 被 promisify 的函数必须满足 error-first callback 风格：
function asyncFn(arg1, arg2, callback) {
  // ... 异步操作
  if (error) {
    callback(error);           // 第一个参数是错误
  } else {
    callback(null, result);    // 第一个参数 null，第二个是结果
  }
}

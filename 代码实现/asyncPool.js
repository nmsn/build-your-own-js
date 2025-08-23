
async function asyncPool(asyncFunctions, limit) {
  const results = new Array(asyncFunctions.length);
  const queue = [...asyncFunctions.entries()]; // [index, fn]
  const executing = new Set();

  if (queue.length === 0) return [];

  return new Promise((resolve) => {
    function executeNext() {
      if (queue.length === 0 && executing.size === 0) {
        resolve(results);
        return;
      }

      // 启动新任务直到达到并发限制
      while (queue.length > 0 && executing.size < limit) {
        const [index, fn] = queue.shift();
        const promise = fn().then((result) => {
          results[index] = result;
          executing.delete(promise);
          executeNext(); // 继续执行下一个
        });
        executing.add(promise);
      }
    }

    executeNext();
  });
}

// 测试用例
function fnTimeout(i) {
  return () =>
    new Promise((resolve) =>
      setTimeout(() => {
        console.log(i);
        resolve(i);
      }, i)
    );
}

// 当然,limit <= 0 的时候 我们可以理解为只允许一个请求存在
asyncPool(
  [
    fnTimeout(1000),
    fnTimeout(5000),
    fnTimeout(3000),
    fnTimeout(2000),
    fnTimeout(1000),
  ],
  2
).then((res) => {
  console.log(res);
});

// 1000
// 3000
// 5000
// 2000

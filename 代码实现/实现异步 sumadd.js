/*
  请实现一个 sum 函数，接收一个数组 arr 进行累加，并且只能使用add异步方法
  
  add 函数已实现，模拟异步请求后端返回一个相加后的值
*/
function add(a, b) {
  return Promise.resolve(a + b);
}

function sum(arr) {
  
}

// for + async/await
async function sum(arr) {
  let result = 0;
  for (let i = 0; i < arr.length; i++) {
    result = await add(result, arr[i]);
  }
  return result;
}

// reduce + async/await
async function sum(arr) {
  return arr.reduce(async (prev, cur) => {
    return add(await prev, cur);
  }, 0);
}

// 分治 + promise.all
async function sum(arr) {
  if (arr.length === 0) return 0;
  if (arr.length === 1) return arr[0];
  
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  
  const [leftSum, rightSum] = await Promise.all([
    sum(left),
    sum(right)
  ]);
  
  return add(leftSum, rightSum);
}


// 并发控制版（限制最大并发数）
async function sum(arr, concurrency = 3) {
  if (arr.length === 0) return 0;
  if (arr.length === 1) return arr[0];

  // 使用信号量控制并发
  let running = 0;
  const queue = [...arr];

  async function runWithConcurrency() {
    while (queue.length > 1) {
      const results = [];
      const tasks = [];

      // 每次取 concurrency * 2 个数，配对并发
      const batch = queue.splice(0, concurrency * 2);

      for (let i = 0; i < batch.length; i += 2) {
        if (i + 1 < batch.length) {
          tasks.push(add(batch[i], batch[i + 1]));
        } else {
          tasks.push(Promise.resolve(batch[i]));
        }
      }

      const batchResults = await Promise.all(tasks);
      queue.push(...batchResults);
    }

    return queue[0];
  }

  return runWithConcurrency();
}
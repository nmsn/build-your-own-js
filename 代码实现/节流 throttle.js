
// 时间戳（首次立即执行）
function throttle(func, delay) {
  let lastTime = 0; // 上一次执行的时间

  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      func.apply(this, args);
      lastTime = now;
    }
  };
}

// 定时器版（首次延迟执行）
function throttle(func, delay) {
  let timer = null;

  return function (...args) {
    if (timer) return; // 定时器存在则跳过

    timer = setTimeout(() => {
      func.apply(this, args);
      timer = null;
    }, delay);
  };
}


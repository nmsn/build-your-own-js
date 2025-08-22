function debounce(func, delay) {
  let timer = null; // 闭包保存定时器

  return function (...args) {
    // 每次触发时清除之前的定时器
    if (timer) {
      clearTimeout(timer);
    }
    // 重新设置新的定时器
    timer = setTimeout(() => {
      func.apply(this, args); // 保证 this 和参数正确
    }, delay);
  };
}

// 可以取消
function debounce(func, delay) {
  let timer = null;

  const debounced = function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };

  // 添加 cancel 方法
  debounced.cancel = function () {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return debounced;
}

// 使用
// const searchHandler = debounce(searchAPI, 500);
// searchHandler.cancel(); // 取消请求
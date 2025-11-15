// 最简易版本
function debounce(func, delay) {
  let timer = null; // 闭包保存定时器

  return function (...args) {
    // 每次触发时清除之前的定时器
    if (timer) clearTimeout(timer);
    // 重新设置新的定时器
    timer = setTimeout(() => {
      func.apply(this, args); // 保证 this 和参数正确
    }, delay);
  };
}


// 可以立即 + 可执行
function debounce(func, wait, immediate) {
  var timeout, result

  var debounced = function () {
    var context = this
    var args = arguments

    // 需要注意的是，clearTimeout 之后 timeout 的 id 还是会进行保留
    if (timeout) clearTimeout(timeout)
    if (immediate) {
      // 如果已经执行过，不再执行
      var callNow = !timeout
      timeout = setTimeout(function () {
        timeout = null
      }, wait)
      if (callNow) result = func.apply(context, args)
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args)
      }, wait)
    }
    return result
  }

  debounced.cancel = function () {
    clearTimeout(timeout)
    timeout = null
  }

  return debounced
}
// const searchHandler = debounce(searchAPI, 500);
// searchHandler.cancel(); // 取消请求
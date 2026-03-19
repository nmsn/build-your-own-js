function once(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('once expected a function');
  }

  let called = false;
  let result;

  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }

    return result;
  };
}
const add = once((a, b) => {
  return a + b;
});
add(1, 2); //3
add(3, 4); //3

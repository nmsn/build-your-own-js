const memoize = function (func) {
  const cache = {};
  return (...params) => {
    const index = JSON.stringify(params);
    if (!cache[index]) {
      // console.log("非缓存");
      const result = func(...params);
      cache[index] = result;
      return result;
    }
    // console.log("缓存");
    return cache[index];
  };
};

const add = (x, y) => {
  return x + y;
};

const memoizeAdd = memoize(add);

console.log(
  memoizeAdd(1, 2),

  memoizeAdd(2, 2),

  memoizeAdd(1, 2),

  memoizeAdd(3, 2)
);

function flat(arr, depth = 1) {
  if (!Array.isArray(arr) || depth <= 0) {
    return arr;
  }

  return arr.reduce((pre, cur) => {
    if (Array.isArray(cur)) {
      return [...pre, ...flat(cur, depth - 1)];
    }

    return [...pre, cur];
  }, []);
}

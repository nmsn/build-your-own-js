// 方法1：Set + filter（最简洁）
function intersection(arr1, arr2) {
  const set = new Set(arr2);
  return arr1.filter(item => set.has(item));
}

// 方法2：双指针（前提排序）
function intersection(arr1, arr2) {
  arr1.sort((a, b) => a - b);
  arr2.sort((a, b) => a - b);

  const result = [];
  let i = 0, j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] === arr2[j]) {
      if (result[result.length - 1] !== arr1[i]) {
        result.push(arr1[i]);
      }
      i++;
      j++;
    } else if (arr1[i] < arr2[j]) {
      i++;
    } else {
      j++;
    }
  }

  return result;
}

// 方法3：Map 计数（适合大量重复元素）
function intersection(arr1, arr2) {
  const map = new Map();
  const result = [];

  for (const item of arr1) {
    map.set(item, (map.get(item) || 0) + 1);
  }

  for (const item of arr2) {
    if (map.has(item) && map.get(item) > 0) {
      result.push(item);
      map.set(item, map.get(item) - 1);
    }
  }

  return result;
}

// 测试
console.log(intersection([1, 2, 2, 3], [2, 3, 4])); // [2, 3]
console.log(intersection([1, 1, 1, 2], [1, 2, 2, 3])); // [1, 2]

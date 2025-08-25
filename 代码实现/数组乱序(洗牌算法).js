function fisherYatesShuffle(arr) {
  // 从后向前遍历
  for (let i = arr.length - 1; i > 0; i--) {
    // 生成 [0, i] 范围内的随机索引
    const j = Math.floor(Math.random() * (i + 1));
    // 交换元素
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 示例
const original = [1, 2, 3, 4, 5];
console.log(fisherYatesShuffle([...original])); // 例如 [3,5,1,2,4]

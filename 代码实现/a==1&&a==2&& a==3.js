// 实现 a == 1 && a == 2 && a == 3 为 true 的几种方法

console.log("=== 方法1: 利用 valueOf 方法 ===");
// 通过重写 valueOf 方法，每次调用时返回递增的值
let a = {
  value: 1,
  valueOf() {
    return this.value++;
  },
};

console.log(a == 1 && a == 2 && a == 3); // true
console.log("a.value:", a.value); // 4

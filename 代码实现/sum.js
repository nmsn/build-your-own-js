// 基础实现
// 核心思路是：每次调用返回一个函数（支持继续链式调用），同时挂上 valueOf 让它能输出数值。

function sum(...args) {
  let total = args.reduce((a, b) => a + b, 0)

  function innerSum(...newArgs) {
    total += newArgs.reduce((a, b) => a + b, 0)
    return innerSum
  }

  innerSum.valueOf = () => total

  return innerSum
}

// 追问：不用 valueOf 直接参与运算
// sum(1, 2, 3) + sum(4, 5) 这种写法，JS 在做运算时会自动触发类型转换，调用对象的 [Symbol.toPrimitive] 或 valueOf 或 toString。
// 所以解法是挂上 Symbol.toPrimitive，它的优先级比 valueOf 更高，且能感知运算的上下文（hint）：

function sum(...args) {
  let total = args.reduce((a, b) => a + b, 0)

  function innerSum(...newArgs) {
    total += newArgs.reduce((a, b) => a + b, 0)
    return innerSum
  }

  // 优先级最高，+ * 等运算都会触发
  innerSum[Symbol.toPrimitive] = (hint) => {
    // hint 是 'number'、'string' 或 'default'
    return total
  }

  // 兜底，兼容不支持 Symbol.toPrimitive 的环境
  innerSum.valueOf = () => total

  return innerSum
}

sum(1, 2, 3) + sum(4, 5)   // 6 + 9 = 15
sum(10) * sum(10)           // 10 * 10 = 100
sum(2, 3)(2).valueOf()      // 7
sum(1)(2)(3)(4)(5)(6)       // 参与运算时自动转换 = 21
```

// ---

// ### 类型转换的触发顺序
// ```
// JS 做运算时的转换优先级：

// 1. Symbol.toPrimitive(hint)   ← 最高优先级
// 2. valueOf()                  ← 返回原始值则用，否则继续
// 3. toString()                 ← 最后兜底
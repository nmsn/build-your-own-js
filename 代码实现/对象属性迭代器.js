/**
 * 实现
 * const obj = {
 *  a: '1',
 *  b: '2',
 * }
 * const [a,b] = obj​
 */

const obj = {​
    a: '1',​
    b: '2',​
    [Symbol.iterator]() {
      let index = 0
      const keys = Object.keys(this)
      return {
        next() {
          return {
            value: obj[keys[index]],
            done: index++ >= keys.length
          }
        }
      }
    }
}​
​
const [a, b] = obj
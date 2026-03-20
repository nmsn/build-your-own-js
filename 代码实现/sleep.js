// 同步
function sleep(ms) {
  const start = Date.now()
  while (Date.now() - start < ms) {
    // 阻塞主线程，什么都不做
  }
}

// 使用
console.log('start')
sleep(2000)
console.log('2秒后执行')  // 主线程被阻塞，页面完全卡死

// 异步
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 使用：async/await
async function main() {
  console.log('start')
  await sleep(2000)
  console.log('2秒后执行')  // 主线程不阻塞，页面正常响应
}

// 使用：Promise 链式
sleep(2000).then(() => {
  console.log('2秒后执行')
})
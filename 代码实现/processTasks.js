function processTasks(...tasks) {
  let isRunning = false
  let isPaused = false
  let currentIndex = 0
  let results = []

  return {
    start: async () => {
      if (isRunning && !isPaused) return
      isRunning = true
      isPaused = false

      while (currentIndex < tasks.length) {
        if (isPaused) {
          await new Promise(resolve => {
            const checkResume = setInterval(() => {
              if (!isPaused) {
                clearInterval(checkResume)
                resolve()
              }
            }, 100)
          })
        }

        const result = await tasks[currentIndex]()
        results.push(result)
        currentIndex++
      }

      isRunning = false
      return results
    },
    pause: () => {
      isPaused = true
    }
  }
}

module.exports = { processTasks }

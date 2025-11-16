function red() {
  console.log('red')
}

function green() {
  console.log('green')
}

function yellow() {
  console.log('yellow')
}

function light(cb, wait) {
  return new Promise((resolve) => {
    setTimeout(() => {
      cb()
      resolve()
    }, wait)
  })
}

function start() {
  return Promise.resolve()
    .then(() => {
      return light(red, 1000)
    })
    .then(() => {
      return light(green, 1000)
    })
    .then(() => {
      return light(yellow, 1000)
    })
    .finally(() => {
      return start()
    })
}

start()
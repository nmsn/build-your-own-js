class EventBus {
  constructor() {
    this.eventObj = {}
    this.callbackId = 0
  }

  $on(name, callback) {
    if (!this.eventObj[name]) {
      this.eventObj[name] = {}
    }
    const id = this.callbackId++
    this.eventObj[name][id] = callback
    return id
  }
  $emit(name, ...args) {
    const eventList = this.eventObj[name]
    for (const id in eventList) {
      eventList[id](...args)
      // 如果包含“D”，则为一次性事件，删除该事件
      if (id.indexOf('D') !== -1) {
        delete eventList[id]
      }
    }
  }
  $off(name, id) {
    delete this.eventObj[name][id]
    if (!Object.keys(this.eventObj[name]).length) {
      delete this.eventObj[name]
    }
  }
  $once(name, callback) {
    if (!this.eventObj[name]) {
      this.eventObj[name] = {}
    }
    const id = 'D' + this.callbackId++
    this.eventObj[name][id] = callback
    return id
  }
}
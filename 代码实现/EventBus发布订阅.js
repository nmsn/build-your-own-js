class EventBus {
  constructor() {
    this.eventObj = {};
    this.callbackId = 0;
    this.onceIds = new Set(); // 用 Set 存储 once 事件 id
  }

  $on(name, callback) {
    if (!this.eventObj[name]) {
      this.eventObj[name] = [];
    }
    const id = this.callbackId++;
    this.eventObj[name].push({ id, callback });
    return id;
  }

  $once(name, callback) {
    const id = this.$on(name, (...args) => {
      callback(...args);
      this.$off(name, id); // 触发后自动删除
    });
    this.onceIds.add(id);
    return id;
  }

  $emit(name, ...args) {
    const handlers = this.eventObj[name];
    if (!handlers) return;

    for (let i = 0; i < handlers.length; i++) {
      const { id, callback } = handlers[i];
      try {
        callback(...args);
      } catch (err) {
        console.error(`Error in event "${name}":`, err);
      }
      if (this.onceIds.has(id)) {
        this.onceIds.delete(id);
        handlers.splice(i--, 1); // 移除并修正索引
      }
    }
  }

  $off(name, id) {
    if (!this.eventObj[name]) return;
    this.eventObj[name] = this.eventObj[name].filter((h) => h.id !== id);
    this.onceIds.delete(id);
  }
}

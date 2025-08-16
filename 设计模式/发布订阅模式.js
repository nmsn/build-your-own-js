const eventBus = {
  // map: 存储事件队列的 map, 每个事件都有一个单独的队列，存放所有的事件处理函数
  map: new Map(),
  // on: 订阅事件的方法，根据传入的 eventName 事件名，将handler追加到新建或存在的事件队列中
  on(eventName, handler) {
    const handlers = this.map.get(eventName)
    if (handlers) {
      handlers.push(handler)
    } else {
      this.map.set(eventName, [handler])
    }
  },
  // emit: 触发事件的方法，根据传入事件名称、参数遍历事件队列并触发事件
  emit(eventName, args) {
    const handlers = this.map.get(eventName)
    console.log(handlers)
    if (!handlers) {
      throw new Error(`${eventName} is not exist`)
    }
    handlers.forEach((handler) => {
      handler(args)
    })
  },
  // off: 取消事件订阅，根据事件名和处理函数取消事件订阅，如不传入处理函数，则清空相应的事件队列
  off(eventName, handler) {
    if (!handler) {
      this.map.set(eventName, [])
      return
    }
    const handlers = this.map.get(eventName)
    const index = handlers.indexOf(handler)
    if (index >= 0) {
      handlers.splice(index, 1)
    }
  },
  // once: 执行单次事件订阅，触发后自动清除订阅
  once(eventName, handler) {
    const tempHandler = (args) => {
      this.off(eventName, tempHandler)
      handler(args)
    }
    this.on(eventName, tempHandler)
  },
}

// 测试用例
function testEventBus() {
  console.log('=== 开始测试 eventBus ===\n');
  
  // 测试1: 基本订阅和发布功能
  console.log('测试1: 基本订阅和发布功能');
  const handler1 = (data) => console.log('Handler1 接收到数据:', data);
  const handler2 = (data) => console.log('Handler2 接收到数据:', data);
  
  eventBus.on('testEvent', handler1);
  eventBus.on('testEvent', handler2);
  console.log('已订阅两个处理器到 testEvent 事件');
  
  eventBus.emit('testEvent', 'Hello World');
  console.log('');
  
  // 测试2: 取消特定处理器
  console.log('测试2: 取消特定处理器');
  eventBus.off('testEvent', handler1);
  console.log('已取消 Handler1 的订阅');
  eventBus.emit('testEvent', 'After removing handler1');
  console.log('');
  
  // 测试3: 清空事件的所有处理器
  console.log('测试3: 清空事件的所有处理器');
  eventBus.off('testEvent'); // 不传入处理器，清空所有
  console.log('已清空 testEvent 的所有处理器');
  
  try {
    eventBus.emit('testEvent', 'This should throw error');
  } catch (error) {
    console.log('预期错误:', error.message);
  }
  console.log('');
  
  // 测试4: 单次订阅功能
  console.log('测试4: 单次订阅功能');
  let onceCount = 0;
  eventBus.once('onceEvent', (data) => {
    onceCount++;
    console.log('单次处理器执行次数:', onceCount, '数据:', data);
  });
  
  eventBus.emit('onceEvent', '第一次调用');
  eventBus.emit('onceEvent', '第二次调用'); // 不会触发
  console.log('最终执行次数:', onceCount);
  console.log('');
  
  // 测试5: 多个事件独立处理
  console.log('测试5: 多个事件独立处理');
  const eventResults = [];
  
  eventBus.on('eventA', (data) => {
    eventResults.push('EventA: ' + data);
  });
  
  eventBus.on('eventB', (data) => {
    eventResults.push('EventB: ' + data);
  });
  
  eventBus.emit('eventA', 'Data for A');
  eventBus.emit('eventB', 'Data for B');
  
  console.log('事件处理结果:', eventResults);
  console.log('');
  
  // 测试6: 处理器中的异常处理
  console.log('测试6: 处理器中的异常处理');
  eventBus.on('errorEvent', (data) => {
    console.log('正常处理器:', data);
  });
  
  eventBus.on('errorEvent', (data) => {
    throw new Error('模拟处理器错误');
  });
  
  eventBus.on('errorEvent', (data) => {
    console.log('另一个正常处理器:', data);
  });
  
  try {
    eventBus.emit('errorEvent', '测试错误处理');
  } catch (error) {
    console.log('捕获到异常:', error.message);
  }
  console.log('');
  
  // 测试7: 重复订阅同一个处理器
  console.log('测试7: 重复订阅同一个处理器');
  const duplicateHandler = (data) => console.log('重复处理器:', data);
  
  eventBus.on('duplicateEvent', duplicateHandler);
  eventBus.on('duplicateEvent', duplicateHandler); // 重复订阅
  
  eventBus.emit('duplicateEvent', '测试重复订阅');
  console.log('');
  
  // 测试8: 取消不存在的处理器
  console.log('测试8: 取消不存在的处理器');
  const nonExistentHandler = (data) => console.log('不存在的处理器');
  
  eventBus.on('nonExistentEvent', (data) => console.log('正常处理器:', data));
  eventBus.off('nonExistentEvent', nonExistentHandler); // 取消不存在的处理器
  
  eventBus.emit('nonExistentEvent', '测试取消不存在的处理器');
  console.log('');
  
  // 测试9: 事件名称为空字符串
  console.log('测试9: 事件名称为空字符串');
  try {
    eventBus.on('', (data) => console.log('空字符串事件:', data));
    eventBus.emit('', '测试空字符串事件');
  } catch (error) {
    console.log('空字符串事件测试结果:', error.message);
  }
  console.log('');
  
  // 测试10: 处理器为非函数
  console.log('测试10: 处理器为非函数');
  try {
    eventBus.on('invalidHandler', 'not a function');
  } catch (error) {
    console.log('非函数处理器测试结果:', error.message);
  }
  console.log('');
  
  // 测试总结
  console.log('=== 测试完成 ===');
  console.log('eventBus 功能测试覆盖:');
  console.log('✓ 基本订阅和发布');
  console.log('✓ 取消特定处理器');
  console.log('✓ 清空事件处理器');
  console.log('✓ 单次订阅');
  console.log('✓ 多事件独立处理');
  console.log('✓ 异常处理');
  console.log('✓ 重复订阅');
  console.log('✓ 取消不存在的处理器');
  console.log('✓ 边界情况处理');
}

// 运行测试
testEventBus();

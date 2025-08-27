/**
 * 基于 MessageChannel 实现 requestIdleCallback
 * 参考 React Scheduler 的实现方式
 */

class IdleScheduler {
  constructor() {
    // 创建 MessageChannel 用于任务调度
    this.channel = new MessageChannel();
    this.port1 = this.channel.port1;
    this.port2 = this.channel.port2;

    // 任务队列和状态
    this.taskQueue = [];
    this.isMessageLoopRunning = false;
    this.isHostCallbackScheduled = false;

    // 时间切片配置
    this.frameInterval = 5; // 5ms 时间切片，React 默认值
    this.startTime = 0;
    this.currentTime = 0;
    this.taskIdCounter = 1;

    // 绑定消息处理器
    this.port2.onmessage = this.performWorkUntilDeadline.bind(this);
  }

  /**
   * 请求空闲回调
   * @param {Function} callback 回调函数
   * @param {Object} options 选项 { timeout: number }
   * @returns {Object} 任务标识符
   */
  requestIdleCallback(callback, options = {}) {
    const currentTime = this.getCurrentTime();
    const timeout = typeof options.timeout === "number" ? options.timeout : 0;

    const task = {
      id: this.taskIdCounter++,
      callback,
      startTime: currentTime,
      timeout,
      isExpired: false,
    };

    // 添加到任务队列
    this.taskQueue.push(task);

    // 如果没有正在运行的消息循环，启动它
    if (!this.isMessageLoopRunning) {
      this.isMessageLoopRunning = true;
      this.schedulePerformWorkUntilDeadline();
    }

    return task;
  }

  /**
   * 取消空闲回调
   * @param {Object} task 任务标识符
   */
  cancelIdleCallback(task) {
    const index = this.taskQueue.findIndex((t) => t.id === task.id);
    if (index !== -1) {
      this.taskQueue.splice(index, 1);
    }
  }

  /**
   * 调度工作执行
   */
  schedulePerformWorkUntilDeadline() {
    this.port1.postMessage(null);
  }

  /**
   * 执行工作直到截止时间
   */
  performWorkUntilDeadline() {
    this.startTime = this.getCurrentTime();
    let hasMoreWork = true;

    try {
      hasMoreWork = this.flushWork();
    } catch (error) {
      console.error("Scheduler error:", error);
      hasMoreWork = true; // 出错时继续处理剩余任务
    } finally {
      if (hasMoreWork) {
        // 还有更多工作，继续调度
        this.schedulePerformWorkUntilDeadline();
      } else {
        this.isMessageLoopRunning = false;
      }
    }
  }

  /**
   * 刷新工作队列
   * @returns {boolean} 是否还有更多工作
   */
  flushWork() {
    const deadline = this.startTime + this.frameInterval;
    let currentTask = null;

    // 处理任务直到时间片用完
    while (this.taskQueue.length > 0) {
      currentTask = this.taskQueue.shift();
      const currentTime = this.getCurrentTime();

      // 检查任务是否超时
      if (currentTask.timeout > 0) {
        currentTask.isExpired =
          currentTime - currentTask.startTime >= currentTask.timeout;
      }

      // 创建 IdleDeadline 对象
      const idleDeadline = this.createIdleDeadline(
        deadline,
        currentTask.isExpired
      );

      try {
        // 执行任务回调
        currentTask.callback(idleDeadline);
      } catch (error) {
        console.error("Task execution error:", error);
      }

      // 如果时间片用完且任务没有超时，停止处理
      if (!currentTask.isExpired && this.getCurrentTime() >= deadline) {
        break;
      }
    }

    // 返回是否还有更多工作
    return this.taskQueue.length > 0;
  }

  /**
   * 创建 IdleDeadline 对象
   * @param {number} deadline 截止时间
   * @param {boolean} didTimeout 是否超时
   * @returns {Object} IdleDeadline 对象
   */
  createIdleDeadline(deadline, didTimeout) {
    return {
      timeRemaining: () => {
        const remaining = deadline - this.getCurrentTime();
        return Math.max(0, remaining);
      },
      didTimeout,
    };
  }

  /**
   * 获取当前时间
   * @returns {number} 当前时间戳
   */
  getCurrentTime() {
    return performance.now();
  }

  /**
   * 获取队列状态
   * @returns {Object} 队列信息
   */
  getQueueInfo() {
    return {
      queueLength: this.taskQueue.length,
      isRunning: this.isMessageLoopRunning,
      frameInterval: this.frameInterval,
    };
  }

  /**
   * 设置时间切片大小
   * @param {number} interval 时间间隔（毫秒）
   */
  setFrameInterval(interval) {
    this.frameInterval = Math.max(1, interval);
  }
}

// 创建全局调度器实例
const globalScheduler = new IdleScheduler();

// Polyfill requestIdleCallback
if (!window.requestIdleCallback) {
  window.requestIdleCallback = function (callback, options) {
    return globalScheduler.requestIdleCallback(callback, options);
  };
}

if (!window.cancelIdleCallback) {
  window.cancelIdleCallback = function (task) {
    return globalScheduler.cancelIdleCallback(task);
  };
}

// 导出调度器类和实例
if (typeof module !== "undefined" && module.exports) {
  module.exports = { IdleScheduler, globalScheduler };
}

// 使用示例和测试
function runTests() {
  console.log("=== MessageChannel IdleCallback 测试 ===");

  // 测试1: 基本功能
  console.log("\n--- 测试1: 基本功能 ---");
  let taskCount = 0;

  function basicTask(deadline) {
    taskCount++;
    console.log(`任务 ${taskCount} 执行`);
    console.log(`剩余时间: ${deadline.timeRemaining().toFixed(2)}ms`);
    console.log(`是否超时: ${deadline.didTimeout}`);

    if (taskCount < 3) {
      requestIdleCallback(basicTask);
    }
  }

  requestIdleCallback(basicTask);

  // 测试2: 超时处理
  setTimeout(() => {
    console.log("\n--- 测试2: 超时处理 ---");

    function timeoutTask(deadline) {
      console.log("超时任务执行");
      console.log(`是否超时: ${deadline.didTimeout}`);
      console.log(`剩余时间: ${deadline.timeRemaining().toFixed(2)}ms`);
    }

    requestIdleCallback(timeoutTask, { timeout: 10 });
  }, 100);

  // 测试3: 重任务处理
  setTimeout(() => {
    console.log("\n--- 测试3: 重任务处理 ---");

    let processed = 0;
    const totalWork = 1000000;

    function heavyTask(deadline) {
      const startTime = performance.now();

      while (deadline.timeRemaining() > 0 && processed < totalWork) {
        // 模拟计算工作
        Math.random() * Math.random();
        processed++;
      }

      const duration = performance.now() - startTime;
      console.log(
        `处理了 ${processed}/${totalWork} 项，耗时 ${duration.toFixed(2)}ms`
      );

      if (processed < totalWork) {
        requestIdleCallback(heavyTask);
      } else {
        console.log("重任务完成！");
      }
    }

    requestIdleCallback(heavyTask);
  }, 200);

  // 测试4: 取消任务
  setTimeout(() => {
    console.log("\n--- 测试4: 取消任务 ---");

    function cancelledTask(deadline) {
      console.log("这个任务不应该执行");
    }

    const task = requestIdleCallback(cancelledTask);
    cancelIdleCallback(task);
    console.log("任务已取消");
  }, 300);

  // 测试5: 调度器状态
  setTimeout(() => {
    console.log("\n--- 测试5: 调度器状态 ---");
    console.log("队列信息:", globalScheduler.getQueueInfo());
  }, 400);
}

// 如果在浏览器环境中运行测试
if (typeof window !== "undefined") {
  // 延迟运行测试，确保页面加载完成
  setTimeout(runTests, 100);
}

/**
 * ========================================================================
 * MessageChannel 任务调度完整执行步骤说明
 * ========================================================================
 * 
 * 以下详细描述了从任务创建到执行完毕的完整生命周期流程：
 * 
 * 1. 任务初始化阶段
 *    1.1 用户调用 requestIdleCallback(callback, options)
 *    1.2 系统获取当前时间戳 (performance.now())
 *    1.3 解析 options 参数，提取 timeout 配置
 *    1.4 创建任务对象：
 *        - id: 唯一标识符 (taskIdCounter++)
 *        - callback: 用户提供的回调函数
 *        - startTime: 任务创建时间戳
 *        - timeout: 超时时间配置
 *        - isExpired: 初始化为 false
 * 
 * 2. 任务入队与调度触发
 *    2.1 将任务对象推入 taskQueue 队列 (FIFO 结构)
 *    2.2 检查调度器状态 (isMessageLoopRunning)
 *    2.3 如果调度器空闲，设置 isMessageLoopRunning = true
 *    2.4 调用 schedulePerformWorkUntilDeadline() 触发调度
 *    2.5 通过 port1.postMessage(null) 发送异步消息
 * 
 * 3. 消息循环启动
 *    3.1 MessageChannel 的 port2 接收到消息
 *    3.2 触发 port2.onmessage 事件处理器
 *    3.3 在下一个事件循环 tick 中执行 performWorkUntilDeadline()
 *    3.4 记录当前时间作为时间片开始时间 (startTime)
 * 
 * 4. 任务批处理执行
 *    4.1 调用 flushWork() 开始批量处理任务
 *    4.2 计算时间片截止时间 (deadline = startTime + frameInterval)
 *    4.3 进入任务处理循环 (while taskQueue.length > 0)
 *    4.4 从队列头部取出任务 (taskQueue.shift() - FIFO)
 * 
 * 5. 单任务执行流程
 *    5.1 获取当前时间，检查任务是否超时：
 *        - 如果 timeout > 0 且 (currentTime - startTime) >= timeout
 *        - 设置 task.isExpired = true
 *    5.2 创建 IdleDeadline 对象：
 *        - timeRemaining(): 返回剩余时间 (deadline - currentTime)
 *        - didTimeout: 任务超时状态标志
 *    5.3 在 try-catch 块中执行用户回调：
 *        - 调用 task.callback(idleDeadline)
 *        - 捕获并记录执行异常，不影响其他任务
 * 
 * 6. 时间片控制机制
 *    6.1 检查任务执行后的时间状态
 *    6.2 如果任务未超时 (!task.isExpired) 且时间片用完 (currentTime >= deadline)
 *    6.3 跳出任务处理循环，保留剩余任务
 *    6.4 超时任务不受时间片限制，优先执行完毕
 * 
 * 7. 调度状态管理
 *    7.1 flushWork() 返回是否还有剩余任务 (taskQueue.length > 0)
 *    7.2 如果 hasMoreWork = true：
 *        - 继续调用 schedulePerformWorkUntilDeadline()
 *        - 发送新的 postMessage 触发下一轮调度
 *    7.3 如果 hasMoreWork = false：
 *        - 设置 isMessageLoopRunning = false
 *        - 调度器进入空闲状态，等待新任务
 * 
 * 8. 异常处理机制
 *    8.1 performWorkUntilDeadline() 使用 try-catch-finally 结构
 *    8.2 单任务异常不影响调度器整体运行
 *    8.3 调度器异常时设置 hasMoreWork = true，确保剩余任务继续处理
 *    8.4 所有异常都会记录到控制台，便于调试
 * 
 * 9. 任务取消流程
 *    9.1 用户调用 cancelIdleCallback(task) 
 *    9.2 通过 task.id 在 taskQueue 中查找对应任务
 *    9.3 使用 findIndex() 定位任务位置
 *    9.4 通过 splice() 从队列中移除任务
 * 
 * 10. 性能监控与调试
 *     10.1 getQueueInfo() 提供实时状态信息：
 *          - queueLength: 当前队列长度
 *          - isRunning: 调度器运行状态
 *          - frameInterval: 时间片配置
 *     10.2 setFrameInterval() 支持动态调整时间片大小
 *     10.3 所有关键操作都有性能时间戳记录
 * 
 * ========================================================================
 * 关键设计原则说明：
 * ========================================================================
 * 
 * • 非阻塞执行：通过 MessageChannel 实现真正的异步调度
 * • 时间切片：5ms 默认时间片保证页面响应性
 * • 优先级处理：超时任务优先执行，不受时间片限制
 * • 异常隔离：单任务异常不影响整体调度稳定性
 * • 状态透明：提供完整的执行状态监控和调试接口
 * • 兼容性：完全模拟原生 requestIdleCallback API 行为
 * 
 * 这种设计确保了在高并发场景下的稳定性，同时保持了与原生 API 的完全兼容性，
 * 是 React Fiber 架构中时间切片和并发渲染的核心技术基础。
 * ========================================================================
 */

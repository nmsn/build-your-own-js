/**
 * 观察者模式：
 * 又被称作发布-订阅者模式或消息机制，定义了一种依赖关系。
 */

var Event = (function() {
  var list = {},
    listen,
    trigger,
    remove;

  listen = function(key, fn) {
    if (!list[key]) {
      // 如果还没有订阅过此类消息，给该类消息创建一个缓存列表
      list[key] = [];
    }
    list[key].push(fn); // 订阅消息添加到缓存列表
  };

  trigger = function() {
    var key = Array.prototype.shift.call(arguments), // 取出消息类型名称
      fns = list[key]; // 取出该消息对应的回调函数的集合
    // 如果没有订阅过该消息的话，则返回
    if (!fns || fns.length === 0) {
      return false;
    }
    for (var i = 0, fn; (fn = fns[i++]); ) {
      fn.apply(this, arguments); // arguments 是发布消息时附送的参数
    }
  };

  remove = function(key, fn) {
    // 如果key对应的消息没有订阅过的话，则返回
    var fns = list[key];
    // 如果没有传入具体的回调函数，表示需要取消key对应消息的所有订阅
    if (!fns) {
      return false;
    }
    if (!fn) {
      fns && (fns.length = 0);
    } else {
      for (var i = fns.length - 1; i >= 0; i--) {
        var _fn = fns[i];
        if (_fn === fn) {
          fns.splice(i, 1); // 删除订阅者的回调函数
        }
      }
    }
  };

  return {
    listen: listen,
    trigger: trigger,
    remove: remove,
  };
})();

// 测试代码如下：
Event.listen("color", function(size) {
  console.log("尺码为:" + size); // 打印出尺码为42
});
Event.trigger("color", 42);
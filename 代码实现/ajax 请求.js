const reqUrl = "request.com";

const xhr = new XMLHttpRequest();

xhr.onreadystatechange = function () {
  if (this.readyState !== 4) {
    return;
  }

  if (this.status === 200) {
    handle(this.response);
  } else {
    console.log(this.statusText);
  }
};

xhr.onerror = function () {
  console.log(this.statusText);
};

// 第三个参数为异步执行
xhr.open("GET", reqUrl, true);
xhr.responseType = "json";
xhr.setRequestHeader("Accept", "application/json");
xhr.send(null);

/**
创建 XMLHttpRequest 对象

使用 open 方法创建一个 HTTP 请求

发送前，为这个对象添加信息和监听函数
	setRequestHeader 添加头信息
  onreadystagechange 状态监听函数 readyState = 4 的时候，代表服务器返回的收据接收完成，判断状态码 2xx 304 则代表返回正常
  对象属性和监听函数设置完，调用 send 发送请求
*/

/* readyState 属性表示请求/响应过程的当前活动阶段，共有 5 个可取值。

0：未初始化。尚未调用 open() 方法。
1：启动。已经调用 open() 方法，但尚未调用 send() 方法。
2：发送。已经调用 send() 方法，但尚未接收到响应。
3：接收。已经接收到部分响应数据。
4：完成。已经接收到全部响应数据，而且已经可以在客户端使用了。

status 属性表示响应的 HTTP 状态码，如 200 表示成功，304 表示资源未修改。  */

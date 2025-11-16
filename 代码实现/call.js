Function.prototype.call2 = function (context, ...args) {
  var context = context || window
  context.fn = this

  var result = context.fn(...args)

  delete context.fn
  return result
}
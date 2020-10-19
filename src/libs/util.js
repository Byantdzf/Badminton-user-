// 程序事件节流
var timeout;

function throttle(func, wait, immediate) {
  return fun(func, wait, immediate)
}

function fun(func, wait, immediate) {
  var context = this,
    args = arguments;
  var later = function () {
    timeout = null;
    if (!immediate) func.apply(context, args);
  };
  var callNow = immediate && !timeout;
  if (!timeout) {
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  }
  if (callNow) func.apply(context, args);
}

module.exports = {
  throttle: throttle
}

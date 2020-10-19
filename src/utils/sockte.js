const io = require("../weapp.socket.io")
const App = getApp()

let wsStatus = false
let onSocket = null

export const connect = function (cb) {
  if (!onSocket) {
    onSocket = io('wss://love.ufutx.com') // socket的地址
    onSocket.on('connect', function (res) {
      cb(true, onSocket)
      wsStatus = true
    })
    setTimeout(function () { // 超时
      if (!wsStatus) {
        cb(false, onSocket)
      }
    }, 10000)
  } else {
    cb(true, onSocket)
  }
}

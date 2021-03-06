/* ========================================================
                        小程序配置文件
======================================================== */
// 域名
if (_NODE_) {
  var host = 'https://www.efclub.top/api' // 测试环境
} else {
  // var host = 'http://alpha.ufutx.net/api'  // 线上环境
  var host = 'https://www.efclub.top/api' // 测试环境
  // var host = 'http://love.hankin.cn/api' // 测试环境
}

export const service = {
  // 登录接口
  login: `${host}/wechat/login`,
  // 微信注册接口
  register: `${host}/wechat/register`,
  // 主域
  host: `${host}`
}

export default {
  service
}

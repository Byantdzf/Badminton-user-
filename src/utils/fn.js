const getElement_WH = (element) => { // 获取元素位置
  console.log(element)
  return new Promise((resolve, reject) => {
    let query = wx.createSelectorQuery()
    query.select(element).boundingClientRect((rect) => {
      if (typeof rect == 'object') {
        resolve(rect)
      } else {
        reject('TypeError')
      }
    }).exec()
  })
}
const wxPay = (wxconfig) => { // 微信支付
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      timeStamp: wxconfig.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      nonceStr: wxconfig.nonceStr, // 支付签名随机串，不长于 32 位
      package: wxconfig.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
      signType: wxconfig.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: wxconfig.paySign, // 支付签名
      success: (res) => {
        resolve(res)
      },
      fail: (res) => {
        reject('已取消支付')
      }
    })
  })
}
const callPhone = (phoneNumber) => {
  return new Promise((resolve, reject) => {
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
      success: function () {
        console.log('拨打电话成功!')
        // resolve(res)
      },
      fail: function () {
        console.log('拨打电话失败！')
        // reject('拨打电话失败')
      }
    })
  })
}
const wx_login = () => { // 微信登录
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
        resolve(res.code) // 返回code
      },
      fail: (res) => {
        reject('微信登录失败')
      }
    })
  })
}

const getsubscription = (ids) => {
  return new Promise((resolve, reject) => {
    wx.requestSubscribeMessage({
      tmplIds: ids, // 此处可填写多个模板 ID，但低版本微信不兼容只能授权一个
      success(res) {
        resolve(res)
        if (res[ids[0]] === 'accept') {
          console.log('用户同意授权')
          wx.showToast({
            title: '订阅成功',
            duration: 1000,
          })
        } else {
          wx.showToast({
            title: '拒绝授权',
            icon: 'none',
            duration: 1000
          })
        }
      },
      fail(err) { // 失败
        console.error(err)
        reject(err)
      },
      complete(res) {
        console.log('complete  调用完成')
      }
    })
  })
}
export {getElement_WH, wxPay, callPhone, wx_login, getsubscription}

import wepy from 'wepy'
import {service} from '../config.js'

export default class httpMixin extends wepy.mixin {
  /* =================== [$get 发起GET请求] =================== */
  $get(
    {url = '', headers = {}, data = {}},
    {
      success = () => {
      }, fail = () => {
      }, complete = () => {
      }
    }
  ) {
    const methods = 'GET'
    this.$ajax(
      {url, headers, methods, data},
      {success, fail, complete}
    )
  }

  /* =================== [$post 发起POST请求] =================== */
  $post(
    {url = '', headers = {}, data = {}},
    {
      success = () => {
      }, fail = () => {
      }, complete = () => {
      }
    }
  ) {
    const methods = 'POST'
    this.$ajax(
      {url, headers, methods, data},
      {success, fail, complete}
    )
  }

  /* =================== [$post 发起POST请求] =================== */
  $put(
    {url = '', headers = {}, data = {}},
    {
      success = () => {
      }, fail = () => {
      }, complete = () => {
      }
    }
  ) {
    const methods = 'PUT'
    this.$ajax(
      {url, headers, methods, data},
      {success, fail, complete}
    )
  }

  /* =================== [$post 发起POST请求] =================== */
  $delete(
    {url = '', headers = {}, data = {}},
    {
      success = () => {
      }, fail = () => {
      }, complete = () => {
      }
    }
  ) {
    const methods = 'DELETE'
    this.$ajax(
      {url, headers, methods, data},
      {success, fail, complete}
    )
  }

  /**
   * [ajax 统一请求方法]
   * @param  {[type]}  item [description]
   * @return {Boolean}      [description]
   */
  $ajax(
    {url = '', headers = {}, methods = 'GET', data = {}},
    {
      success = () => {
      }, error = () => {
      }, fail = () => {
      }, complete = () => {
      }
    }
  ) {
    // 增强体验：加载中
    wx.showNavigationBarLoading()
    // 构造请求体
    const request = {
      // url: url + '?XDEBUG_SESSION_START=1&from_openid='+ wx.getStorageSync('from_openid'),
      url: url + '?XDEBUG_SESSION_START=1',
      method: ['GET', 'POST', 'PUT', 'DELETE'].indexOf(methods) > -1 ? methods : 'GET',
      header: Object.assign({
        'Authorization': 'Bearer ' + wx.getStorageSync('token'),
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded'
      }, headers),
      data: Object.assign({ // set something global
      }, data)
    }
    // 控制台调试日志
    // console.table(request)
    // 发起请求
    wepy.request(Object.assign(request, {
      success: ({statusCode, data}) => {
        const {code, message, notice, operate, path} = data
        wx.removeStorageSync('message')
        // 控制台调试日志
        console.log('[SUCCESS]', statusCode, typeof data === 'object' ? data : data.toString().substring(0, 100))

        // 状态码正常 & 确认有数据
        if (+data.code === 0 && data.data) {
          // 成功回调
          wx.removeStorageSync('formId')
          return setTimeout(() => {
            let successExist = this.isFunction(success)
            successExist && success({statusCode, ...data})
            this.$apply()
          })
        } else if (code == 1) {
          wx.showModal({
            title: '提示',
            content: data.message,
            showCancel: false
          })
          this.init = true
          wx.hideLoading()
          wx.setStorageSync('message', data.message)
        } else if (data.code == 2) {
          var pages = getCurrentPages()    // 获取加载的页面
          var currentPage = pages[pages.length - 1]    // 获取当前页面的对象
          var options = currentPage.options
          let url = ''
          for (var key in options) {
            url = `${url}${key}=${options[key]}&`
          }
          console.log(`${currentPage.route}?${url}`)
          wx.setStorageSync('jump', `/${currentPage.route}?${url}`)
          wx.removeStorageSync('token', null)
          wepy.login({
            success: (res) => {
              console.log('wepy.login.success:', res) // 根据业务接口处理:业务登陆:异步
              this.$post({url: service.login, data: {code: res.code}}, {
                success: ({code, data}) => {
                  if (data.token) {
                    wx.setStorageSync('token', data.token)
                    wx.setStorageSync('openid', data.openid)
                    let userInfo = {
                      nickName: data.user.name,
                      avatarUrl: data.user.avatar,
                      type: data.user.type
                    }
                    wx.setStorageSync('userInfo', userInfo)
                    wx.setStorageSync('user_id', data.user.id)
                    wx.setStorageSync('type', data.user.type)
                  }
                  var route = wx.getStorageSync('jump')
                  // if (route == '/pages/tabBar/welcome') {
                  //   return
                  // }
                  // if (route.includes('/pages/tabBar/home')) {
                  //   this.getNewCount()
                  //   this.upDate()
                  // }
                  if (!data.token) {
                    wx.redirectTo({url: '/pages/tabBar/login?from_openid=' + wx.getStorageSync('from_openid')})
                  } else {
                    if (route.includes('tabBar')) {
                      route = route.split('?')[0]
                      wx.switchTab({url: route})
                    } else {
                      console.log(route)
                      wx.redirectTo({url: route})
                    }
                  }
                }
              })
            },
            fail: (res) => {
              console.log('wepy.login.fail:', res)
            }
          })
        } else if (code == 3) {
          wx.setStorageSync('jump', url)
          var pages = getCurrentPages()    // 获取加载的页面
          var currentPage = pages[pages.length - 2]    // 获取上级页面的对象
          wx.showModal({
            title: '提示',
            content: `${notice}`,
            confirmText: `${operate}`,
            success: (res) => {
              if (res.confirm) {
                if (`${operate}` == '打开资料') {
                  let vm = this
                  this.$put({url: `${service.host}/change/hidden/profile`, data: {type: 'NONE'}}, {
                    success: ({code, data}) => {
                      vm.$showToast('已打开')
                      setTimeout(() => {
                        vm.$gotoBack(1)
                      }, 1000)
                    }
                  })
                  console.log('打开资料')
                } else {
                  wx.navigateTo({url: `/${path}`})
                }
              } else if (res.cancel) {
                if (currentPage) {
                  wx.navigateBack({
                    delta: 1
                  })
                } else {
                  wx.switchTab({url: `/pages/tabBar/home`})
                }
              }
            }
          })
          return setTimeout(() => {
            if (this.isFunction(fail)) {
              fail({statusCode, ...data})
              this.$apply()
            }
          })
        } else {
          return setTimeout(() => {
            if (this.isFunction(fail)) {
              fail({statusCode, ...data})
              this.$apply()
            } else {
              wx.showModal({
                title: '提示',
                content: data.message,
                showCancel: false
              })
            }
          })
        }
      },
      fail: ({statusCode, data}) => {
        console.log('[ERROR]', statusCode, data)
        return setTimeout(() => {
          this.isFunction(error) && error({statusCode, ...data})
          this.$apply()
        })
      },
      complete: (res) => {
        wx.hideLoading()
        if (res.errMsg.indexOf('timeout') > -1) {
          wx.showToast({
            title: '当前网络不稳定！请重试...',
            icon: 'none',
            duration: 2000
          })
        }
        this.init = true // 隐藏加载提示
        wx.hideNavigationBarLoading() // 停止下拉状态
        wx.stopPullDownRefresh() // 完成回调
        return (() => {
          let completeExist = this.isFunction(complete)
          completeExist && complete(res)
          this.$apply()
        })()
      }
    }))
  }
}

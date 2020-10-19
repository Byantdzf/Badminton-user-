class Person {
  constructor() {

  }
  SystemInfo() {
    try {
      const res = wx.getSystemInfoSync()
      // console.log(res.model)
      // console.log(res.pixelRatio)
      // console.log(res.windowWidth)
      // console.log(res.windowHeight)
      // console.log(res.language)
      // console.log(res.version)
      // console.log(res.platform)
      let model = res.model.split(' ')
      let system = res.system.split(' ')
      let SystemInfo = `${model[0]}-${model[1]}-${system[0]}-${system[1]}`
      wx.setStorageSync('SystemInfo', SystemInfo)
      wx.setStorageSync('system', res.system.split(' ')[0])
      // console.log(wx.getStorageSync('system'))
    } catch (e) {
      // Do something when catch error
      console.log('机型获取失败')
    }
  }
}

let newPerson = new Person()
newPerson.SystemInfo()

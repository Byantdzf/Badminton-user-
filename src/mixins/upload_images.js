import wepy from 'wepy';
import { service } from '../config.js'

export default class upload_image extends wepy.mixin {
  data = {
    Images: '',
    files: '',
    ShowUpload: false,
    BookImage: [],
    UploadIndex: 0,
    list: []
  }
  onLoad () {
    console.log(this.list)
  }
  uploadFiles(filePaths) {
    let that = this
    let token = wx.getStorageSync('token')
    wx.uploadFile({
      url: service.image_upload,
      filePath: filePaths,
      method: 'POST',
      name: 'fileData',
      header: {
        'Authorization': 'Bearer ' + token,
        'content-type': 'multipart/form-data',
        'X-Requested-With': 'XMLHttpRequest'
      },
      success: (resp) => {
        wx.hideLoading()
        that.UploadIndex++
        that.Images = JSON.parse(resp.data).data
        that.list.push(that.Images)
        // if(that.list.length >= 7) {
        //   that.list.length = 7
        // }
        console.log(that.list)
        that.$apply()
      },
      fail: (res) => {
        wx.hideToast();
        wx.showModal({
          title: '错误提示',
          content: '上传图片失败',
          showCancel: false,
          success: function (res) { }
        })
      },
      complete: () => {
      }
    })
  }
  methods = {
    chooseimage() {
      var that = this
      wx.chooseImage({
        count: 7,
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  ['original', 'compressed']
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          that.$showLoading('正在上传...')
          that.files = res.tempFilePaths
          that.ShowUpload = true
          that.BookImage = res.tempFilePaths
          console.log( that.BookImage)
          console.log( that.BookImage.length)
          that.$apply()
          for (let i = 0; i < that.BookImage.length; i++) {
            that.uploadFiles(that.BookImage[i])
          }
        }
      })
    },
    // preview(item) {
    //   let that = this
    //   wx.previewImage({
    //     current: item,
    //     urls: that.list
    //   })
    // }
  }
}

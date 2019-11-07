//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    title: '',
    content: {},
    confirmText:'',
    cancelText:'',
    showDialog: false,
    _imageUrl: '/images/btn_ok_unable.png',
    enable: false
  },
  onLoad: function () {
    var content = wx.getStorageSync('content')
    this.setData({
      content: content
    })
    this.show()
  },
  onReady: function () {

  },
  show() {
    this._checkData()
    this.setData({
      showDialog: true
    })
  },
  hide() {
    this.setData({
      showDialog: false
    })
  },
  /*
  * 内部私有方法建议以下划线开头
  * triggerEvent 用于触发事件
  */
  _cancel() {
    //触发取消回调
    this.triggerEvent("cancel")
  },
  _confirm() {
    var pages = getCurrentPages();//当前页面栈
    //触发成功回调
    if (this.data.enable) {
      wx.navigateBack({
        delta: 1
      })
      pages[0].handleConfirmDialog(this.data.content)
    }
  },
  _beginTimeChange: function (e) {
    var data = this.data.content
    data.beginTime = e.detail.value
    this.setData({
      content: data
    })
    this._checkData();
  },
  _endTimeChange: function (e) {
    var data = this.data.content
    data.endTime = e.detail.value
    this.setData({
      content: data
    })
    this._checkData();
  },
  _planBlur: function (e) {
    var data = this.data.content
    data.plan = e.detail.value
    this.setData({
      content: data
    })
    this._checkData();
  },
  _remindTimeChange: function (e) {
    var data = this.data.content
    data.remindTime = e.detail.value
    this.setData({
      content: data
    })
    this._checkData();
  },
  _checkData: function () {
    var data = this.data.content
    if (data.beginTime != '' && data.endTime != '' && data.remindTime != '' && data.plan != '') {
      this.setData({
        _imageUrl: '/images/btn_ok_able.png',
        enable: true
      })
    }
    else {
      this.setData({
        _imageUrl: '/images/btn_ok_unable.png'
      })
    }
  },
  _maskTap: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  _alertTap: function () {

  }
})

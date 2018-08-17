// pages/me/me.js
Page({
  data: {
    userinfo: {},
    loginsuccessdata: {}
  },
  toTrack: function() {
    wx.navigateTo({
      url: '../track/track',
    })
  },
  toVisitor: function() {
    wx.navigateTo({
      url: '../visitor/visitor',
    })
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    that.setData({
      userinfo: wx.getStorageSync('userInfo')
    })
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    var that = this
    that.setData({
      loginsuccessdata: wx.getStorageSync('loginSuccessData'),
      userinfo: wx.getStorageSync('userInfo')
    })
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})
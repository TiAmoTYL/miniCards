// pages/setting/setting.js
var app = getApp()
var that;
Page({
  data: {
    showInst1: false,
    inst1Images: [app.globalData.bgImg + 'base1.png', app.globalData.bgImg + 'base2.png', app.globalData.bgImg + 'base3.png'],
    showInst2: false,
    inst2Images: [app.globalData.bgImg + 'create1.png', app.globalData.bgImg + 'create2.png'],
    showInst3: false,
    inst3Images: [app.globalData.bgImg + 'scan1.png', app.globalData.bgImg + 'scan2.png'],
    showInst4: false,
    inst4Images: [app.globalData.bgImg + 'saveToP1.png', app.globalData.bgImg + 'saveToP2.png'],

    showInst5: false,
    inst5Images: [app.globalData.bgImg + 'tag1.png', app.globalData.bgImg + 'tag2.png', app.globalData.bgImg + 'tag3.png'],

    showInst6: false,
    inst6Images: [app.globalData.bgImg + 'public1.png', app.globalData.bgImg + 'public2.png'],
    showInst7: false,
    inst7Images: [app.globalData.bgImg + 'adv1.png', app.globalData.bgImg + 'adv2.png', app.globalData.bgImg + 'adv3.png'],  
    showInst8: false,
    inst8Images: [app.globalData.bgImg + 'erweima1.png', app.globalData.bgImg + 'erweima2.png'],

    showInst9: false,
    inst9Images: [app.globalData.bgImg + 'visit1.png', app.globalData.bgImg + 'visit2.png'],
    showInst10: false,
    inst10Images: [app.globalData.bgImg + 'zhuomian1.png', app.globalData.bgImg + 'zhuomian2.png'],

  },
  preImg:function(e){
    console.log(e)
    wx.previewImage({
      urls: [e.currentTarget.dataset.path],
      success: function () {
        // that.countdown(that);
      }
    })
  },
  inst1: function () {
    that.setData({
      "showInst1": !this.data.showInst1
    });
  },
  inst2: function () {
    that.setData({
      "showInst2": !this.data.showInst2
    });
  },
  inst3: function () {
    that.setData({
      "showInst3": !this.data.showInst3
    });
  },
  inst4: function () {
    that.setData({
      "showInst4": !this.data.showInst4
    });
  },
  inst5: function () {
    that.setData({
      "showInst5": !this.data.showInst5
    });
  },
  inst6: function () {
    that.setData({
      "showInst6": !this.data.showInst6
    });
  },
  inst7: function () {
    that.setData({
      "showInst7": !this.data.showInst7
    });
  },
  inst8: function () {
    that.setData({
      "showInst8": !this.data.showInst8
    });
  },
  inst9: function () {
    that.setData({
      "showInst9": !this.data.showInst9
    });
  },
  inst10: function () {
    that.setData({
      "showInst10": !this.data.showInst10
    });
  },
  onLoad: function (options) {
    that = this;
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})
// pages/visitor/visitor.js
var app = getApp()
var that;
Page({
  data: {
    cardListData: [],
    showToast: false,
    getCustomData: {
      'url': '/V1/visit/List.do',
      'data': {
        openId: "",
        'page': 1
      }
    },
    mood:false,
    getMoodsList: {
      'url': '/V1/card/moodsList.do',
      'data': {
        'code': '',
        'page': 1
      }
    }
  },
  //下拉刷新数据
  onPullDownRefresh: function() {
    if (this.data.mood) {
      that.getMoodsList();
      return
    }
    this.getCustomList()
  },
  //上拉加载分页数据
  onReachBottom: function() {
    console.log("上拉加载分页数据")


  },

  //获取访客列表数据
  getCustomList: function() {
    app.getData(that.data.getCustomData.url + "?openId=" + that.data.getCustomData.data.openId + "&page=" + that.data.getCustomData.data.page, function(res) {
      if (res.status != 200) {
        app.showErrorMsg("查询失败，请稍后重试");
        return;
      }
      if (res.result.length === 0) {
        wx.showToast({
          title: '没有更多内容了',
          icon: 'success',
          duration: 2000
        })
      } else {
        wx.showLoading({
          title: '加载中',
        })
        that.setData({
          cardListData: res.result
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 800)
      }
    })
  },

  //获取人气列表数据
  getMoodsList: function() {
    app.getData(that.data.getMoodsList.url + "?cardCode=" + that.data.getMoodsList.data.code + "&page=" + that.data.getMoodsList.data.page, function(res) {
      if (res.status != 200) {
        app.showErrorMsg("查询失败，请稍后重试");
        return;
      }
      if (res.result.length === 0) {
        wx.showToast({
          title: '没有更多内容了',
          icon: 'success',
          duration: 2000
        })
      } else {
        wx.showLoading({
          title: '加载中',
        })
        that.setData({
          cardListData: res.result
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 800)
      }
    })
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    that = this
    if (options.mood) {
      wx.setNavigationBarTitle({
        title: '人气列表',
      })
      this.setData({
        "getMoodsList.data.code": options.code,
        "mood":true
      })
    }
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    var user = wx.getStorageSync("userInfo");
    this.setData({
      "getCustomData.data.openId": user.openId
    })
    if(this.data.mood){
      that.getMoodsList();
      return 
    }
    that.getCustomList();
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})
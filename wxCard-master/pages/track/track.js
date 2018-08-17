// pages/visitor/visitor.js
var app = getApp()
var that;
Page({
  data: {
    proList: [],
    showToast: false,
    getCustomData: {
      'url': '/V1/visit/proList.do',
      'data': {
        openId: "",
        'page': 1
      }
    }
  },
  //下拉刷新数据
  onPullDownRefresh: function() {
    this.getCustomList()
  },
  //上拉加载分页数据
  onReachBottom: function() {
    console.log("上拉加载分页数据")
  },

  //获取产品列表数据
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

        var list = new Array();
        for (var i = 0; i < res.result.length; i++) {
          var obj = res.result[i];
          obj.avatarUrl = app.globalData.pimageUrl + encodeURI(res.result[i].avatarUrl);
          list.push(obj)
        }
        that.setData({
          proList: list
        })

        wx.showLoading({
          title: '加载中',
        })

        setTimeout(function() {
          wx.hideLoading()
        }, 800)
      }
    })
  },
  visitDetail: function(e) {
  wx.navigateTo({
    url: '../trackdetail/trackdetail?code=' + e.currentTarget.dataset.code,
  })
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    that = this
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
    that.getCustomList();
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})
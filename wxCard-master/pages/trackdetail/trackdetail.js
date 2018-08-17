// pages/visitor/visitor.js
var app = getApp()
var that;
Page({
  data: {
    proCode: '',
    showToast: false,
    item: {},
    itemList: [],
    getData: {
      'url': '/V1/visit/vistProList.do'
    }
  },
  //拨打电话
  phoneCall: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.id //仅为示例，并非真实的电话号码
    })
  },
  //下拉刷新数据
  onPullDownRefresh: function() {
    this.getDataList()

  },
  //上拉加载分页数据
  onReachBottom: function() {
    console.log("上拉加载分页数据")


  },

  //获取访客列表数据
  getDataList: function() {
    wx.showLoading({
      title: '加载中',
    })
    app.getData(that.data.getData.url + "?proCode=" + that.data.proCode, function(res) {
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
      
        res.result.avatarUrl = app.globalData.pimageUrl + encodeURI(res.result.avatarUrl);
        that.setData({
          itemList: res.result.vistList,
          item: res.result
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 800)
      };
      wx.hideLoading();
    })
  },

  onLoad: function(options) {

    // 页面初始化 options为页面跳转所带来的参数
    console.log(options)
    that = this
    this.setData({
      proCode: options.code,
    })
    this.getDataList();
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
    //that.getCustomList();
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})
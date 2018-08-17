// pages/visitor/visitor.js
var app = getApp()
var that;
Page({
  data: {
    openId: '',
    vOpenId: '',
    showToast: false,
    item:{},
    itemList:[],
    getData: {
      'url': '/V1/visit/vistList.do'
    }
  },
  //拨打电话
  phoneCall: function (e) {
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



  },

  //获取访客列表数据
  getDataList: function() {
    app.getData(that.data.getData.url + "?openId=" + that.data.openId + "&vOpenId=" + that.data.vOpenId, function(res) {
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
        var obj = {};
        if (res.result.length>0){
          obj=res.result[0];
        }
        that.setData({
          itemList: res.result,
          item: obj
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
    this.setData({
      openId: options.code,
      vOpenId: options.vCode,
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
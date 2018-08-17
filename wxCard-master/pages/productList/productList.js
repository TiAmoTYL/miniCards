// pages/visitor/visitor.js
var app = getApp()
var that;
Page({
  data: {
    canEdit: true,
    canAdd: true,
    isSahre: true,
    productList: [],
    ishint: false,
    showToast: false,
    cardcode: "",
    openId: "",
    delePro: {
      url: "/V1/product/delete.do?code="
    },
    getProductList: {
      url: "/V1/product/prodList.do?cardCode=",
    },
    getCustomData: {
      'url': 'Card/GetCustomList',
      'data': {
        'page': 1
      }
    },
    collectCardData: {
      'url': 'Card/CollCard',
      'data': {
        'id': ''
      }
    }
  },
  //下拉刷新数据
  onPullDownRefresh: function() {
    this.getProList()
    wx.stopPullDownRefresh();
  },
  //去产品详情
  toDetail: function(e) {

    if (e.currentTarget.dataset.pass == 1) {
      wx.navigateTo({
        url: '../prodetails/prodetails?code=' + e.currentTarget.dataset.code + "&type=1" + "&isShare=true",
      })
    } else {
      wx.navigateTo({
        url: '../prodetails/prodetails?code=' + e.currentTarget.dataset.code + "&type=2" + "&isShare=false",
      })
    }

  },
  //删除产品
  delePro: function(e) {
    app.getData(that.data.delePro.url + e.currentTarget.dataset.code, function(res) {
      if (res.status === 200) {
        that.getProList();
      } else {
        app.showErrorMsg(res.msg);
      }
    })
  },
  //编辑产品
  editPro: function(e) {

    wx.navigateTo({
      url: '../createproduct/createproduct?code=' + e.currentTarget.dataset.code + "&type=1",
    })
  },
  //添加产品
  addProduct: function(res) {
    var user = wx.getStorageSync('userInfo');

    if (user != '' && user.userName != '' && user.openId != '') {
      wx.navigateTo({
        url: '../createproduct/createproduct?code=' + this.data.cardCode + "&type=0",
      })
    } else {
      if (res.detail.errMsg == "getUserInfo:ok") {
        app.getWxUserInfo(res, function(data) {
          if (data == 'success') {
            wx.navigateTo({
              url: '../createproduct/createproduct?code=' + this.data.cardCode + "&type=0",
            })
          } else {
            wx.showToast({
              title: data,
              icon: 'none'
            })
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '需要授权才能正常使用小程序',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }




  },


  //获取产品数据
  getProList: function() {
    app.getData(that.data.getProductList.url + this.data.cardCode + "&isShare=" + this.data.isShare, function(res) {
      if (res.status === 200) {
        var list = new Array();
        for (var i = 0; i < res.result.length; i++) {
          var obj = res.result[i];
          obj.avatarUrl = app.globalData.imageUrl + encodeURI(res.result[i].avatarUrl);
          if (obj.pass == 0) {
            obj['checkUrl'] = app.globalData.proWPass;
          }
          if (obj.pass == 1) {
            obj['checkUrl'] = app.globalData.proPass;
          }
          if (obj.pass == 2) {
            obj['checkUrl'] = app.globalData.proNPass;
          }
          list.push(obj)
        }
        that.setData({
          productList: list
        })
      } else {
        app.showErrorMsg(res.msg)
      }
    })
  },

  onLoad: function(options) {

    // 页面初始化 options为页面跳转所带来的参数
    that = this;
    var canEditINIT = true;
    var canAddINIT = true;
    var isShareINIT = true;
    //不能删除和编辑
    if (options.type == 2) {
      canEditINIT = false;
      canAddINIT = false;

    }
    if (options.type == 1) {
      isShareINIT = false
    }
    this.setData({
      cardCode: options.code,
      canEdit: canEditINIT,
      canAdd: canAddINIT,
      isShare: isShareINIT
    })
    wx.setStorage({
      key: 'cardCode',
      data: options.code,
    })
  //  this.getProList();
  },
  onReady: function() {
    // 页面渲染完成
    //console.log(this.data.customData)
  },
  onShow: function() {
    // 页面显示
    var that = this
    this.getProList();
    //that.getCustomList(that, 1)
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})
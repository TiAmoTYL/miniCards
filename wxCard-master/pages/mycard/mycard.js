// pages/mycard/mycard.js
//获取应用实例

var app = getApp()
var that;
Page({
  data: {
    cardDataUrl: '/V1/card/cardList.do',
    cardListData: [],
    currenttab: 0,
    //要去创建名片
    toCreated: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //获取二维码地址
  getCode: function(e) {
    var that = this
    var url = app.globalData.GetCardQRCode + "?scene=" + e.currentTarget.dataset.id + "&page=pages/carddetails/carddetails"
    app.getData(url, function(res) {
      if (res.status == 200) {
        wx.previewImage({
          urls: [app.globalData.imageUrl + encodeURI(res.result)],
          success: function() {
            // that.countdown(that);
          }
        })
      } else {
        wx.showToast({
          icon: "none",
          duration: 2000,
          title: res.msg
        })
      }

    })
  },
  //去名片详细页
  toDetail: function(e) {
    wx.navigateTo({
      url: "../carddetails/carddetails?id=" + e.currentTarget.dataset.code + "&type=1&index=" + e.currentTarget.dataset.index
    })
  },
  //toCreated
  toCreated: function(e) {
    if (that.data.cardListData.length >= 5 || that.data.toCreated) {
      // app.showErrorMsg('最多只能创建五张名片');
      return;
    }
    this.setData({
      toCreated: true,
    })
  },
  //获取用户信息
  getWxUserInfo: function(res) {
    var that = this;
    if (res.detail.errMsg == "getUserInfo:ok") {
      var user = wx.getStorageSync('userInfo');
      if (user != '' && user.userName != '') {
        that.setData({
          'hasWxUserInfo': true,
        })
        that.getCardData();
      } else {
        app.getWxUserInfo(res, function(data) {
          if (data == 'success') {
            that.setData({
              'hasWxUserInfo': true,
            })
            that.getCardData();
          } else {
            wx.showToast({
              title: data,
              icon: 'none'
            })
          }
        })
      }
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
  },
  //获取我的名片数据
  getCardData: function() {

    var user = wx.getStorageSync('userInfo');
    app.getData(that.data.cardDataUrl + "?openId=" + user.openId, function(res) {

      if (res.status == 200) {
        wx.setStorageSync("cardList", res.result)
        that.setData({
          cardListData: res.result,
        })
        if (that.data.cardListData.length == 0 || that.data.toCreated) {
          wx.navigateTo({
            url: '../createcard/createcard?id=0'
          });
        } else if (that.data.cardListData.length >= 5 || that.data.toCreated) {
          setTimeout(() => {
            app.showErrorMsg('最多只能创建五张名片')
          }, 0);
       
        }
      } else {
        wx.showToast({
          icon: "none",
          title: res.msg,
        })
      }
    })
  },
  //查看名片人气
  showMoods: function(e) {
    wx.navigateTo({
      url: '../visitor/visitor?code=' + e.currentTarget.dataset.id + "&mood=1",
    })
  },
  //分享名片
  onShareAppMessage: function(e) {

    var that = this
    return {
      title: '您好,这是我的名片,请惠存。',
      path: 'pages/carddetails/carddetails?code=' + e.target.dataset.code + '&share=1&isShare=true',
      success: function(res) {
        // 分享成功
      },
      fail: function(res) {
        // 分享失败
      }
    }
  },
  //去编辑，名片
  toEdit: function(e) {
    wx.navigateTo({
      url: '../createcard/createcard?id=' + e.target.dataset.code + "&index=" + e.target.dataset.index
    })
  },
  //添加产品与服务
  addProduct: function(e) {
    wx.navigateTo({
      url: '../productList/productList?code=' + e.target.dataset.code + "&index=" + e.target.dataset.index + "&type=1"
    })
  },
  //拨打电话
  phoneCall: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone //仅为示例，并非真实的电话号码
    })
  },
  openCreatecard: function() {
    var that = this
    if (wx.getStorageSync('loginSuccessData').mobVerify) {
      wx.navigateTo({
        url: '../createcard/createcard?id=0'
      })
    } else {
      wx.showModal({
        title: '请验证手机',
        showCancel: false,
        content: '请先验证手机号码~',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../phoneverify/phoneverify'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  //扫描名片
  scanCard: function(e) {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        app.showLoading();
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        app.uploadFile({}, res.tempFiles[0].path, function(res) {
          var rest = JSON.parse(res.data)

          if (rest.status == 200) {
            wx.setStorageSync("scanCard", rest.result);
            wx.navigateTo({
              url: '../createcard/createcard?id=2'
            });
            app.hideLoading();
          }

        }, "/V1/card/scan/picture");
      }
    })
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.hideShareMenu();
    that = this
    if (wx.getStorageSync('userInfo') == '') {
      //      app.getLogiCallback("",function(){});
    } else {
      that.getCardData() //获取初始数据
      // if (wx.getStorageSync("cardList") == "") {
      //   that.getCardData() //获取初始数据
      // } else {
      //   that.setData({
      //     cardListData: wx.getStorageSync("cardList"),
      //   })
      // }
    }



  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    that = this
    this.setData({
      toCreated: false,
    })

    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    if (currPage.data.storege == "yes") {
      that.setData({
        cardListData: wx.getStorageSync("cardList"),
      })
    }
    if (wx.getStorageSync('userInfo') == '') {

    } else {
      //that.getCardData()  //获取初始数据
      // if (wx.getStorageSync("cardList") == "") {
      //   that.getCardData() //获取初始数据
      // } else {
      //   that.setData({
      //     cardListData: wx.getStorageSync("cardList"),
      //   })
      // }
    }
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }

})
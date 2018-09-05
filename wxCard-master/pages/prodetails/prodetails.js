// pages/carddetails/carddetails.js
var util = require('../../utils/util.js')
const logger = wx.getLogManager()
//获取应用实例
var app = getApp()
var that;
Page({
  data: {
    hasWxUserInfo: false,
    cardDetailsData: {},
    isShare: true,
    firstImg: "",
    images: [], //图片

    getData: {
      'url': '/V1/product/prodByCode.do?code=',
    },
    vistSave: {
      "url": "/V1/visit/saveOrUpdate.do",
      data: {

      }
    },
    getInfo: {
      url: '/v1/wechat/user/info',
      data: {
        sessionKey: '',
        signature: '',
        rawData: '',
        encryptedData: '',
        iv: '',
      },
    },

    isshare: false,
    isviewImage: true,

  },
  copyText: function (e) {
    app.setCBData(e.currentTarget.dataset.text);
  },
  //获取用户信息
  getWxUserInfo: function(res) {
    var that = this;
    if (res.detail.errMsg == "getUserInfo:ok"){
      app.getWxUserInfo(res, function (data) {
        if (data == 'success') {
          that.setData({
            'hasWxUserInfo': true,
          })
          wx.getStorage({
            key: 'userInfo',
            success: function (res) {
              res = res.data;
              var param = {
                cardCode: that.data.cardDetailsData.cardsInfo.code,
                openId: that.data.cardDetailsData.cardsInfo.openId,
                prodCode: that.data.cardDetailsData.code,
                vOpenId: res.openId,
                vWxAvatarUrl: res.avatarUrl,
                vWxCity: res.city,
                vWxCountry: res.country,
                vWxGender: res.gender,
                vWxNickName: res.nickName,
                vWxPhone: res.wxPhone,
                vWxProvince: res.province
              }
              if (param.vWxAvatarUrl == undefined || param.vWxAvatarUrl=='') {
                param.vWxAvatarUrl = res.wxAvatarUrl;
                param.vWxCity = res.wxCity;
                param.vWxCountry = res.wxCountry;
                param.vWxGender = res.wxGender;
                param.vWxNickName = res.wxNickName;
                param.vWxPhone = res.wxPhone;
                param.vWxProvince = res.wxProvince;
              }
              that.setData({
                "vistSave.data": param,
                hasWxUserInfo: true
              });
              app.postData(that.data.vistSave, function () { });
            },
          })
        } else {
          wx.showToast({
            title: data,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }else{
      app.showErrorMsg("请点击按钮授权，以便拥有更好的体验；谢谢。")
    }

  },
  checkWxAuth: function() {
    var user = wx.getStorageSync("userInfo")
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          that.setData({
            hasWxUserInfo: true,
          })
          setTimeout(function () {
            that.recordVisit();
          }, 2000)

         
        } else {
          wx.authorize({
            scope: 'scope.userInfo',
            success(res) {
              wx.getUserInfo({
                withCredentials: true,
                success: function(res) {
                  console.log(res.userInfo)
                  that.setData({
                    hasWxUserInfo: true,
                  })
                  if (res.encryptedData != undefined && res.encryptedData != '') {
                    that.setData({
                      "getInfo.data.sessionKey": wx.getStorageSync("userInfo").sessionKey,
                      "getInfo.data.signature": res.signature,
                      "getInfo.data.rawData": res.rawData,
                      "getInfo.data.encryptedData": res.encryptedData,
                      "getInfo.data.iv": res.iv,

                    });
                    app.PostData(that.data.getInfo, function(user) {
                      if (user.openId != '') {
                        var param = {
                          cardCode: that.data.cardDetailsData.cardsInfo.code,
                          openId: that.data.cardDetailsData.cardsInfo.openId,
                          prodCode: that.data.cardDetailsData.code,
                          prodName: that.data.cardDetailsData.title,
                          vOpenId: user.openId,
                          vWxAvatarUrl: user.wxAvatarUrl,
                          vWxCity: user.wxCity,
                          vWxCountry: user.wxCountry,
                          vWxGender: user.wxGender,
                          vWxNickName: user.wxNickName,
                          vWxPhone: user.wxPhone,
                          vWxProvince: user.wxProvince
                        }
                        if (param.openId != param.vOpenId) {
                          //非自己的情况下 才做记录
                          that.setData({
                            "vistSave.data": param,
                          });
                          app.postData(that.data.vistSave, function() {});
                        }
                      }
                      wx.setStorageSync("userInfo", user);

                    });
                  }

                }
              })
            },
            fail() {
              app.showErrorMsg("请点击按钮授权，以便拥有更好的体验；谢谢。")
            }
          })
        }
      }
    });

  },
  //发起请求做浏览记录
  recordVisit: function() {
  
    var user = wx.getStorageSync("userInfo")
    app.getData("/V1/system/user.do?openId=" + user.openId, function(res) {
      user = res.result;
      if (that.data.cardDetailsData.cardsInfo.openId != user.openId) {
        var param = {
          cardCode: that.data.cardDetailsData.cardsInfo.code,
          openId: that.data.cardDetailsData.cardsInfo.openId,
          prodCode: that.data.cardDetailsData.code,
          prodName: that.data.cardDetailsData.title,
          vOpenId: user.openId,
          vWxAvatarUrl: user.wxAvatarUrl,
          vWxCity: user.wxCity,
          vWxCountry: user.wxCountry,
          vWxGender: user.wxGender,
          vWxNickName: user.wxNickName,
          vWxPhone: user.wxPhone,
          vWxProvince: user.wxProvince
        }
        that.setData({
          "vistSave.data": param,
          hasWxUserInfo: true
        });
        app.postData(that.data.vistSave, function() {});
      }


    })

  },


  //去名片详细
  toCardDetail: function(e) {
    wx.navigateTo({
      url: "../carddetails/carddetails?code=" + e.currentTarget.dataset.code + "&share=1"
    })
  },
  //去产品列表
  toProList: function(e) {
    wx.navigateTo({
      url: '../productList/productList?code=' + e.currentTarget.dataset.code + "&isshare=true&type=2",
    })
  },
  //拨打电话
  phoneCall: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone //仅为示例，并非真实的电话号码
    })
  },
  onShareAppMessage: function() {
    
    if (this.data.cardDetailsData.pass=='1'){
      return {
        title: that.data.cardDetailsData.title,
        path: 'pages/prodetails/prodetails?code=' + that.data.cardDetailsData.code + '&type=1&isShare=true',
        success: function (res) {
          // 分享成功
        },
        fail: function (res) {
          // 分享失败
        }
      }
    } else if (this.data.cardDetailsData.pass == '0'){
      app.showErrorMsg('审核中，请稍后...')
    } else if (this.data.cardDetailsData.pass == '2') {
      app.showErrorMsg('请检查内容及图片是否涉黄、毒，和违反国家法律法规。')
    }
  
  },


  onLoad: function(options) {
    that = this
    wx.hideShareMenu()
    // 页面初始化 options为页面跳转所带来的参数
    if (options.type == 1) {
      var fImg = app.globalData.pimageUrl;
      this.setData({
        isShare: options.isShare
      })
      app.getData(this.data.getData.url + options.code + "&isShare=" + this.data.isShare, function(res) {
        fImg = fImg + encodeURI(res.result.avatarUrl);
        that.setData({
          cardDetailsData: res.result,
          images: util.imgObToListDeleteCover(res.result.pImgList, app.globalData.imageUrl),
          firstImg: fImg
        });
      });
    } else if (options.type == 2) { //预览
      var fImg = app.globalData.pimageUrl;
      this.setData({
        isShare: options.isShare,
        hasWxUserInfo: true,
      })
      app.getData(this.data.getData.url + options.code + "&isShare=" + this.data.isShare, function(res) {
        fImg = fImg + encodeURI(res.result.avatarUrl);
        that.setData({
          cardDetailsData: res.result,
          images: util.imgObToListDeleteCover(res.result.pImgList, app.globalData.imageUrl),
          firstImg: fImg
        });

      });
      wx.setNavigationBarTitle({
        title: '预览产品',
      });
    }
  },
  onReady: function() {
    // 页面渲染完成
   
  },
  onShow: function() {
    // 页面显示
    
    if (this.data.isShare) {
      that.checkWxAuth();
    }
    if (wx.getStorageSync('confirmLabel') != '') {
      var strs = wx.getStorageSync('confirmLabel');
      that.setData({
        tagText: strs
      })
      wx.setStorageSync("confirmLabel", '')
    }


  },
  onHide: function() {
    // 页面隐藏
    if (that.data.isShare) {}
  },
  onUnload: function() {
    // 页面关闭

  }
})
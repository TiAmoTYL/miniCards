// pages/carddetails/carddetails.js
var util = require('../../utils/util.js')

//获取应用实例
var app = getApp()
var that;
Page({
  data: {
    cardDetailsData: {},
    showCardInfo: true, //显示q名片
    showEnterInfo: true, //企业信息
    showImgInfo: true, //图片
    showUpButton: false,
    showUpSavePhone: true,
    images: [], //图片
    collCardData: {
      'url': '/V1/cardcase/saveOrUpdateCardCase.do',
      'data': {
        'cardCode': '',
        'openId': '',
        'vOpenId': ""

      }
    },
    hasWxUserInfo: false,
    tagText: "贴标签",

    showTag: false,
    canDele: false,
    getData: {},
    isshare: false,
    isviewImage: true,
    econds: 3,
    getSeleLabel: {
      url: '/V1/label/ListByCardCode.do?cardCode='
    },
    //点赞
    reliable: {
      'url': '/V1/card/reliable.do',
      'data': {
        "cardCode": "",
        "vOpenId": "",
        "cancel": false
      }
    },

    //获取名片详细
    cardDetails: {
      'url': 'Card/GetCard',
      'data': {
        'id': ''
      }
    },
    othersCardDetails: {
      'url': '/V1/cardcase/saveOrUpdateCardCase.do',
      'data': {
        'id': '',
        'openId': ''
      }
    },
    undockCard: {
      url: "/V1/cardcase/delete.do",
      data: {
        openId: "",
        cardCode: ""
      }
    }


  },
  //打开地图定位位置
  openAaddress:function(e){
    if (e.currentTarget.dataset.add != undefined && e.currentTarget.dataset.add!=''){
      var i = e.currentTarget.dataset.add.split(',');
      wx.openLocation({
        latitude: parseFloat(i[0]),
        longitude: parseFloat(i[1]),
        scale: 28
      })
    }
   
  },
  //复制到剪贴板
  copyText:function(e){
    app.setCBData(e.currentTarget.dataset.text);
  },
  //获取用户信息
  getWxUserInfo: function(res) {
    var that = this;
    if (res.detail.errMsg == "getUserInfo:ok") {
      if (wx.getStorageSync("userInfo").openId!=''){
        wx.navigateTo({
          url: '../productList/productList?code=' + that.data.cardDetailsData.code + "&isshare=" + that.data.isshare + "&type=2",
        })
        return;
      }
      app.getWxUserInfo(res, function(data) {
        if (data == 'success') {
          that.setData({
            'hasWxUserInfo': true,
          })
          wx.navigateTo({
            url: '../productList/productList?code=' + that.data.cardDetailsData.code + "&isshare=" + that.data.isshare + "&type=2",
          })
        } else {
          wx.showToast({
            title: data,
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      app.showErrorMsg("请授权，以便拥有更好的体验；谢谢!")
    }
  },
  checkWxAuth: function() {
    if (wx.getStorageSync("userInfo").wxNickName != '' || wx.getStorageSync("userInfo").nickName != '') {
      this.setData({
        hasWxUserInfo: true,
      })
    }
  },
  //打开地图
  openAddress: function(e) {
    wx.getLocation({
      //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        var latitude = parseFloat(e.target.dataset.loglat.split(",")[0])
        var longitude = parseFloat(e.target.dataset.loglat.split(",")[1])
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          name: e.target.dataset.name,
          address: e.target.dataset.name,
          scale: 28,
          complete: function(res) {}
        })
      }
    })
  },
  onShareAppMessage: function() {

    return {
      title: '您好,这是我的名片,请惠存。',
      path: 'pages/carddetails/carddetails?code=' + that.data.cardDetailsData.code + '&share=1&isShare=true',
      success: function(res) {
        // 分享成功
      },
      fail: function(res) {
        // 分享失败
      }
    }
  },
  //拨打电话
  phoneCall: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.id //仅为示例，并非真实的电话号码
    })
  },
  //去产品列表
  toProduct: function(e) {
    // wx.navigateTo({
    //   url: '../productList/productList?code=' + this.data.cardDetailsData.code + "&isshare=" + this.data.isshare + "&type=2",
    // })
  },
  //显示名片信息
  cardInfo: function() {
    that.setData({
      "showCardInfo": !this.data.showCardInfo
    });

  },
  //显示企业介绍
  enterInfo: function() {
    that.setData({
      "showEnterInfo": !this.data.showEnterInfo
    });
  },
  //显示图片
  imgInfo: function() {
    that.setData({
      "showImgInfo": !this.data.showImgInfo
    });
  },
  //预览图片
  previewImage: function(e) {
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.path] // 需要预览的图片http链接列表
    })
  },

  //获取二维码地址
  getCode: function(e) {
    var that = this
    var url = app.globalData.GetCardQRCode + "?scene=" + e.currentTarget.dataset.id + "&page=pages/carddetails/carddetails"
    app.getData(url, function(res) {

      if (res.status == 200) {
        wx.previewImage({
          urls: [app.globalData.imageUrl + "?path=" + encodeURI(res.result)],
          success: function() {
            that.countdown(that);
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

  //点赞
  reliable: function(e) {
    this.setData({
      "reliable.data.cardCode": this.data.cardDetailsData.code,
      "reliable.data.vOpenId": wx.getStorageSync("userInfo").openId,
      "reliable.data.cancel": !this.data.cardDetailsData.cancel
    })

    var i = 0;
    if (this.data.reliable.data.cancel) {
      i = i + that.data.cardDetailsData.reliable - 1
    } else {
      i = i + that.data.cardDetailsData.reliable + 1
    }
    that.setData({
      "cardDetailsData.cancel": this.data.reliable.data.cancel,
      "cardDetailsData.reliable": i
    })

    app.postData(this.data.reliable, function(res) {})
  },
  //收藏他人名片夹 并且打开名片小程序
  addCardOpen: function(e) {
    var that = this

    if (wx.getStorageSync("userInfo") != "") {
      that.setData({
        "collCardData.data.openId": wx.getStorageSync("userInfo").openId,
        'collCardData.data.cardCode': e.target.dataset.code,
        'collCardData.data.vOpenId': e.target.dataset.openid
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '添加失败，请先创建名片',
        success: function(res) {
          if (res.confirm) {
            app.getLogiCallback("", function() {});
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    }
    app.postData(that.data.collCardData, function(res) {
      var showIcon = 'success';
      var showText = '操作成功';
      if (res.status == 200) {
        var cardCaseList;
        if (wx.getStorageSync("cardCaseList") == '') {
          cardCaseList = new Array();
        } else {
          cardCaseList = wx.getStorageSync("cardCaseList");
        }
        cardCaseList.splice(0, 0, res.result)
        wx.setStorageSync('cardCaseList', cardCaseList)
      } else {
        showIcon = "none"
        showText = res.msg;
      }
      wx.showToast({
        title: showText,
        icon: showIcon,
        duration: 5000,
        complete: function() {
          wx.switchTab({
            url: '../cardcase/cardcase'
          })
        }
      })
    })
  },

  //贴标签
  getTag: function(e) {
    wx.navigateTo({
      url: '../tag/tag?code=' + e.currentTarget.dataset.code,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },



  countdown: function(that) {
    var second = that.data.econds
    var timer
    if (second == 0) {
      clearTimeout(timer);
      that.setData({
        econds: 3,
        isviewImage: true
      });
      return;
    }
    timer = setTimeout(function() {
      that.setData({
        econds: second - 1,
        isviewImage: false
      });
      that.countdown(that);
    }, 1000)
  },

  //删除单张名片
  removeCard: function(e) {
    var data = {
      'url': 'Card/RemoveCard',
      'data': {
        'id': e.target.dataset.id
      }
    }
    app.postData(data, function(res) {
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 2000,
        complete: function() {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    })
  },
  //编辑单张名片
  editCard: function(e) {
    wx.navigateTo({
      url: '../createcard/createcard?id=' + e.target.dataset.id
    })
  },

  //保存到我的手机
  saveToMyPhone: function() {

    if (wx.canIUse('addPhoneContact')) {
      wx.addPhoneContact({
        firstName: that.data.cardDetailsData.name,
        mobilePhoneNumber: that.data.cardDetailsData.phone,
        organization: that.data.cardDetailsData.company,
        weChatNumber: that.data.cardDetailsData.weChatNum,
        title: that.data.cardDetailsData.position,
        email: that.data.cardDetailsData.email,
        url: that.data.cardDetailsData.url,
        fail: function(e) {
          app.showErrorMsg("保存失败。")
        }
      })
    } else {
      app.showErrorMsg("您的微信版本过低，请升级。")
    }

  },
  //去我的名片
  toMycard: function() {
    wx.switchTab({
      url: '../mycard/mycard'
    })
  },
  //移除收藏的名片
  undockCard: function(e) {

    that.setData({
      "undockCard.data.openId": wx.getStorageSync("userInfo").openId,
      'undockCard.data.cardCode': e.target.dataset.code
    })
    app.postData(that.data.undockCard, function(res) {
      // if (res.status == 200) {
      //   wx.navigateBack({
      //     delta: 1
      //   })
      // } else {
      //   app.showErrorMsg(res.msg)
      // }
      wx.navigateBack({
        delta: 1
      })
    })
  },
  //收藏他人名片夹
  addCard: function(e) {
    var that = this
    that.setData({
      'collCardData.data.id': e.target.dataset.id
    })
    app.postData(that.data.collCardData, function(res) {
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 2000,
        complete: function() {
          // wx.switchTab({
          //   url: '../mycard/mycard'
          // })
          app.postData(that.data.othersCardDetails, function(res) {
            that.setData({
              cardDetailsData: res.data
            })
            that.setData({
              images: util.imgObToList(res.data.imgList)
            })
          })
        }
      })
    })
  },


  onLoad: function(options) {
    that = this;
    this.checkWxAuth();
    // 页面初始化 options为页面跳转所带来的参数
    if (options.type == 1) {
      var cardList = wx.getStorageSync("cardList");
      app.getData("/V1/card/cardByCode.do?code=" + options.id, function(res) {
        that.setData({
          'cardDetailsData': res.result,
          images: util.imgObToList(res.result.imgList, app.globalData.imageUrl)
        })
      })

    } else if (options.type == 2) {
      var tagStr = '贴标签';
      app.getData(this.data.getSeleLabel.url + options.code, function(res) {
        if (res.status == 200) {
          var list = res.result;
          for (var i = 0; i < list.length; i++) {
            var obj = list[i];
            tagStr = tagStr + "、" + obj.labelName;
          }
          tagStr = tagStr.substring(1, tagStr.length);
          that.setData({
            tagText: tagStr
          })
        } else {
          app.showErrorMsg(res.msg);
        }
      });

      app.getData("/V1/card/cardByCode.do?code=" + options.code, function(res) {
        that.setData({

          canDele: true,
          showTag: true,
          isshare: true,
          'cardDetailsData': res.result,
          images: util.imgObToList(res.result.imgList, app.globalData.imageUrl)
        })
      })
    } else if (options.share == "1" || (options.scene != undefined && options.scene != '')) {
      var code = options.code == undefined || options.code == '' ? options.scene : options.code;
      app.getData("/V1/card/cardByCode.do?code=" + code, function(res) {
        that.setData({
          showTag: true,
          isshare: true,
          showUpSavePhone: false,
          'cardDetailsData': res.result,
          images: util.imgObToList(res.result.imgList, app.globalData.imageUrl)
        })
      })
      //人气
      var mood = {
        'url': '/V1/card/moods.do',
        'data': {
          'cardCode': code,
          'vOpenId': wx.getStorageSync("userInfo").openId
        }
      }
      app.postData(mood, function(res) {});
    }


  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
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
  },
  onUnload: function() {
    // 页面关闭
  }
})
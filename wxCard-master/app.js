//app.js
var that;
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    that = this

    //this.getLogiCallback("",function(){});
  },
  onShow: function() {
    this.getLogiCallback("", function() {});
  },
  uploadFile: function(data, path, callback, url) {
    var that = this;
    if (url == undefined || url == null || url == '') {
      url = '/V1/card/upload/picture'
    }
    wx.uploadFile({
      url: that.globalData.myURL + url,
      filePath: path,
      name: 'image',
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: data,
      success: function(res) {
        callback(res)

      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {

      }
    })
  },
  getLogiCallback: function(val, callback) {
    console.log("login");
    var that = this
    wx.login({
      success: function(body) {
        if (body.code) {
          wx.request({
            url: that.globalData.myURL + "/v1/wechat/user/login?code=" + body.code,
            data: {},
            success: function(body) {
              var user = wx.getStorageSync('userInfo');
              if (user != '' && user.userName != '' && user.userName != undefined) {
                user.sessionKey = body.data.sessionKey;
                user.wxAvatarUrl = body.data.wxAvatarUrl;
                wx.setStorageSync("userInfo", user);
              } else {
                wx.setStorageSync('userInfo', body.data)
              }

              if (body.data.wxNickName != '') {}
              that.globalData.hasLogin = true;
            },
            fail: function(res) {
              console.log('/user/login 请求出错')
              console.log(res)

            }
          })
        } else {
          console.log('登录失败')
        }

      },
      fail: function(res) {
        console.log(res)
        console.log('login 请求出错')
      }
    })
    callback(val);
  },
  showErrorMsg: function(msg) {
    if (msg == null || msg == undefined) {
      msg = "";
    }
    if (msg.replace(/\s+/g, '') == '') {
      msg = '系统出错'
    }
    wx.showToast({
      icon: "none",
      // image: './images/error.png',
      duration: 2000,
      title: msg,
      mask: true
    })
  },
  showLoading: function(message) {
    if (message == undefined || message == null || message == '') {
      message = "加载中...";
    }
    if (wx.showLoading) {
      // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
      wx.showLoading({
        title: message,
        mask: true
      });
    } else {
      // 低版本采用Toast兼容处理并将时间设为20秒以免自动消失
      wx.showToast({
        title: message,
        icon: 'loading',
        mask: true,
        duration: 20000
      });
    }
  },
  hideLoading: function() {
    if (wx.hideLoading) {
      // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
      wx.hideLoading();
    } else {
      wx.hideToast();
    }
  },
  log: function() {
    return wx.getLogManager();
  },


  getWxUserInfo: function(res, callback) {

    wx.setStorageSync('wxUserInfo', res.detail.userInfo)
    var user = wx.getStorageSync('userInfo');


    var data = {
      'iv': res.detail.iv, //wx.getUserInfo接口返回那里的iv
      'rawData': res.detail.rawData, //wx.getUserInfo接口返回那里的iv
      'signature': res.detail.signature, // wx.getUserInfo接口返回那里的signature
      'encryptedData': res.detail.encryptedData, //wx.getUserInfo接口返回那里的encryptedData
      'sessionKey': user.sessionKey //wx.login接口下面 “code 换取 session_key” 获得
    }
    this.getLoginData(data, callback, res)

  },
  getLoginData: function(data, callback, resAuth) {
    console.log("getLoginData")
    var param = '';
    if (data.encryptedData != undefined && data.encryptedData != null) {
      param = data;
    } else {
      param = data.detail;
      param['sessionKey'] = wx.getStorageSync('userInfo').sessionKey;
    }
    var result = "netError";
    var that = this;
    var url = this.globalData.myURL + "/v1/wechat/user/info"
    wx.checkSession({
      success: function(res) {
        if (res.errMsg == 'checkSession:ok') {
          //session_key未过期
          wx.request({
            url: url,
            method: 'POST',
            data: param,
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
              if (res.statusCode == 200) {
                wx.setStorageSync('userInfo', res.data)
                if (typeof callback == 'function') {
                  callback("success")
                }
              } else {
                if (typeof callback == 'function') {
                  callback("netError")
                }
                wx.showToast({
                  title: '网络错误',
                  icon: 'none',
                  duration: 2000
                })
              }
              //callback(res.data)
            },
            fail: function(res) {
              console.log('请求出错')
              console.log(res)

            }
          })
        }

      },
      fail: (resp => {
        console.log("checkSession ff")

        // session_key已过期
        // 进行登录操作

        if (that.globalData.testNum == '') {
          that.globalData.testNum = 0;
          that.getLogiCallback(resAuth, that.getLoginData)
        } else if (that.globalData.testNum == 0) {
          if (typeof callback == 'function') {
            callback("netError")
          }
          wx.showToast({
            title: '网络错误',
            icon: 'none',
            duration: 2000
          })
        }
      })
    });

  },



  getData: function(data, callback) {
    this.showLoading();
    var url = this.globalData.myURL + data
    console.log("getData")
    console.log(url)
    var openId = wx.getStorageSync('userInfo').openId;
    var userCode = wx.getStorageSync('userInfo').code;
    wx.request({
      url: url,
      data: {},
      header: {
        "userCode": userCode,
        'openId': openId,
        'content-type': 'application/json'
      },
      success: function(res) {
        that.hideLoading();
        if (typeof callback == 'function') {
          callback(res.data)
        }

      },
      fail: function(res) {
        console.log('请求出错')
        console.log(res.data)
      },
      complete: function() {
        that.hideLoading();
      }
    })
  },
  postData: function(data, callback, failBack, completeBack) {
    this.showLoading();
    var url = this.globalData.myURL + data.url

    var openId = wx.getStorageSync('userInfo').openId;
    var userCode = wx.getStorageSync('userInfo').code;
    wx.request({
      url: url,
      method: 'POST',
      data: data.data,
      header: {
        "userCode": userCode,
        'openId': openId,
        'Content-Type': 'application/json'
      },
      success: function(res) {
        callback(res.data)
      },
      fail: function(res) {
        console.log('请求出错')
        console.error(res)
        if (typeof failBack == 'function') {
          failBack(res)
        }

      },
      complete: function() {
        that.hideLoading();
        if (typeof completeBack == 'function') {
          completeBack()
        }
      }
    })
  },
  setCBData: function(text) {　　　　
    wx.setClipboardData({　　　　　　
      data: text,
      success: function(res) {　　　　　　　　
        wx.getClipboardData({　　　　　　　　　　
          success: function(res) {　　　　　　　　　　　　
            wx.showToast({　　　　　　　　　　　　　　
              title: '复制成功'　　　　　　　　　　　　
            })　　　　　　　　　　
          }　　　　　　　　
        })　　　　　　
      }　　　　
    })　　
  },
  globalData: {
    testNum: '',
    hasLogin: false,
    //正式版
    myURL: "https://www.x-cloudcard.com",
    imageUrl: "https://www.x-cloudcard.com/V1/card/picture/show?path=",
    pimageUrl: "https://www.x-cloudcard.com/V1/product/picture/show?path=",

//体验版
  //  myURL: "https://www.x-cloudcard.com/devapi",
  //  imageUrl: "https://www.x-cloudcard.com/devapi/V1/card/picture/show?path=",
  //   pimageUrl: "https://www.x-cloudcard.com/devapi/V1/product/picture/show?path=",
   
   //本地版
    // myURL: "http://127.0.0.1:8090",
    // imageUrl: "http://127.0.0.1:8089/V1/card/picture/show?path=",
    // pimageUrl: "http://127.0.0.1:8089/V1/product/picture/show?path=",


    upPImageUrl: "/V1/product/upload/picture",
    bgImg: "https://www.x-cloudcard.com/V1/bg/show?path=",
    //bgImg:"https://www.x-cloudcard.com/devapi/V1/bg/show?path=",



    aboutImg: "https://www.x-cloudcard.com/V1/bg/show?path=" + encodeURI("about.png"),
    GetCardQRCode: "/V1/card/cardQRCode.do",
    //产品审核图标显示
    proPass: "https://www.x-cloudcard.com/V1/product/picture/show?path=" + encodeURI("/root/upload/product/0a_Pass.png"),
    proNPass: "https://www.x-cloudcard.com/V1/product/picture/show?path=" + encodeURI("/root/upload/product/0a_NPass.png"),
    proWPass: "https://www.x-cloudcard.com/V1/product/picture/show?path=" + encodeURI("/root/upload/product/0a_WPass.png"),
    //默认头像
    morenTouxian: "https://www.x-cloudcard.com/V1/bg/show?path=" + encodeURI("shouyeguangao.png"),
    token: "",
    cardImgLimNum: 9,
    productLimNum: 6,
    productImgLimNum: 9,
  }
})
// pages/createcard/createcard.js
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js')

var that;
Page({
  data: {
    loadingSavaOrUp:false,
    currPageType: '0',
    images: [], //下面选择图片
    showUpButton: true,

    hasWxUserInfo: false,
    isEdit: false,
    editIndex: 0,
    cardData: {
      "url": "/V1/card/saveOrUpdateCard.do",
      'data': {
        'code': '',
        'userCode': '',
        'name': '',
        'phone': '',
        'company': '',
        'vocation': '',
        'location': '',
        'url': '',
        "weChatNum": "",
        'companyProfile': '',
        'address': '',
        'email': '',
        'avatarUrl': '',
        'loglat': '',
        "imgList": new Array(),
        "mainBusiness": '',



        'language': ''
      }
    },
    deletePicData: {
      "url": "/V1/card/delete/picture",
      'data': {
        paths: new Array(),
      }
    },
    deleteCard: {
      url: "/V1/card/deleteByCode.do"
    }

  },
  cardDataMainBusiness: function(e) {
    this.setData({
      'cardData.data.mainBusiness': e.detail.value
    })
  },
  cardDataName: function(e) {
    this.setData({
      'cardData.data.name': e.detail.value
    })
  },
  cardDataTitle: function(e) {
    this.setData({
      'cardData.data.title': e.detail.value
    })
  },
  cardDataMobile: function(e) {
    this.setData({
      'cardData.data.phone': e.detail.value
    })
  },
  cardDataCompany: function(e) {
    this.setData({
      'cardData.data.company': e.detail.value
    })
  },
  cardDataPosition: function(e) {
    this.setData({
      'cardData.data.position': e.detail.value
    })
  },
  cardDataVocation: function(e) {
    this.setData({
      'cardData.data.vocation': e.detail.value
    })
  },
  cardDataEmail: function(e) {
    this.setData({
      'cardData.data.email': e.detail.value
    })
  },
  cardDataUrl: function(e) {
    this.setData({
      'cardData.data.url': e.detail.value
    })
  },
  cardDataWeChatNum: function(e) {
    this.setData({
      'cardData.data.weChatNum': e.detail.value
    })
  },

  cardDataCompanyProfile: function(e) {
    this.setData({
      'cardData.data.companyProfile': e.detail.value
    })
  },
  cardDataAddress: function (e) {
    this.setData({
      'cardData.data.address': e.detail.value
    })
  },
  //扫描名片
  scanCard: function(e) {
    if (this.data.loadingSavaOrUp){
      return;
    }
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
      
        app.showLoading();
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        app.uploadFile({}, res.tempFiles[0].path, function(res) {
          var rest = JSON.parse(res.data)

          that.setData({
            "cardData.data": rest.result,
            'cardData.data.avatarUrl': wx.getStorageSync('wxUserInfo').avatarUrl,
            images: util.imgObToList(rest.result.imgList, app.globalData.imageUrl),

          });
          app.hideLoading();

        }, "/V1/card/scan/picture");
      }
    })
  },

  //获取用户信息
  getWxUserInfo: function(res) {

    var that = this;
    app.getWxUserInfo(res, function(data) {
      if (data == 'success') {
        that.setData({
          'hasWxUserInfo': true,
        })
      } else {
        wx.showToast({
          title: data,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //头像事件
  portraitClick: function(e) {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFiles[0].path;
        if (res.tempFiles[0].size > (1024 * 1024 * 3)) {
          wx.showToast({
            icon: "none",
            title: '图片需小于3M',
          })
          return;
        }
        app.uploadFile({}, tempFilePaths, function(res) {

          var rest = JSON.parse(res.data)
          that.setData({
            'cardData.data.avatarUrl': app.globalData.imageUrl + encodeURI(rest.result.url),
          })
        });
      }
    })
  },
  //下面选择图片 s
  chooseImage: function() {
    // 选择图片
    wx.chooseImage({
      count: 6, // 默认9
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
      
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
       
        var imageN = that.data.images.length
        var showT = false;
        var list = res.tempFiles
        if (list.length>0){
          app.showLoading('处理中...')
        }
        for (var i = 0; i < list.length; i++) {
          if (list[i].size >= (1024 * 1024 * 3)) {
            showT = true;
          } else {
            imageN++;
            that.data.images.push({ src: list[i].path, index: that.data.cardData.data.imgList.length});

            var imagesList = new Array();
            app.uploadFile({}, list[i].path, function(res) {
              var rest = JSON.parse(res.data);
              that.data.cardData.data.imgList.push(rest.result)
              app.hideLoading();
            });
          }
          if (imageN >= app.globalData.cardImgLimNum) {
            break;
          }
        }
        that.setData({
          images: that.data.images
        });
        imageN = that.data.images.length
        if (imageN >= app.globalData.cardImgLimNum && !showT) {
          wx.showToast({
            icon: "none",
            title: '只能上传' + app.globalData.cardImgLimNum + '张图片,且不能大于3M',
            duration: 2000
          })
          that.setData({
            showUpButton: false
          });
        } else if (showT) {
          wx.showToast({
            icon: "none",
            title: '图片不能大于100K',
            duration: 2000

          })
        }

    
      }
    })
  },
  deleteImage: function(e) {
 
    var index = e.currentTarget.dataset.index;
    var images = this.data.images;
    images.splice(index, 1);
    this.setData({
      images: images,
      showUpButton: true

    });
    this.data.cardData.data.imgList[e.currentTarget.dataset.ind].isDelete = "Y";

  },

  //下面选择事件 e

  //预览图片
  previewImage: function(e) {
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.path] // 需要预览的图片http链接列表
    })
  },


  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    that = this
    if (wx.getStorageSync("wxUserInfo") == '' && wx.getStorageSync("userInfo") == '') {
      that.setData({
        'hasWxUserInfo': false,
      })
    } else {
      that.setData({
        'hasWxUserInfo': true,
      })
    }

    if (options.id === "0") {
      var url = '';
      var name = '';
      if (wx.getStorageSync('wxUserInfo')!=''){
        url = wx.getStorageSync('wxUserInfo').avatarUrl;
        name = wx.getStorageSync('wxUserInfo').nickName;
      } else if (wx.getStorageSync('userInfo') != ''){
        url = wx.getStorageSync('userInfo').wxAvatarUrl;
        name = wx.getStorageSync('userInfo').wxNickName;
      }
      that.setData({
        currPageType: '0',
        'cardData.data.code': '',
        'cardData.data.avatarUrl': url,
        'cardData.data.name': name,
      })
      wx.setNavigationBarTitle({
        title: '创建名片'
      })
    } else if (options.id === "1") {
      wx.setNavigationBarTitle({
        title: '创建名片'
      })
      that.setData({
        currPageType: '1',
        'cardData.data': wx.getStorageSync("scanCard"),
        'cardData.data.avatarUrl': wx.getStorageSync('wxUserInfo').avatarUrl,
      })

    } else if (options.id == "2") {
      wx.setNavigationBarTitle({
        title: '添加好友，信息补充'
      })
      that.setData({
        'cardData.url': "/V1/card/saveOthCard.do",
        currPageType: '2',
        'cardData.data': wx.getStorageSync("scanCard"),
        images: util.imgObToListWithIndex(wx.getStorageSync("scanCard").imgList, app.globalData.imageUrl),
      })
    } else {
      wx.setNavigationBarTitle({
        title: '编辑名片'
      })
      let code = '';
      if (options.id != undefined && options.id != null && options.id.length> 1) {
        code = options.id
      } else if (options.code != undefined && options.code != null && options.code.length> 1) {
        code = options.id
      }
      if (code != '') {
        app.getData("/V1/card/cardByCode.do?code=" + code, function(res) {
          that.setData({
            'cardData.data': res.result,
            images: util.imgObToListWithIndex(res.result.imgList, app.globalData.imageUrl),
            "isEdit": true,
          })
        })
      } else {
        cardList[options.index].imgList
        that.setData({
          'cardData.data': cardList[options.index],
          images: util.imgObToList(cardList[options.index].imgList, app.globalData.imageUrl),
          "isEdit": true,
          "editIndex": options.index

        })
      }



      var editDataCard = {
        'url': 'Card/GetCard',
        'data': {
          'id': options.id
        }
      }
      // app.postData(editDataCard, function (res) {
      //   that.setData({
      //     'cardData.data': res.data,
      //   })

      // })
    }





  },

  onReady: function() {
    // 页面渲染完成  
  },
  onShow: function() {
    if (wx.getStorageSync("wxUserInfo") == '') {
      this.setData({
        'hasWxUserInfo': false,
      })
    } else {
      this.setData({
        'hasWxUserInfo': true,
      })
    }
  },
  onHide: function() {

    // 页面隐藏
  },
  onUnload: function() {

    // 页面关闭
  },
  //获取当前位置
  openAddress: function() {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        if (res.address == undefined || res.address == '' || res.address == null) {
          wx.showToast({
            title: '请选择地址',
            image: '../../images/error.png',
            duration: 2000
          })
        } else {
          that.setData({
            'cardData.data.address': res.address,
            'cardData.data.loglat': res.latitude + ',' + res.longitude
          })

        }

      },
      fail: function(res) {},
      complete: function(res) {}
    })
  },
  //提交表单
  formSubmit: function(e) {

    var that = this
    if (e.detail.value.name === '' || e.detail.value.phone === '') {
      if (e.detail.value.name === '') {
        wx.showToast({
          title: '姓名必填',
          image: '../../images/error.png',
          duration: 2000
        })
      }
      if (e.detail.value.phone === '') {
        wx.showToast({
          title: '联系方式必填',
          image: '../../images/error.png',
          duration: 2000
        })

      }
    } else {

      if (e.detail.value.email != '') {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!filter.test(e.detail.value.email)) {
          wx.showToast({
            title: '邮箱错误',
            image: '../../images/error.png',
            duration: 2000
          });
          return
        }

      }
      that.setData({
        'loadingSavaOrUp': true
      })
      
      app.postData(this.data.cardData, function(res) {
        
        if (res.status == 200) {
          var cardList
          if (wx.getStorageSync("cardList") == '') {
            cardList = new Array();
          } else {
            cardList = wx.getStorageSync("cardList")
          }
          var obj = res.result;
          if (!that.data.isEdit) {
            cardList.splice(0, 0, obj)
          } else {
            cardList.splice(that.data.editIndex, 1)
            cardList.splice(0, 0, obj)
          }
          if (that.data.currPageType!='2'){
            wx.setStorageSync('cardList', cardList);
          }
         
          let pages = getCurrentPages();//当前页面
          let prevPage = pages[pages.length - 2];//上一页面
          prevPage.setData({//直接给上移页面赋值
            storege: 'yes'
          });
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showToast({
            icon: "none",
            title: res.msg,
            duration: 2000
          })
        }
        
      },null,function(){
          that.setData({
          'loadingSavaOrUp': false
        })
      })



    }
  },
  //删除名片
  deleteCard: function() {
    if (this.data.cardData.code != "") {
      that.setData({
        'loadingSavaOrUp': true
      })
      app.getData(this.data.deleteCard.url + "?code=" + this.data.cardData.data.code, function(res) {
        if (res.status == 200) {
          var cardList = wx.getStorageSync("cardList")
          cardList.splice(that.data.editIndex, 1)
          wx.setStorageSync('cardList', cardList);
          let pages = getCurrentPages();//当前页面
          let prevPage = pages[pages.length - 2];//上一页面
          prevPage.setData({//直接给上移页面赋值
            storege: 'yes'
          });
          wx.navigateBack({
            delta: 1
          })
        }
      },null,function(){
        that.setData({
          'loadingSavaOrUp': false
        })
      })
    } else {
      app.showErrorMsg("系统出错了。")
    }
  },
  formReset: function() {}
})
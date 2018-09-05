// pages/createcard/createcard.js
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js')

var that;
Page({
  data: {
    loadingSavaOrUp: false,
    images: [], //下面选择图片
    showUpButton: true,
    showCoverUpButton: true, //显示上传封面图片
    coverImg: '', //封面图片
    hasWxUserInfo: false,
    isEdit: false,
    editIndex: 0,

    cardData: {
      "url": "/V1/product/saveOrUpdate.do",
      'data': {
        'code': '',
        'cardCode': '',
        'name': '',
        'title': '',
        'price': '',
        'unit': '',
        "detail": "",

        "pImgList": new Array(),

        'language': ''
      }
    },
    deletePicData: {
      "url": "/V1/product/delete/picture",
      'data': {
        paths: new Array(),
      }
    },
    getData: {
      url: "/V1/product/prodByCode.do?code="
    }
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
  cardDataPrice: function(e) {
    this.setData({
      'cardData.data.price': e.detail.value
    })
  },

  cardDataUnit: function(e) {
    this.setData({
      'cardData.data.unit': e.detail.value
    })
  },
  cardDataDetail: function(e) {
    this.setData({
      'cardData.data.detail': e.detail.value
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

  //选择f封面 s
  chooseCover: function() {
    // 选择图片
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'], // 可以指定i来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var imageN = that.data.images.length
        var list = res.tempFiles
        if (list.length > 0) {
          if (list[0].size >= (1024 * 1024 * 3)) {
            app.showErrorMsg("图片不能大于3M")
          } else {
            that.setData({
              coverImg: res.tempFilePaths[0],
              showCoverUpButton: false
            });
            var imagesList = new Array();
            app.uploadFile({}, list[0].path, function(res) {
              var rest = JSON.parse(res.data);
              rest.result.isCover = "Y"
              for (var i = 0; i < that.data.cardData.data.pImgList.length; i++) {
                if (that.data.cardData.data.pImgList[i].isCover == 'Y') {
                  that.data.cardData.data.pImgList[i].isDelete = 'Y'
                }
              }

              that.data.cardData.data.pImgList.push(rest.result)



            }, app.globalData.upPImageUrl);
          }

        }



      }
    })
  },
  //选择f封面 e
  //删除封面照片 s
  deleteCoverImage: function(e) {
    for (var i = 0; i < that.data.cardData.data.pImgList.length; i++) {
      if (that.data.cardData.data.pImgList[i].isCover == 'Y') {
        that.data.cardData.data.pImgList[i].isDelete = 'Y'
      }
    }
    that.setData({
      coverImg: '',
      showCoverUpButton: true
    });
  },
  //删除封面照片 e



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

  //下面选择图片 s
  chooseImage: function() {
    // 选择图片
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var imageN = that.data.images.length
        var showT = false;

        var list = res.tempFiles
        for (var i = 0; i < list.length; i++) {
          if (list[i].size >= (1024 * 1024 * 3)) {
            showT = true;
          } else {
            imageN++;
            that.data.images.push({
              src: list[i].path,
              index: that.data.cardData.data.pImgList.length
            });

            var imagesList = new Array();
            app.uploadFile({}, list[i].path, function(res) {
              var rest = JSON.parse(res.data);
              that.data.cardData.data.pImgList.push(rest.result)

            }, app.globalData.upPImageUrl);
          }
          if (imageN >= app.globalData.productImgLimNum) {
            break;
          }
        }
        that.setData({
          images: that.data.images
        });
        imageN = that.data.images.length
        if (imageN >= app.globalData.productImgLimNum && !showT) {
          wx.showToast({
            icon: "none",
            title: '只能上传' + app.globalData.productImgLimNum + '张图片,且不能大于3M',
            duration: 2000
          })
          that.setData({
            showUpButton: false
          });
        } else if (showT) {
          wx.showToast({
            icon: "none",
            title: '图片不能大于3M',
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

    this.data.cardData.data.pImgList[e.currentTarget.dataset.ind].isDelete = "Y";

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

    if (options.type == "0") {
      that.setData({
        'cardData.data.cardCode': options.code
      })
      wx.setNavigationBarTitle({
        title: '新增产品'
      })
    } else if (options.type == "1") {
      app.getData(this.data.getData.url + options.code + "&isShare=false", function(res) {
        if (res.status == 200) {
          var showImgButtton = true;
          var cover = '';
          //控制是否增加照片按钮
          if (res.result.pImgList.length >= app.globalData.productImgLimNum) {
            showImgButtton = false;
          }
          if (res.result.avatarUrl.indexOf("moren.png")>0){
            cover = app.globalData.pimageUrl + encodeURI(res.result.avatarUrl);
          }else{
            cover = app.globalData.pimageUrl+encodeURI(res.result.avatarUrl);
          }
          that.setData({
            coverImg: cover,
            "cardData.data": res.result,
            images: util.imgObToListWithIndexDeleteCover(res.result.pImgList, app.globalData.pimageUrl),
            showUpButton: showImgButtton,
            showCoverUpButton: false
          })
        } else {
          app.showErrorMsg(res.msg)
        }
      })

      wx.setNavigationBarTitle({
        title: '编辑产品'
      })

    }





  },

  onReady: function() {
    // 页面渲染完成  
  },
  onShow: function() {
    if (wx.getStorageSync("wxUserInfo") == '' && wx.getStorageSync("userInfo") == '') {
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
    wx.showModal({
      title: '提示',
      content: '您发布的内容将提交管理员审核通过方可发表。发表的内容及图片一旦涉黄、毒，和违反国家法律法规。我们将一律拒绝通过。同时可能会永久封闭您的账号和报备微信官方。',
      showCancel: false,
      success: function(res) {
        if (res.confirm) {
          if (e.detail.value.title === '') {
            wx.showToast({
              title: '产品标题必填',
              image: '../../images/error.png',
              duration: 2000
            })
            return;
          }
          if (e.detail.value.name === '') {
            wx.showToast({
              title: '产品名称必填',
              image: '../../images/error.png',
              duration: 2000
            })
            return;
          }
          if (e.detail.value.price === '') {
            wx.showToast({
              title: '单价必填',
              image: '../../images/error.png',
              duration: 2000
            })
            return;
          }

          that.setData({
            'loadingSavaOrUp': true
          })
          app.postData(that.data.cardData, function(res) {
            if (res.status == 200) {
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
          }, null, function() {
            that.setData({
              'loadingSavaOrUp': false
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })






  },

  formReset: function() {
    console.log('form发生了reset事件')
  }
})
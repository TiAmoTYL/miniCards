// pages/cardcase/cardcase.js
var app = getApp()
var that;
Page({
    data: {
      //滑动
      lastX: 0,
      lastY: 0,
      touchDotX: 0,
      touchDotY: 0,
      istouch: true,

      //标签
      labels: new Array(),


      cardcasedata: [],
      labelListData: new Array(),


      isbindCompanyId: false,
      userCardData: {
        'url': '/V1/cardcase/cardList.do',
        'data': {
          'sortType': 0,
          "labelCode": '',
          'key': '',
          'openId': ''
        }
      },
      labelData: {
        'url': '/V1/label/List.do',
        'openId': ''

      },

      //0724滑动
      winHeight: "", //窗口高度
      currentTab: 0, //预设当前项的值
      scrollLeft: 0, //tab标题的滚动条位置


    },

    //0724 滑动 E
    // 滚动切换标签样式
    switchTab: function(e) {
      var i = e.detail.current
      var list = this.data.labelListData[i];
      this.data.labelListData[i - 1] = this.data.cardcasedata;

      // if (list == undefined || list.length==0){
      this.setData({
        "userCardData.data.key": '',
        "userCardData.data.labelCode": that.data.labels[i].code,
        "cardcasedata": []
      })
      this.getUserCardData();
      // }else{
      //   this.setData({
      //     "cardcasedata": list
      //   });
      // }
      this.setData({
        currentTab: e.detail.current
      });
      this.checkCor();

    },
    // 点击标题切换当前页时改变样式
    swichNav: function(e) {
  
      var cur = e.target.dataset.current;
      if (this.data.currentTab == cur) {
        this.setData({
          "userCardData.data.key": ''
        })
        this.getUserCardData();
      } else {
        this.setData({
          currentTab: cur
        })
      }
    },
    //判断当前滚动超过一屏时，设置tab标题滚动条。
    checkCor: function() {
      if (this.data.currentTab > 4) {
        this.setData({
          scrollLeft: 300
        })
      } else {
        this.setData({
          scrollLeft: 0
        })
      }
    },
    //0724 滑动 E



    //拨打电话
    phoneCall: function(e) {
      wx.makePhoneCall({
        phoneNumber: e.target.dataset.id //仅为示例，并非真实的电话号码
      })
    },
    //显示大图
    showImg: function(e) {
      wx.previewImage({
        current: '', // 当前显示图片的http链接
        urls: [e.currentTarget.dataset.path] // 需要预览的图片http链接列表
      })
    },
    //获取个人名片数据
    getUserCardData: function() {
      var that = this;
      app.postData(that.data.userCardData, function(res) {

        if (res.status == 200) {
          that.setData({
            cardcasedata: res.result
          })
        } else {
          app.showErrorMsg(res.msg)
        }


      })
    },
    //获取标签
    getLabel: function() {
      var that = this;
      app.getData(this.data.labelData.url + "?openId=" + this.data.labelData.openId, function(res) {
        if (res.status == 200) {
          var obj = {
            "code": "",
            "createTime": "2018-06-22T12:40:59.000+0000",
            "isDelete": "N",
            "name": "全部"
          }
          res.result.splice(0, 0, obj);
          that.setData({
            "labels": res.result,
          })
          // var list = res.result;
          // var names = new Array();
          // for (var i = 0; i < list.length; i++) {
          //   names.push(list[i].name)
          // }
          // that.setData({
          //   labelName: names
          // })
        }
      })
    },


    //获取搜索数据
    bindSearchData: function(e) {
      this.setData({
        'userCardData.data.key': e.detail.value.trim(),
      })

    },
    getSearchData: function(e) {
      if (e.detail.value) {
        this.bindSearchData(e);
      }
      that.getUserCardData();
    },






    setDddGroupName: function(e) {
      var that = this
      that.setData({
        isaddgroupinput: true
      })
    },
    //滑动开始
    handleStart: function(e) {
      var that = this
      if (that.data.userCardData.data.sortType == 3 && that.data.isselecgroup) {
        if (e.currentTarget.dataset.name != '公司资源') {
          that.setData({
            touchDotX: e.touches[0].pageX,
            touchDotY: e.touches[0].pageY
          })
        }
      }

    },
    //滑动过程中
    handleMove: function(e) {


      if (that.data.userCardData.data.sortType == 3 && that.data.isselecgroup) {
        if (e.currentTarget.dataset.name != '公司资源') {
          var touchMoveX = e.touches[0].pageX,
            touchMoveY = e.touches[0].pageY,


            X = touchMoveX - that.data.touchDotX,
            Y = touchMoveY - that.data.touchDotY

          if (Math.abs(X) > Math.abs(Y) && X > 0) {
            // right alert('向右')
            that.data.cardcasedata.map(function(v, i) {
              v.items.map(function(v2, i2) {
                if (v2.id === e.currentTarget.dataset.id) {
                  v2.radio = false
                }
              })
            })
            that.setData({
              ismovebtn: false,
              cardcasedata: that.data.cardcasedata
            })
          }

          if (Math.abs(X) > Math.abs(Y) && X < 0) {
            // right alert('向左')
            if (X < -50) {
              that.data.cardcasedata.map(function(v, i) {
                v.items.map(function(v2, i2) {
                  v2.radio = false
                  if (v2.id === e.currentTarget.dataset.id) {
                    v2.radio = true
                  }
                })
              })
              that.setData({
                ismovebtn: true,
                cardcasedata: that.data.cardcasedata
              })
            }
          }
        }
      }
    },
    handleSkip: function(e) {
      wx.navigateTo({
        url: '../carddetails/carddetails?code=' + e.currentTarget.dataset.id + '&type=2&canDele=1'
      })
    },
    //隐藏遮罩层
    hideMade: function() {
      var that = this
      that.data.cardcasedata.map(function(v, i) {
        v.items.map(function(v2, i2) {
          v2.radio = false
        })
      })
      that.setData({
        ismovebtn: false,
        cardcasedata: that.data.cardcasedata
      })
    },
    onLoad: function(e) {
      that = this

      //that.getUserCardData()
      wx.getSystemInfo({
        success: function(res) {
          var clientHeight = res.windowHeight,
            clientWidth = res.windowWidth,
            rpxR = 750 / clientWidth;
          var calc = clientHeight * rpxR - 180;
          that.setData({
            winHeight: calc
          });
        }
      });
    },
    onShow: function() {
      var that = this
      var userInfo = wx.getStorageSync("userInfo")
      this.setData({
        "userCardData.data.key": '',
        "userCardData.data.openId": userInfo.openId,
        "labelData.openId": userInfo.openId,
      })
      this.getLabel();
      that.getUserCardData()
    },

  }

)
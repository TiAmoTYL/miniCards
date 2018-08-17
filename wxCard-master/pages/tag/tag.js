// pages/visitor/visitor.js
var app = getApp()
var that;
Page({
  data: {
    cardCode: "",
    labelList: [],

    label: {
      url: "/V1/label/savaOrUpdate.do",
      data: {
        name: "",
        openId: ""
      }
    },
    getLabel: {
      url: "/V1/label/List.do",
      data: {
        openId: ""
      }
    },
    getSeleLabel: {
      url: '/V1/label/ListByCardCode.do?cardCode='
    },
    savaLabels: {
      url: "/V1/label/cardLabel/savaOrUpdate.do",
      data: {
        list: new Array(),
      }
    },
    deleteLabels: {
      url: "/V1/label/cardLabel/delete.do",
      data: {
        list: new Array(),
        openId: "",
      }
    },
    selectLabel: {},

  },
  //选标签
  selectLabelA: function (e) {
    this.data.selectLabel[e.currentTarget.dataset.code] = !this.data.selectLabel[e.currentTarget.dataset.code]
    this.setData({
      selectLabel: this.data.selectLabel,
    })
  },
  newLabelName: function (e) {
    this.setData({
      'label.data.name': e.detail.value.replace(/\s+/g, '')
    })
  },

  addLabel: function () {
    console.log("addLabel")
    if (this.data.labelList.length >= 15) {
      app.showErrorMsg("最多只能建立十五个标签")
      return;
    }
    if (this.data.label.data.name == '') {
      app.showErrorMsg("名字不能为空");
      return;
    }

    app.postData(this.data.label, function (res) {
      if (res.status == 200) {

        that.data.labelList.push(res.result);
        that.setData({
          labelList: that.data.labelList,
          "label.data.name": ''
        })
      } else {
        app.showErrorMsg(res.msg);
      }
    });
  },
  deleteLabel: function (e) {
    var obj = this.data.selectLabel;
    if (obj != '') {
      var list = new Array();
      for (var key in obj) {
        if (obj[key]) {
          var obj1 = key.split("_");
          var obj2 = {
            cardCode: that.data.cardCode,
            labelCode: obj1[0],
            labelName: obj1[1],
          }
          list.push(obj2)
        }
      }
      that.setData({
        "deleteLabels.data.list":list
      })
    }

    app.postData(that.data.deleteLabels,function(res){
      that.getLabels();
      that.getHasLabels(that.data.cardCode);
    });
  },
  confirmLabel: function () {
    let tagName = "";
    var obj = this.data.selectLabel;
    if (obj != '') {
      var list = new Array();
      for (var key in obj) {
        if (obj[key]) {
          var obj1 = key.split("_");
          var obj2 = {
            cardCode: that.data.cardCode,
            labelCode: obj1[0],
            labelName: obj1[1],
          }
          tagName = tagName + "、" + obj1[1];
          list.push(obj2)
        }


      }
      tagName = tagName.substring(1, tagName.length)
      that.setData({
        "savaLabels.data.list": list,
      });
      app.postData(this.data.savaLabels, function () { });

    }


    wx.setStorageSync("confirmLabel", tagName);
    wx.navigateBack({
      delta: 1,
    })
  },
//获取已有的标签
  getHasLabels:function(code){
    app.getData(this.data.getSeleLabel.url + code, function (res) {
      if (res.status == 200) {
        var list = res.result;
        var selec = {};
        for (var i = 0; i < list.length; i++) {
          var obj = list[i];
          selec[obj.labelCode + "_" + obj.labelName] = true;
        }
        that.setData({
          selectLabel: selec,
        })

      } else {
        app.showErrorMsg(res.msg);
      }
    });
  },
  //获取当前标签列表
  getLabels:function(){
    app.getData(this.data.getLabel.url + "?openId=" + this.data.getLabel.data.openId, function (res) {
      if (res.status == 200) {
        that.setData({
          labelList: res.result
        })
      } else {
        app.showErrorMsg(res.msg);
      }
    });
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    that = this

    that.setData({
      "cardCode": options.code
    })
    var userInfo = wx.getStorageSync("userInfo");
    this.setData({
      "getLabel.data.openId": userInfo.openId,
      "label.data.openId": userInfo.openId,
      "deleteLabels.data.openId": userInfo.openId,
    })
    //获取当前标签列表
    this.getLabels()

    //获取已经有的标签
    this.getHasLabels(options.code);

  },
  onShow: function () {

  },
  onReady: function () {
    // 页面渲染完成
    console.log(this.data.customData)
  },

  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})
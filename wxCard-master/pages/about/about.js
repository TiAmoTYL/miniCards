// pages/about/about.js
var app = getApp()
Page({
  data:{
    aboutImg: app.globalData.aboutImg,
    about:true,
  },
  copyText: function (e) {
    app.setCBData("183257877@qq.com");
  },
  onLoad:function(options){

    if (options.type=='1'){
      this.setData({
        about:false
      })
    }
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})
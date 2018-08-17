// pages/template/template.js
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})



//const AV = require('../../../utils/av-weapp.js')
// var that;
// Page({
//   data: {
//     images: ["http://old.bz55.com/uploads/allimg/130302/1-130302112325.jpg", "http://old.bz55.com/uploads/allimg/130302/1-130302112325.jpg" ],
//     imageWidth: getApp().screenWidth / 4 - 10
//   },
//   onLoad: function (options) {
//     that = this;
//     // 取出商品id
//     var objectId = options.objectId;
//     // 存在当前页面data中，以提交评价表使用
//     that.setData({
//       objectId: objectId
//     });
//     console.log(objectId);
//   },
//   getContent: function (e) {
//     that.setData({
//       content: e.detail.value
//     });
//   },
//   chooseImage: function () {
//     // 选择图片
//     wx.chooseImage({
//       sizeType: ['compressed'],
//       sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
//       success: function (res) {
//         // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
//         var tempFilePaths = res.tempFilePaths;
//         console.log(tempFilePaths);
//         that.setData({
//           images: that.data.images.concat(tempFilePaths)
//         });
//       }
//     })
//   },
//   previewImage: function () {
//     // 预览图集
//     wx.previewImage({
//       urls: that.data.images
//     });
//   },

//   delete: function (e) {
//     var index = e.currentTarget.dataset.index;
//     var images = that.data.images;
//     images.splice(index, 1);
//     that.setData({
//       images: images
//     });
//   }
// })
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    collections: []
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    app.http.get('/site/product/collections', {}, function(res) {
      console.log(res);
      that.setData({
        collections: res.result
      })
    })
  },
  selectStore: function (e) {
    var merchantId = e.currentTarget.dataset.merchant
    wx.navigateTo({
      url: '../product-list/product-list?merchantId=' + merchantId
    })
  }
})
